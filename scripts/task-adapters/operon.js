#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PRIORITY_MAP = { urgent: "S", high: "A", medium: "C", low: "D", none: "E" };
const STATUS_MAP = {
  proposed: "Project.Brainstorming",
  ready: "Project.Planned",
  executing: "Project.InProgress",
  waiting_human: "Project.Paused",
  blocked: "Project.Paused",
};

function operonBin() {
  if (process.env.RYAN_OPERON_BIN) return process.env.RYAN_OPERON_BIN;
  try {
    return childProcess.execFileSync("sh", ["-lc", "command -v operon"], { encoding: "utf8" }).trim() || "operon";
  } catch (_error) {
    const codexTools = path.join(process.env.CODEX_HOME || path.join(process.env.HOME || "", ".codex"), "tools", "operon-cli");
    try {
      const versions = fs.readdirSync(codexTools).sort().reverse();
      for (const version of versions) {
        const candidate = path.join(codexTools, version, "node_modules", ".bin", "operon");
        if (fs.existsSync(candidate)) return candidate;
      }
    } catch (_nestedError) { /* Fall through to the normal PATH error. */ }
    return "operon";
  }
}

function run(args, input) {
  const result = childProcess.spawnSync(operonBin(), args, {
    input,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  if (result.error) throw new Error("Operon operation failed: " + result.error.message);
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || "Operon operation failed").trim().slice(0, 1200));
  try { return JSON.parse(result.stdout || "{}"); }
  catch (_error) { throw new Error("Operon returned invalid JSON"); }
}

function quote(value) {
  return JSON.stringify(String(value || ""));
}

function planDescription(plan, action) {
  return [
    `来源会议：${plan.meeting.title}（${plan.meeting.date}）`,
    `负责人：${action.owner || "待确认"}`,
    `下一步：${action.nextAction || "待补"}`,
    `完成标准：${action.outcome || "待补"}`,
    action.description ? `上下文：${action.description}` : "",
    "来源正文未写入 Operon；仅保留脱敏行动摘要。",
  ].filter(Boolean).join("；");
}

function compactLine(plan, action) {
  const fields = [
    `note::${quote(planDescription(plan, action))}`,
    `tags::${quote("meeting-action")}`,
  ];
  if (PRIORITY_MAP[action.priority]) fields.push(`priority::${quote(PRIORITY_MAP[action.priority])}`);
  if (STATUS_MAP[action.status]) fields.push(`status::${quote(STATUS_MAP[action.status])}`);
  if (action.dueDate) fields.push(`dateDue::${quote(action.dueDate)}`);
  return `${quote(action.title)} ${fields.join(" ")}`;
}

function extractPlanRef(response) {
  return response?.client?.planRef || response?.result?.client?.planRef || response?.planRef || "";
}

function extractPlan(response) {
  return response?.result?.plan || response?.plan || null;
}

function extractCreateEffects(response) {
  return response?.result?.plan?.createEffects || response?.plan?.createEffects || [];
}

function planKey(plan) {
  return `${plan.meeting.date}-${crypto.createHash("sha256").update(plan.meeting.title).digest("hex").slice(0, 12)}`;
}

function preview(plan, options = {}) {
  const response = run(["task", "create", "--input-format", "compact-lines", "--input", "-", "--json"], plan.actions.map((action) => compactLine(plan, action)).join("\n") + "\n");
  const planRef = extractPlanRef(response);
  const previewPlan = extractPlan(response);
  const effects = extractCreateEffects(response);
  if (!planRef || !previewPlan || effects.length !== plan.actions.length) throw new Error("Operon preview did not return one sealed plan with every action");
  const entries = plan.actions.map((action, index) => ({
    actionId: action.id,
    title: action.title,
    taskId: effects[index].operonId,
  }));
  const result = {
    protocolVersion: 1,
    backend: "operon",
    planKey: planKey(plan),
    actionIds: plan.actions.map((action) => action.id),
    meeting: plan.meeting,
    actionCount: entries.length,
    requiresHumanConfirmation: true,
    planRef,
    preview: previewPlan,
    entries,
    next: "人工确认后，使用同一 preview-file 执行 apply；不要重新 preview。",
  };
  if (options.previewFile) {
    const file = path.resolve(options.previewFile);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(result, null, 2) + "\n", "utf8");
    result.previewFile = file;
  }
  return result;
}

function apply(plan, previewFile) {
  const file = path.resolve(previewFile);
  const stored = JSON.parse(fs.readFileSync(file, "utf8"));
  if (stored.backend !== "operon" || !Array.isArray(stored.entries) || stored.entries.length === 0) throw new Error("Invalid Operon preview file");
  if (stored.planKey !== planKey(plan) || JSON.stringify(stored.actionIds) !== JSON.stringify(plan.actions.map((action) => action.id))) {
    throw new Error("Operon preview does not match the supplied action plan; create a new preview and review it first");
  }
  if (!stored.planRef || stored.entries.some((entry) => !entry.taskId || !entry.actionId)) throw new Error("Operon preview entry is incomplete");
  const response = run(["plan", "apply", stored.planRef, "--json"]);
  const applied = stored.entries.map((entry) => ({
    actionId: entry.actionId,
    title: entry.title,
    taskId: entry.taskId,
    reread: get(entry.taskId),
  }));
  return { applied: true, backend: "operon", previewFile: file, planRef: stored.planRef, response, entries: applied, next: "逐条回读 taskId 验证正文与字段，再进入验收。" };
}

function get(taskId) {
  return run(["task", "get", "--id", taskId, "--json"]);
}

module.exports = { compactLine, preview, apply, get, planDescription };

if (require.main === module) {
  try {
    const [command, planFile, previewFile] = process.argv.slice(2);
    const plan = planFile ? JSON.parse(fs.readFileSync(path.resolve(planFile), "utf8")) : null;
    if (command === "preview") console.log(JSON.stringify(preview(plan, { previewFile }), null, 2));
    else if (command === "apply") console.log(JSON.stringify(apply(plan, previewFile), null, 2));
    else throw new Error("Usage: operon.js preview PLAN.json [PREVIEW.json] | apply PLAN.json PREVIEW.json");
  } catch (error) {
    console.error(error.message || String(error));
    process.exitCode = 1;
  }
}

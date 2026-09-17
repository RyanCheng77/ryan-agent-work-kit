#!/usr/bin/env node

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PROTOCOL_VERSION = 1;
const STATUSES = new Set(["proposed", "ready", "executing", "waiting_human", "blocked", "ready_for_report", "reported", "accepted"]);
const PRIORITIES = new Set(["none", "urgent", "high", "medium", "low"]);
const RISKS = new Set(["low", "medium", "high"]);
const OPERON_ADAPTER = path.join(__dirname, "task-adapters", "operon.js");

function usage() {
  console.log(`Ryan Personal Loop

Usage:
  ryan-personal-loop validate PLAN.json
  ryan-personal-loop preview PLAN.json [--backend taskboard|operon] [--taskboard-project PROJECT_ID] [--preview-file PATH]
  ryan-personal-loop apply PLAN.json [--backend operon --preview-file PATH]
  ryan-personal-loop apply PLAN.json --backend taskboard --taskboard-project PROJECT_ID [--parent-id TASK_ID]
  ryan-personal-loop status --parent TASK_ID
  ryan-personal-loop report --parent TASK_ID
  ryan-personal-loop h2-preview PLAN.json
  ryan-personal-loop h2-apply PLAN.json --h2-file /path/to/H2.md
  ryan-personal-loop learn PLAN.json [--vault /path/to/vault] [--no-obsidian]

The plan is agent-produced JSON. This tool validates, deduplicates, and records it;
it does not interpret meeting transcripts or execute high-risk actions.`);
}

function parseArgs(args) {
  const options = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) { options._.push(value); continue; }
    const key = value.slice(2);
    if (["help", "no-obsidian"].includes(key)) { options[key] = true; continue; }
    const next = args[index + 1];
    if (!next || next.startsWith("--")) throw new Error("Missing value for --" + key);
    options[key] = next;
    index += 1;
  }
  return options;
}

function text(value, field, required = false, max = 2400) {
  if (value === undefined || value === null) {
    if (required) throw new Error("Missing required field: " + field);
    return "";
  }
  if (typeof value !== "string") throw new Error(field + " must be a string");
  const result = value.trim();
  if (required && !result) throw new Error("Missing required field: " + field);
  if (result.length > max) throw new Error(field + " exceeds " + max + " characters");
  return result;
}

function readPlan(file) {
  const planPath = path.resolve(file);
  let plan;
  try { plan = JSON.parse(fs.readFileSync(planPath, "utf8")); }
  catch (error) { throw new Error("Cannot read plan JSON: " + error.message); }
  validatePlan(plan);
  return plan;
}

function validatePlan(plan) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) throw new Error("plan must be a JSON object");
  if (plan.protocolVersion !== PROTOCOL_VERSION) throw new Error("protocolVersion must be 1");
  if (!plan.meeting || typeof plan.meeting !== "object") throw new Error("meeting is required");
  text(plan.meeting.title, "meeting.title", true, 240);
  const date = text(plan.meeting.date, "meeting.date", true, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new Error("meeting.date must be YYYY-MM-DD");
  if (plan.source !== undefined && (!plan.source || typeof plan.source !== "object")) throw new Error("source must be an object");
  if (!Array.isArray(plan.actions) || plan.actions.length === 0 || plan.actions.length > 100) throw new Error("actions must contain 1-100 items");
  const ids = new Set();
  for (const [index, action] of plan.actions.entries()) {
    if (!action || typeof action !== "object") throw new Error(`actions[${index}] must be an object`);
    const id = text(action.id, `actions[${index}].id`, true, 64);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(id)) throw new Error(`actions[${index}].id contains unsupported characters`);
    if (ids.has(id)) throw new Error("duplicate action id: " + id);
    ids.add(id);
    text(action.title, `actions[${index}].title`, true, 240);
    text(action.description || "", `actions[${index}].description`);
    text(action.nextAction || "", `actions[${index}].nextAction`);
    text(action.outcome || "", `actions[${index}].outcome`);
    if (action.owner !== "ryan") throw new Error(`actions[${index}].owner must be ryan; other people's tasks stay out of the personal loop`);
    if (action.priority !== undefined && !PRIORITIES.has(action.priority)) throw new Error(`unsupported priority for ${id}`);
    if (action.risk !== undefined && !RISKS.has(action.risk)) throw new Error(`unsupported risk for ${id}`);
    if (action.status !== undefined && !STATUSES.has(action.status)) throw new Error(`unsupported status for ${id}`);
    if (action.dueDate !== undefined && action.dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(String(action.dueDate))) throw new Error(`dueDate for ${id} must be YYYY-MM-DD`);
    if (action.dependsOn !== undefined && (!Array.isArray(action.dependsOn) || action.dependsOn.some((dependency) => typeof dependency !== "string"))) throw new Error(`dependsOn for ${id} must be an array of action ids`);
  }
  for (const action of plan.actions) for (const dependency of action.dependsOn || []) if (!ids.has(dependency)) throw new Error(`${action.id} depends on unknown action ${dependency}`);
  if (plan.taskboard !== undefined && (!plan.taskboard || typeof plan.taskboard !== "object")) throw new Error("taskboard must be an object");
  return plan;
}

function planKey(plan) {
  const safeDate = plan.meeting.date.replace(/[^0-9-]/g, "");
  const fingerprint = crypto.createHash("sha256").update(plan.meeting.title).digest("hex").slice(0, 12);
  return safeDate + "-" + fingerprint;
}

function marker(plan, actionId) { return `<!-- ryan-personal-loop: ${planKey(plan)}${actionId ? ":" + actionId : ""} -->`; }

function actionDescription(plan, action) {
  return [
    marker(plan, action.id),
    `行动项 ID：${action.id}`,
    `来源会议：${plan.meeting.title}（${plan.meeting.date}）`,
    `负责人：Ryan`,
    `风险：${action.risk || "medium"}；执行器：${action.executor || "codex"}`,
    `下一步：${action.nextAction || "待补"}`,
    `完成标准：${action.outcome || "待补"}`,
    action.description ? `上下文：${action.description}` : "",
    plan.source?.noteTitle ? `会议纪要：${plan.source.noteTitle}` : "",
    plan.source?.url && /^https?:\/\//.test(plan.source.url) ? `原始链接：${plan.source.url}` : "",
    "安全边界：高风险外部发送、发布、删除、授权、付款和不可逆操作必须等待 Ryan 明确批准。",
  ].filter(Boolean).join("\n");
}

function boardStatusFor(action) {
  const execution = action.status || "ready";
  if (action.risk === "high" || ["proposed", "waiting_human"].includes(execution) || ["ryan", "manual"].includes(action.executor)) return "backlog";
  if (execution === "blocked") return "blocked";
  return "todo";
}

function taskctl(args) {
  const command = process.env.RYAN_TASKCTL_BIN || "taskctl";
  try {
    const result = childProcess.spawnSync(command, [...args, "--json"], { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || "taskctl failed").trim().slice(0, 800));
    try { return JSON.parse(result.stdout || "{}"); }
    catch (_error) { throw new Error("taskctl returned invalid JSON"); }
  } catch (error) { throw new Error("Taskboard operation failed: " + error.message); }
}

function taskFrom(response) { return response && response.task ? response.task : response; }

function projectId(options, plan) {
  return options["taskboard-project"] || plan.taskboard?.projectId || process.env.RYAN_TASKBOARD_PROJECT || "";
}

function backend(options) {
  return options.backend || process.env.RYAN_TASK_BACKEND || "operon";
}

function preview(plan, options) {
  if (backend(options) === "operon") {
    if (!fs.existsSync(OPERON_ADAPTER)) throw new Error("Operon adapter not found");
    const adapter = require(OPERON_ADAPTER);
    const result = adapter.preview(plan, { previewFile: options["preview-file"] });
    return console.log(JSON.stringify(result, null, 2));
  }
  const project = projectId(options, plan) || "<required for apply>";
  console.log(JSON.stringify({
    protocolVersion: PROTOCOL_VERSION,
    planKey: planKey(plan),
    meeting: plan.meeting,
    source: plan.source || null,
    taskboard: { projectId: project, parent: plan.taskboard?.parentId || "create-on-apply", childCount: plan.actions.length },
    actions: plan.actions.map((action) => ({ id: action.id, title: action.title, risk: action.risk || "medium", priority: action.priority || "medium", dueDate: action.dueDate || null, dependsOn: action.dependsOn || [], executor: action.executor || "codex", taskboardStatus: boardStatusFor(action) })),
    gates: ["仅 owner=ryan 的事项进入个人 H2", "高风险动作只记录为待人工确认", "apply 可重复运行且按 action id 去重", "Taskboard 进入 in_review 后仍需 Ryan 明确验收才能 done"],
  }, null, 2));
}

function findExisting(tasks, wantedMarker) {
  return (tasks || []).find((entry) => String(entry.description || "").includes(wantedMarker));
}

function applyPlan(plan, options) {
  if (backend(options) === "operon") {
    if (!options["preview-file"]) throw new Error("Operon apply requires --preview-file PATH from the reviewed preview");
    const adapter = require(OPERON_ADAPTER);
    return console.log(JSON.stringify(adapter.apply(plan, options["preview-file"]), null, 2));
  }
  const project = projectId(options, plan);
  if (!project) throw new Error("apply requires --taskboard-project PROJECT_ID");
  const listResponse = taskctl(["issue", "list", "--project", project, "--archived", "false"]);
  const tasks = listResponse.tasks || listResponse.issues || [];
  let parentId = options["parent-id"] || plan.taskboard?.parentId || "";
  let parent;
  if (parentId) parent = taskFrom(taskctl(["issue", "get", parentId]));
  else {
    const parentMarker = marker(plan);
    parent = findExisting(tasks, parentMarker);
    if (!parent) {
      parent = taskFrom(taskctl(["issue", "create", "--project", project, "--title", `会议行动：${plan.meeting.title}`, "--description", [parentMarker, `会议日期：${plan.meeting.date}`, "用途：个人行动项父任务；子任务由 Ryan Personal Loop 管理。", "安全边界：不自动执行高风险外部动作，不自动标记完成。"].join("\n"), "--status", "backlog", "--priority", "medium", "--labels", "personal-loop,meeting"]));
    }
    parentId = parent.id || parent.identifier;
  }
  if (!parentId) throw new Error("Taskboard did not return a parent task id");

  const created = [];
  const taskMap = new Map();
  for (const action of plan.actions) {
    const actionMarker = marker(plan, action.id);
    let task = findExisting(tasks, actionMarker);
    if (task && (task.id || task.identifier)) task = taskFrom(taskctl(["issue", "get", task.id || task.identifier]));
    if (!task) {
      task = taskFrom(taskctl([
        "issue", "create", "--project", project, "--title", action.title, "--description", actionDescription(plan, action),
        "--status", boardStatusFor(action), "--priority", action.priority || "medium", "--labels", "personal-loop,meeting-action",
        ...(action.dueDate ? ["--due-date", action.dueDate] : []),
      ]));
      created.push(action.id);
    }
    const taskId = task.id || task.identifier;
    if (!taskId) throw new Error("Taskboard did not return an id for action " + action.id);
    taskMap.set(action.id, taskId);
    const detail = task.relations ? task : taskFrom(taskctl(["issue", "get", taskId]));
    if (!detail.relations?.parent || (detail.relations.parent.id !== parentId && detail.relations.parent.identifier !== parentId)) {
      taskctl(["issue", "relation", "add", taskId, "--type", "parent", "--issue", parentId]);
    }
  }
  const relations = [];
  for (const action of plan.actions) for (const dependency of action.dependsOn || []) {
    const childId = taskMap.get(action.id); const dependencyId = taskMap.get(dependency);
    const detail = taskFrom(taskctl(["issue", "get", childId]));
    const already = (detail.relations?.blockedBy || []).some((item) => item.id === dependencyId || item.identifier === dependencyId);
    if (!already) { taskctl(["issue", "relation", "add", childId, "--type", "blocked_by", "--issue", dependencyId]); relations.push(`${action.id} blocked_by ${dependency}`); }
  }
  console.log(JSON.stringify({ applied: true, projectId: project, parentId, createdActionIds: created, taskIds: Object.fromEntries(taskMap), relations, next: "只有低/中风险且可由 agent 执行的 todo 子任务可被自动认领；高风险或 Ryan 亲自处理项留在 backlog 等待闸门。" }, null, 2));
}

function boardStatus(parentId) {
  const parent = taskFrom(taskctl(["issue", "get", parentId]));
  const children = parent.relations?.subIssues || [];
  const counts = {};
  for (const child of children) counts[child.status] = (counts[child.status] || 0) + 1;
  console.log(JSON.stringify({ parent: { id: parent.identifier || parent.id, title: parent.title, status: parent.status }, counts, children: children.map((child) => ({ id: child.identifier || child.id, title: child.title, status: child.status, dueDate: child.dueDate || null })) }, null, 2));
}

function report(parentId) {
  const parent = taskFrom(taskctl(["issue", "get", parentId]));
  const children = parent.relations?.subIssues || [];
  const lines = [`## Personal Loop 汇报：${parent.title}`, "", `父任务状态：${parent.status}`, "", "| 行动项 | 状态 | 截止时间 |", "| --- | --- | --- |"];
  for (const child of children) lines.push(`| ${String(child.title).replace(/\|/g, "\\|")} | ${child.status} | ${child.dueDate || "待补"} |`);
  lines.push("", "> 本汇报由 Ryan Personal Loop 生成；`done` 仍需 Ryan 明确验收。", "");
  const body = lines.join("\n");
  taskctl(["comment", "add", parentId, "--body", body]);
  console.log(JSON.stringify({ reported: true, parentId, childCount: children.length, body }, null, 2));
}

function sourceLine(plan) {
  const source = plan.source || {};
  const note = source.noteTitle ? `[[${source.noteTitle.replace(/[\[\]]/g, "")}]]` : "会议纪要";
  const link = source.url && /^https?:\/\//.test(source.url) ? ` · [原始链接](${source.url})` : "";
  return `会议纪要与原始归档：${note}${link}`;
}

function renderH2(plan) {
  const lines = [marker(plan), `## ${plan.meeting.date} 个人待办（${plan.meeting.title}）`, "", sourceLine(plan), ""];
  for (const action of plan.actions) {
    const due = action.dueDate ? `(@${action.dueDate})` : "（待补截止时间）";
    const next = action.nextAction ? `（下一步：${action.nextAction}）` : "";
    lines.push(`- [ ] ${action.title}${next} ${due}`);
  }
  return lines.join("\n");
}

function h2(plan, options, apply) {
  const output = renderH2(plan);
  if (!apply) return console.log(output);
  const file = options["h2-file"];
  if (!file) throw new Error("h2-apply requires --h2-file PATH");
  const target = path.resolve(file);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (current.includes(marker(plan))) return console.log(JSON.stringify({ applied: false, reason: "meeting already exists", file: target }, null, 2));
  let next = current.trimEnd();
  next = next ? next + "\n\n" + output + "\n" : output + "\n";
  if (next.startsWith("---\n")) next = next.replace(/^(---\n[\s\S]*?)(^---\n)/m, (all, front, close) => front.replace(/^updated:.*$/m, `updated: ${new Date().toISOString().slice(0, 10)}`) + close);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, next, "utf8");
  console.log(JSON.stringify({ applied: true, file: target, actionCount: plan.actions.length }, null, 2));
}

function configuredVault(project, options) {
  if (options.vault) return path.resolve(options.vault);
  const config = path.join(project, ".ryan-agent-work-kit", "obsidian-bridge.env");
  if (!fs.existsSync(config)) return "";
  const line = fs.readFileSync(config, "utf8").split(/\r?\n/).find((entry) => /^RYAN_OBSIDIAN_VAULT=/.test(entry));
  return line ? line.slice("RYAN_OBSIDIAN_VAULT=".length).replace(/^['"]|['"]$/g, "") : "";
}

function runCapture(project, payload) {
  const adapter = path.join(project, "scripts", "ryan-memory-adapter.js");
  if (!fs.existsSync(adapter)) return { skipped: true, reason: "memory adapter not found" };
  const result = childProcess.spawnSync(process.execPath, [adapter, "capture", "--client", "personal-loop", "--project", project], { input: JSON.stringify(payload), encoding: "utf8", maxBuffer: 1024 * 1024 });
  if (result.status !== 0) throw new Error("MemOS capture failed: " + (result.stderr || result.stdout || "").trim().slice(0, 500));
  return JSON.parse(result.stdout);
}

function learn(plan, options) {
  const project = path.resolve(options.project || process.cwd());
  const payload = {
    summary: `会议行动闭环：${plan.meeting.title}（${plan.meeting.date}），已结构化 ${plan.actions.length} 个 Ryan 行动项，Taskboard/H2 可分别追踪。`,
    evidence: `协议 v${PROTOCOL_VERSION}；行动项 ID：${plan.actions.map((action) => action.id).join(", ")}。仅记录摘要，不上传会议原文。`,
    scope: "task-experience",
    confidence: "medium",
    tags: ["personal-loop", "meeting-to-outcome", "taskboard", "obsidian"],
    taskId: plan.taskboard?.parentId || "",
  };
  const memory = runCapture(project, payload);
  let obsidian = { skipped: true, reason: "--no-obsidian" };
  if (!options["no-obsidian"]) {
    const vault = configuredVault(project, options);
    if (vault) {
      const script = path.join(project, "scripts", "sync-project-learning.sh");
      if (fs.existsSync(script)) {
        const body = [`## 会议行动闭环`, `- 会议：${plan.meeting.title}（${plan.meeting.date}）`, `- 行动项：${plan.actions.length} 个 Ryan 事项`, `- 协议：v${PROTOCOL_VERSION}`, "", "## 可复用经验", "- 会议纪要先转成带 owner、下一步、完成标准和风险的结构化行动计划，再分别写入 Taskboard 与 H2。", "- MemOS 只接收摘要和验证证据，会议原文继续留在 Obsidian。"].join("\n");
        const result = childProcess.spawnSync("bash", [script, "--project", "personal-loop", "--source-repo", project, "--vault", vault], { input: body, encoding: "utf8", maxBuffer: 1024 * 1024 });
        if (result.status !== 0) throw new Error("Obsidian sync failed: " + (result.stderr || result.stdout || "").trim().slice(0, 500));
        obsidian = { applied: true, file: result.stdout.trim() };
      } else obsidian = { skipped: true, reason: "learning sync script not found" };
    } else obsidian = { skipped: true, reason: "no Obsidian bridge configured; pass --vault or run setup-obsidian-bridge.sh" };
  }
  console.log(JSON.stringify({ learned: true, memory, obsidian }, null, 2));
}

function main() {
  const [command, ...args] = process.argv.slice(2); const options = parseArgs(args);
  if (!command || command === "help" || command === "--help" || command === "-h" || options.help) return usage();
  if (command === "status") return boardStatus(options.parent || options._[0]);
  if (command === "report") return report(options.parent || options._[0]);
  const planFile = options._[0];
  if (!planFile) throw new Error(command + " requires PLAN.json");
  const plan = readPlan(planFile);
  if (command === "validate") return console.log(JSON.stringify({ valid: true, protocolVersion: PROTOCOL_VERSION, planKey: planKey(plan), actionCount: plan.actions.length }, null, 2));
  if (command === "preview") return preview(plan, options);
  if (command === "apply") return applyPlan(plan, options);
  if (command === "h2-preview") return h2(plan, options, false);
  if (command === "h2-apply") return h2(plan, options, true);
  if (command === "learn") return learn(plan, options);
  usage(); throw new Error("Unknown command: " + command);
}

try { main(); } catch (error) { console.error(error.message || String(error)); process.exitCode = 1; }

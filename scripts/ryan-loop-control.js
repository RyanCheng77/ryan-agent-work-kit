#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const VERSION = 1;
const RISKS = new Set(["low", "medium", "high"]);
const MODES = new Set(["hard", "advisory"]);
const RESULTS = new Set(["succeeded", "failed", "blocked", "canceled"]);

function usage() {
  console.log(`Ryan Loop Control

Usage:
  ryan-loop-control policy validate POLICY.json
  ryan-loop-control approval request REQUEST.json --state STATE.json [--run RUN_ID]
  ryan-loop-control approval decide --state STATE.json --approval APPROVAL_ID --decision approved|rejected --actor Ryan
  ryan-loop-control run admit RUN.json --policy POLICY.json --state STATE.json [--apply]
  ryan-loop-control run resume --run RUN_ID --policy POLICY.json --state STATE.json [--apply]
  ryan-loop-control run heartbeat --run RUN_ID --state STATE.json
  ryan-loop-control run close --run RUN_ID --state STATE.json --result succeeded|failed|blocked|canceled [--reported-tokens N] [--measurement exact|estimated|unknown]
  ryan-loop-control recover --policy POLICY.json --state STATE.json [--apply]

The controller admits or pauses runs. It never invokes an agent or modifies a task system.`);
}

function parseArgs(args) {
  const options = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) { options._.push(value); continue; }
    const key = value.slice(2);
    if (["apply", "help"].includes(key)) { options[key] = true; continue; }
    const next = args[index + 1];
    if (!next || next.startsWith("--")) throw new Error("Missing value for --" + key);
    options[key] = next;
    index += 1;
  }
  return options;
}

function required(value, name, max = 4000) {
  if (typeof value !== "string" || !value.trim()) throw new Error("Missing required field: " + name);
  const result = value.trim();
  if (result.length > max) throw new Error(name + " exceeds " + max + " characters");
  return result;
}

function integer(value, name, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(name + " must be an integer between " + min + " and " + max);
  return value;
}

function readJson(file, label) {
  try { return JSON.parse(fs.readFileSync(path.resolve(file), "utf8")); }
  catch (error) { throw new Error("Cannot read " + label + ": " + error.message); }
}

function writeJson(file, value) {
  const target = path.resolve(file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function now() { return new Date().toISOString(); }
function at(value, name) {
  const parsed = Date.parse(value || "");
  if (Number.isNaN(parsed)) throw new Error(name + " must be an ISO date-time");
  return parsed;
}
function day(value) { return new Date(value).toISOString().slice(0, 10); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }

function validatePolicy(policy) {
  if (!policy || typeof policy !== "object" || Array.isArray(policy)) throw new Error("policy must be an object");
  if (policy.protocolVersion !== VERSION) throw new Error("policy.protocolVersion must be " + VERSION);
  for (const field of ["enabled", "pauseSwitch"]) if (typeof policy[field] !== "boolean") throw new Error("policy." + field + " must be boolean");
  integer(policy.scanIntervalMinutes, "policy.scanIntervalMinutes", 5, 1440);
  integer(policy.maxConcurrentRuns, "policy.maxConcurrentRuns", 1, 20);
  integer(policy.maxRunsPerDay, "policy.maxRunsPerDay", 1, 100);
  integer(policy.perTaskMaxAttempts, "policy.perTaskMaxAttempts", 1, 10);
  integer(policy.cooldownMinutes, "policy.cooldownMinutes", 0, 10080);
  integer(policy.heartbeatTimeoutMinutes, "policy.heartbeatTimeoutMinutes", 1, 1440);
  integer(policy.maxRunMinutes, "policy.maxRunMinutes", 1, 1440);
  integer(policy.maxContextChars, "policy.maxContextChars", 1000, 1000000);
  if (!MODES.has(policy.tokenBudgetMode)) throw new Error("policy.tokenBudgetMode must be hard or advisory");
  integer(policy.maxTokensPerRun, "policy.maxTokensPerRun", 1, 10000000);
  integer(policy.maxTokensPerDay, "policy.maxTokensPerDay", policy.maxTokensPerRun, 100000000);
  integer(policy.approvalTtlMinutes, "policy.approvalTtlMinutes", 1, 10080);
  return policy;
}

function blankState() {
  return { protocolVersion: VERSION, approvals: {}, runs: [] };
}

function stateFrom(file) {
  const target = path.resolve(file);
  if (!fs.existsSync(target)) return blankState();
  const state = readJson(target, "state");
  if (!state || state.protocolVersion !== VERSION || !state.approvals || !Array.isArray(state.runs)) throw new Error("Unsupported loop state");
  return state;
}

function validateRun(run) {
  if (!run || typeof run !== "object" || Array.isArray(run)) throw new Error("run must be an object");
  if (run.protocolVersion !== VERSION) throw new Error("run.protocolVersion must be " + VERSION);
  required(run.runId, "run.runId", 120);
  required(run.taskId, "run.taskId", 240);
  required(run.actionHash, "run.actionHash", 128);
  if (!RISKS.has(run.risk)) throw new Error("run.risk must be low, medium, or high");
  if (typeof run.autoClaimable !== "boolean") throw new Error("run.autoClaimable must be boolean");
  integer(run.contextChars, "run.contextChars", 0, 10000000);
  integer(run.requestedTokens, "run.requestedTokens", 1, 10000000);
  required(run.expectedOutcome, "run.expectedOutcome", 1000);
  required(run.acceptanceCriteria, "run.acceptanceCriteria", 2000);
  required(run.stopCondition, "run.stopCondition", 1000);
  if (run.requiresApproval !== undefined && typeof run.requiresApproval !== "boolean") throw new Error("run.requiresApproval must be boolean");
  if (run.approvalId !== undefined) required(run.approvalId, "run.approvalId", 120);
  return run;
}

function validateRequest(request, policy) {
  if (!request || typeof request !== "object" || Array.isArray(request)) throw new Error("approval request must be an object");
  if (request.protocolVersion !== VERSION) throw new Error("approval.protocolVersion must be " + VERSION);
  const requestId = required(request.approvalId, "approval.approvalId", 120);
  const taskId = required(request.taskId, "approval.taskId", 240);
  const actionHash = required(request.actionHash, "approval.actionHash", 128);
  const requestedAction = required(request.requestedAction, "approval.requestedAction", 2400);
  if (request.decisionOwner !== "Ryan") throw new Error("approval.decisionOwner must be Ryan");
  const expiresAt = request.expiresAt || new Date(Date.now() + policy.approvalTtlMinutes * 60000).toISOString();
  at(expiresAt, "approval.expiresAt");
  return { approvalId: requestId, taskId, operonId: request.operonId || null, actionHash, requestedAction, decisionOwner: "Ryan", expiresAt };
}

function activeRuns(state, policy, clock = Date.now()) {
  return state.runs.filter((entry) => entry.status === "running" && clock - at(entry.lastHeartbeatAt, "run.lastHeartbeatAt") <= policy.heartbeatTimeoutMinutes * 60000 && clock - at(entry.startedAt, "run.startedAt") <= policy.maxRunMinutes * 60000);
}

function taskAttempts(state, taskId) { return state.runs.filter((entry) => entry.taskId === taskId && entry.admittedAt).length; }
function todayRuns(state, clock) { const today = day(clock); return state.runs.filter((entry) => entry.admittedAt && day(entry.admittedAt) === today); }
function todayReserved(state, clock) { return todayRuns(state, clock).reduce((total, entry) => total + (entry.requestedTokens || 0), 0); }

function decision(policy, state, run, clock = Date.now()) {
  const reasons = []; const warnings = [];
  if (!policy.enabled || policy.pauseSwitch) reasons.push("scheduler_paused");
  if (!run.autoClaimable) reasons.push("not_auto_claimable");
  if (run.risk === "high") reasons.push("high_risk_requires_human_dispatch");
  if (run.contextChars > policy.maxContextChars) reasons.push("context_limit_exceeded");
  if (run.requestedTokens > policy.maxTokensPerRun) reasons.push("per_run_budget_exceeded");
  if (todayRuns(state, clock).length >= policy.maxRunsPerDay) reasons.push("daily_run_limit_reached");
  if (taskAttempts(state, run.taskId) >= policy.perTaskMaxAttempts) reasons.push("task_attempt_limit_reached");
  if (activeRuns(state, policy, clock).length >= policy.maxConcurrentRuns) reasons.push("concurrency_limit_reached");
  const previous = state.runs.filter((entry) => entry.taskId === run.taskId && entry.endedAt).sort((a, b) => at(b.endedAt, "run.endedAt") - at(a.endedAt, "run.endedAt"))[0];
  if (previous && clock - at(previous.endedAt, "run.endedAt") < policy.cooldownMinutes * 60000) reasons.push("task_cooldown_active");
  const projected = todayReserved(state, clock) + run.requestedTokens;
  if (projected > policy.maxTokensPerDay) {
    if (policy.tokenBudgetMode === "hard") reasons.push("daily_token_budget_exceeded");
    else warnings.push("daily_token_budget_advisory_exceeded");
  }
  if (run.requiresApproval) {
    const approval = state.approvals[run.approvalId];
    if (!approval) reasons.push("approval_missing");
    else if (approval.status !== "approved") reasons.push("approval_not_approved");
    else if (approval.usedAt) reasons.push("approval_already_consumed");
    else if (approval.taskId !== run.taskId || approval.actionHash !== run.actionHash) reasons.push("approval_action_mismatch");
    else if (clock > at(approval.expiresAt, "approval.expiresAt")) reasons.push("approval_expired");
  }
  return { admitted: reasons.length === 0, reasons, warnings, projectedDailyTokens: projected, policySnapshot: { scanIntervalMinutes: policy.scanIntervalMinutes, maxConcurrentRuns: policy.maxConcurrentRuns, maxRunsPerDay: policy.maxRunsPerDay, perTaskMaxAttempts: policy.perTaskMaxAttempts, tokenBudgetMode: policy.tokenBudgetMode } };
}

function writeResult(value) { console.log(JSON.stringify(value, null, 2)); }

function requestApproval(file, options) {
  const policy = validatePolicy(readJson(options.policy || path.join(__dirname, "..", "templates", "loop-control-policy.json"), "policy"));
  const request = validateRequest(readJson(file, "approval request"), policy);
  const state = stateFrom(required(options.state, "--state", 2000));
  const existing = state.approvals[request.approvalId];
  if (existing && (existing.taskId !== request.taskId || existing.actionHash !== request.actionHash)) throw new Error("approvalId is already bound to a different action");
  if (!existing) state.approvals[request.approvalId] = { ...request, status: "pending", requestedAt: now(), usedAt: null, runId: options.run || null };
  if (options.run) {
    const run = state.runs.find((entry) => entry.runId === options.run);
    if (!run) throw new Error("run not found: " + options.run);
    run.status = "waiting_human"; run.waitingApprovalId = request.approvalId; run.lastHeartbeatAt = now();
  }
  writeJson(options.state, state);
  writeResult({ requested: !existing, approval: state.approvals[request.approvalId], runPaused: Boolean(options.run) });
}

function decideApproval(options) {
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath);
  const approval = state.approvals[required(options.approval, "--approval", 120)];
  if (!approval) throw new Error("approval not found");
  if (required(options.actor, "--actor", 80) !== approval.decisionOwner) throw new Error("only the decision owner can decide this approval");
  const result = required(options.decision, "--decision", 20);
  if (!["approved", "rejected"].includes(result)) throw new Error("--decision must be approved or rejected");
  if (approval.status !== "pending") throw new Error("approval is already " + approval.status);
  if (Date.now() > at(approval.expiresAt, "approval.expiresAt")) { approval.status = "expired"; writeJson(statePath, state); throw new Error("approval expired"); }
  approval.status = result; approval.decidedAt = now(); approval.decidedBy = options.actor;
  writeJson(statePath, state); writeResult({ decided: true, approval });
}

function admitRun(file, options) {
  const policy = validatePolicy(readJson(required(options.policy, "--policy", 2000), "policy"));
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath);
  const run = validateRun(readJson(file, "run"));
  if (state.runs.some((entry) => entry.runId === run.runId)) throw new Error("runId already exists");
  const result = decision(policy, state, run);
  if (result.admitted && options.apply) {
    const timestamp = now();
    state.runs.push({ ...run, status: "running", admittedAt: timestamp, startedAt: timestamp, lastHeartbeatAt: timestamp, endedAt: null, reportedTokens: null, measurement: "unknown" });
    if (run.requiresApproval) state.approvals[run.approvalId].usedAt = timestamp;
    writeJson(statePath, state);
  }
  writeResult({ ...result, applied: Boolean(result.admitted && options.apply), runId: run.runId });
}

function resumeRun(options) {
  const policy = validatePolicy(readJson(required(options.policy, "--policy", 2000), "policy"));
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath);
  const run = state.runs.find((entry) => entry.runId === required(options.run, "--run", 120));
  if (!run) throw new Error("run not found");
  if (run.status !== "waiting_human") throw new Error("only waiting_human runs may resume");
  const approval = state.approvals[run.waitingApprovalId];
  const allowed = Boolean(approval && approval.status === "approved" && !approval.usedAt && approval.taskId === run.taskId && approval.actionHash === run.actionHash && Date.now() <= at(approval.expiresAt, "approval.expiresAt"));
  if (allowed && options.apply) { const timestamp = now(); run.status = "running"; run.lastHeartbeatAt = timestamp; approval.usedAt = timestamp; }
  if (allowed && options.apply) writeJson(statePath, state);
  writeResult({ resumed: allowed, applied: Boolean(allowed && options.apply), reason: allowed ? null : "approval_not_usable", runId: run.runId });
}

function heartbeat(options) {
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath);
  const run = state.runs.find((entry) => entry.runId === required(options.run, "--run", 120));
  if (!run) throw new Error("run not found");
  if (run.status !== "running") throw new Error("only running runs can heartbeat");
  run.lastHeartbeatAt = now(); writeJson(statePath, state); writeResult({ heartbeated: true, runId: run.runId, lastHeartbeatAt: run.lastHeartbeatAt });
}

function closeRun(options) {
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath);
  const run = state.runs.find((entry) => entry.runId === required(options.run, "--run", 120));
  if (!run) throw new Error("run not found");
  const result = required(options.result, "--result", 30); if (!RESULTS.has(result)) throw new Error("unsupported --result");
  const reported = options["reported-tokens"] === undefined ? 0 : Number(options["reported-tokens"]);
  integer(reported, "--reported-tokens", 0, 10000000);
  const measurement = options.measurement || "unknown"; if (!["exact", "estimated", "unknown"].includes(measurement)) throw new Error("unsupported --measurement");
  run.status = result === "succeeded" ? "ready_for_acceptance" : result; run.endedAt = now(); run.reportedTokens = reported; run.measurement = measurement;
  writeJson(statePath, state); writeResult({ closed: true, runId: run.runId, status: run.status, reportedTokens: reported, measurement, acceptanceRequired: result === "succeeded" });
}

function recover(options) {
  const policy = validatePolicy(readJson(required(options.policy, "--policy", 2000), "policy"));
  const statePath = required(options.state, "--state", 2000); const state = stateFrom(statePath); const clock = Date.now();
  const expired = state.runs.filter((entry) => entry.status === "running" && (clock - at(entry.lastHeartbeatAt, "run.lastHeartbeatAt") > policy.heartbeatTimeoutMinutes * 60000 || clock - at(entry.startedAt, "run.startedAt") > policy.maxRunMinutes * 60000));
  if (options.apply) for (const run of expired) { run.status = "timed_out"; run.endedAt = now(); run.timeoutReason = clock - at(run.lastHeartbeatAt, "run.lastHeartbeatAt") > policy.heartbeatTimeoutMinutes * 60000 ? "heartbeat_timeout" : "max_run_timeout"; }
  if (options.apply && expired.length) writeJson(statePath, state);
  writeResult({ timedOutRunIds: expired.map((entry) => entry.runId), applied: Boolean(options.apply), next: expired.length ? "No automatic replay. Inspect the evidence, then create a new run only if the policy still admits it." : "No stale running work." });
}

function main() {
  const raw = process.argv.slice(2);
  const [group, command, ...rest] = raw; const options = parseArgs(rest);
  if (!group || group === "help" || options.help) return usage();
  if (group === "policy" && command === "validate") { const policy = validatePolicy(readJson(options._[0], "policy")); return writeResult({ valid: true, protocolVersion: VERSION, policy }); }
  if (group === "approval" && command === "request") return requestApproval(options._[0], options);
  if (group === "approval" && command === "decide") return decideApproval(options);
  if (group === "run" && command === "admit") return admitRun(options._[0], options);
  if (group === "run" && command === "resume") return resumeRun(options);
  if (group === "run" && command === "heartbeat") return heartbeat(options);
  if (group === "run" && command === "close") return closeRun(options);
  if (group === "recover") return recover(parseArgs(raw.slice(1)));
  usage(); throw new Error("Unknown command");
}

try { main(); } catch (error) { console.error(error.message || String(error)); process.exitCode = 1; }

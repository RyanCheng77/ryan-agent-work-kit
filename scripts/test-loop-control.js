#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ryan-loop-control-"));
const policy = path.join(temp, "policy.json");
const state = path.join(temp, "state.json");
const run = path.join(temp, "run.json");
const request = path.join(temp, "approval.json");

function assert(condition, message) { if (!condition) throw new Error(message); }
function write(file, value) { fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
function runCommand(args) {
  const result = childProcess.spawnSync(process.execPath, [path.join(root, "scripts", "ryan-loop-control.js"), ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout).trim());
  return JSON.parse(result.stdout);
}

try {
  write(policy, { protocolVersion: 1, enabled: true, pauseSwitch: false, scanIntervalMinutes: 20, maxConcurrentRuns: 1, maxRunsPerDay: 2, perTaskMaxAttempts: 2, cooldownMinutes: 30, heartbeatTimeoutMinutes: 20, maxRunMinutes: 15, maxContextChars: 24000, tokenBudgetMode: "hard", maxTokensPerRun: 12000, maxTokensPerDay: 20000, approvalTtlMinutes: 120 });
  write(run, { protocolVersion: 1, runId: "run-1", taskId: "OPERON-1", operonId: "op-1", actionHash: "action-v1", risk: "medium", autoClaimable: true, contextChars: 8000, requestedTokens: 6000, expectedOutcome: "A verified draft", acceptanceCriteria: "Ryan can review the draft", stopCondition: "Pause before external publication", requiresApproval: true, approvalId: "approve-1" });
  write(request, { protocolVersion: 1, approvalId: "approve-1", taskId: "OPERON-1", operonId: "op-1", actionHash: "action-v1", requestedAction: "Publish the verified draft", decisionOwner: "Ryan" });

  assert(runCommand(["policy", "validate", policy]).valid, "policy should validate");
  assert(runCommand(["run", "admit", run, "--policy", policy, "--state", state]).admitted === false, "unapproved run must be denied");
  assert(runCommand(["approval", "request", request, "--state", state]).requested, "approval should be created once");
  assert(runCommand(["approval", "decide", "--state", state, "--approval", "approve-1", "--decision", "approved", "--actor", "Ryan"]).decided, "Ryan should approve");
  const admitted = runCommand(["run", "admit", run, "--policy", policy, "--state", state, "--apply"]);
  assert(admitted.admitted && admitted.applied, "approved run should admit once");
  assert(runCommand(["run", "heartbeat", "--state", state, "--run", "run-1"]).heartbeated, "running task should heartbeat");
  assert(runCommand(["run", "close", "--state", state, "--run", "run-1", "--result", "succeeded", "--reported-tokens", "5800", "--measurement", "estimated"]).acceptanceRequired, "successful run needs human acceptance");

  const next = { ...JSON.parse(fs.readFileSync(run, "utf8")), runId: "run-2", actionHash: "action-v2", requestedTokens: 16000, requiresApproval: false };
  const nextFile = path.join(temp, "next.json"); write(nextFile, next);
  const budget = runCommand(["run", "admit", nextFile, "--policy", policy, "--state", state]);
  assert(budget.admitted === false && budget.reasons.includes("per_run_budget_exceeded"), "hard budget should block oversized runs");
  const snapshot = JSON.parse(fs.readFileSync(state, "utf8"));
  snapshot.runs.push({ ...snapshot.runs[0], runId: "stale-run", status: "running", startedAt: "2020-01-01T00:00:00.000Z", lastHeartbeatAt: "2020-01-01T00:00:00.000Z", endedAt: null }); write(state, snapshot);
  const recovered = runCommand(["recover", "--policy", policy, "--state", state, "--apply"]);
  assert(recovered.timedOutRunIds.includes("stale-run"), "stale runs should time out without replay");
  console.log("loop-control tests: pass");
} finally { fs.rmSync(temp, { recursive: true, force: true }); }

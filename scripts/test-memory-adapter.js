#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const kitRoot = path.resolve(__dirname, "..");
const tempProject = fs.mkdtempSync(path.join(os.tmpdir(), "ryan-memory-contract-"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(args, input) {
  const result = childProcess.spawnSync(
    process.execPath,
    [path.join(tempProject, "scripts", "ryan-memory-adapter.js"), ...args, "--project", tempProject],
    { input, encoding: "utf8" },
  );
  return { ...result, json: result.stdout ? JSON.parse(result.stdout) : null };
}

function writeConfig(config) {
  fs.writeFileSync(
    path.join(tempProject, ".ryan-agent-work-kit", "memory", "adapter.json"),
    JSON.stringify(config),
  );
}

try {
  const providerDir = path.join(tempProject, "scripts", "memory-providers");
  fs.mkdirSync(path.join(tempProject, ".ryan-agent-work-kit", "memory"), { recursive: true });
  fs.mkdirSync(providerDir, { recursive: true });
  fs.copyFileSync(path.join(kitRoot, "scripts", "ryan-memory-adapter.js"), path.join(tempProject, "scripts", "ryan-memory-adapter.js"));
  fs.copyFileSync(path.join(kitRoot, "scripts", "trace-cli-run.js"), path.join(tempProject, "scripts", "trace-cli-run.js"));

  const providerPath = path.join(providerDir, "mock-provider.js");
  fs.writeFileSync(providerPath, [
    "const input = JSON.parse(require('fs').readFileSync(0, 'utf8'));",
    "if (process.env.MOCK_PROVIDER_FAIL === '1') process.exit(1);",
    "const output = { protocolVersion: 1, provider: 'mock', available: true };",
    "if (input.operation === 'capture' || input.operation === 'trace' || input.operation === 'feedback') output.accepted = true;",
    "if (input.operation === 'recall') output.memories = [{ id: 'mock-1', summary: 'provider result' }];",
    "process.stdout.write(JSON.stringify(output));",
  ].join("\n"));

  const baseConfig = {
    backend: "file",
    captureFallback: "file",
    provider: { command: "node", args: ["scripts/memory-providers/mock-provider.js"], config: {} },
  };
  writeConfig(baseConfig);

  let result = run(["capture", "--client", "test"], JSON.stringify({ summary: "local mode stays local", scope: "task-experience" }));
  assert(result.status === 0 && result.json.provider === "file", "file mode must not invoke a configured provider");
  result = run(["feedback", "--id", "local-1", "--correction", "keep this local"]);
  assert(result.status === 0 && result.json.provider === "file", "file feedback must not invoke a configured provider");
  result = run(["trace", "--client", "test"], JSON.stringify({ sessionId: "local-session", messages: [{ role: "user", content: "local trace" }, { role: "assistant", content: "queued locally" }] }));
  assert(result.status === 0 && result.json.queued && !result.json.delivered, "file trace must be retained in the outbox");
  assert(fs.readdirSync(path.join(tempProject, ".ryan-agent-work-kit", "memory", "outbox", "pending")).length === 1, "file trace must create one pending outbox item");
  fs.writeFileSync(path.join(tempProject, "prompt.txt"), "Review the scoped files.");
  fs.writeFileSync(path.join(tempProject, "cli.log"), "assistant output from a CLI run");
  const cliTrace = childProcess.spawnSync(process.execPath, [
    path.join(tempProject, "scripts", "trace-cli-run.js"),
    "--client", "kimi", "--session-id", "cli-session", "--prompt-file", path.join(tempProject, "prompt.txt"), "--log-file", path.join(tempProject, "cli.log"), "--project", tempProject,
  ], { encoding: "utf8" });
  assert(cliTrace.status === 0 && JSON.parse(cliTrace.stdout).queued, "CLI trace helper must use the shared trace endpoint");
  assert(fs.readdirSync(path.join(tempProject, ".ryan-agent-work-kit", "memory", "outbox", "pending")).length === 2, "CLI trace helper must add one pending outbox item");

  writeConfig({ ...baseConfig, backend: "provider" });
  result = run(["recall", "--query", "test"]);
  assert(result.status === 0 && result.json.provider === "mock" && result.json.memories.length === 1, "provider mode must use the protocol provider");
  result = run(["feedback", "--id", "mock-1", "--correction", "provider correction"]);
  assert(result.status === 0 && result.json.provider === "mock", "provider feedback must use the protocol provider");
  result = run(["sync"]);
  assert(result.status === 0 && result.json.delivered === 2 && result.json.pending === 0, "sync must deliver queued traces through the provider protocol");

  const failingProviderConfig = { ...baseConfig, backend: "auto" };
  writeConfig(failingProviderConfig);
  const previousFailure = process.env.MOCK_PROVIDER_FAIL;
  process.env.MOCK_PROVIDER_FAIL = "1";
  result = run(["capture", "--client", "test"], JSON.stringify({ summary: "auto mode fallback", scope: "task-experience" }));
  if (previousFailure === undefined) delete process.env.MOCK_PROVIDER_FAIL; else process.env.MOCK_PROVIDER_FAIL = previousFailure;
  assert(result.status === 0 && result.json.provider === "file", "auto mode must fall back when its provider fails");
  process.env.MOCK_PROVIDER_FAIL = "1";
  result = run(["trace", "--client", "test"], JSON.stringify({ sessionId: "failed-session", messages: [{ role: "user", content: "trace remains queued" }] }));
  if (previousFailure === undefined) delete process.env.MOCK_PROVIDER_FAIL; else process.env.MOCK_PROVIDER_FAIL = previousFailure;
  assert(result.status === 0 && result.json.queued && !result.json.delivered, "auto trace must remain queued when provider fails");
  writeConfig({ ...baseConfig, backend: "file", traceCapture: "disabled" });
  result = run(["trace", "--client", "test"], JSON.stringify({ sessionId: "disabled-session", messages: [{ role: "user", content: "not captured" }] }));
  assert(result.status === 0 && result.json.accepted === false && result.json.queued === false, "disabled trace capture must not queue");

  writeConfig({ backend: "provider", provider: { command: "node", args: ["/tmp/unreviewed-provider.js"], config: {} } });
  result = run(["recall", "--query", "test"]);
  assert(result.status === 2 && result.stderr.includes("Refusing external memory provider"), "unreviewed external providers must be blocked");

  console.log("Memory adapter contract: pass");
} finally {
  fs.rmSync(tempProject, { recursive: true, force: true });
}

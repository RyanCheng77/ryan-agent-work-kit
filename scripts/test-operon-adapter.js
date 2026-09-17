#!/usr/bin/env node

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ryan-operon-adapter-"));
const state = path.join(temp, "state.json");
const mock = path.join(temp, "operon");
fs.writeFileSync(state, JSON.stringify({ next: 1, previews: {}, applied: [] }));
fs.writeFileSync(mock, `#!/usr/bin/env node
const fs = require('fs');
const stateFile = process.env.MOCK_OPERON_STATE;
const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
const args = process.argv.slice(2);
if (args[0] === 'task' && args[1] === 'create') {
  const input = fs.readFileSync(0, 'utf8').trim().split(/\\n/).filter(Boolean);
  const ids = input.map(() => 'mock-' + state.next++);
  const planRef = 'plan-' + ids[0];
  state.previews[planRef] = { taskIds: ids, input };
  fs.writeFileSync(stateFile, JSON.stringify(state));
  console.log(JSON.stringify({ client: { planRef }, result: { plan: { createEffects: ids.map((operonId) => ({ operonId })) } } }));
} else if (args[0] === 'plan' && args[1] === 'apply') {
  const planRef = args[2];
  if (!state.previews[planRef]) process.exit(2);
  state.applied.push(planRef);
  fs.writeFileSync(stateFile, JSON.stringify(state));
  console.log(JSON.stringify({ ok: true, result: { planRef } }));
} else if (args[0] === 'task' && args[1] === 'get') {
  console.log(JSON.stringify({ ok: true, result: { task: { operonId: args[3] } } }));
} else process.exit(2);
`);
fs.chmodSync(mock, 0o755);

try {
  const plan = {
    protocolVersion: 1,
    meeting: { title: "脱敏周会", date: "2026-09-01" },
    actions: [
      { id: "a1", title: "整理设备数据", owner: "ryan", nextAction: "汇总周度数据", outcome: "形成一页汇总", priority: "high", risk: "low", status: "ready", dueDate: "2026-09-03" },
      { id: "a2", title: "核对验收口径", owner: "ryan", nextAction: "整理检查项", outcome: "形成验收清单", priority: "medium", risk: "low", status: "ready" },
    ],
  };
  const planFile = path.join(temp, "plan.json");
  const previewFile = path.join(temp, "preview.json");
  fs.writeFileSync(planFile, JSON.stringify(plan));
  const env = { ...process.env, RYAN_OPERON_BIN: mock, MOCK_OPERON_STATE: state };
  const run = (args) => childProcess.spawnSync(process.execPath, [path.join(root, "scripts", "ryan-personal-loop.js"), ...args], { env, encoding: "utf8" });
  let result = run(["preview", planFile, "--backend", "operon", "--preview-file", previewFile]);
  assert.strictEqual(result.status, 0, result.stderr);
  const preview = JSON.parse(result.stdout);
  assert.strictEqual(preview.backend, "operon");
  assert.strictEqual(preview.requiresHumanConfirmation, true);
  assert.ok(preview.planRef);
  assert.strictEqual(preview.entries.length, 2);
  result = run(["apply", planFile, "--backend", "operon", "--preview-file", previewFile]);
  assert.strictEqual(result.status, 0, result.stderr);
  const after = JSON.parse(fs.readFileSync(state, "utf8"));
  assert.deepStrictEqual(after.applied, [preview.planRef]);
  assert.ok(JSON.parse(result.stdout).entries[0].reread, "applied task should be reread");
  console.log("operon adapter tests: pass");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

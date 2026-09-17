#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ryan-personal-loop-"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function write(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
}

function run(args, input) {
  const result = childProcess.spawnSync(process.execPath, [path.join(root, "scripts", "ryan-personal-loop.js"), ...args], {
    cwd: temp,
    input,
    encoding: "utf8",
    env: { ...process.env, RYAN_TASK_BACKEND: "taskboard", RYAN_TASKCTL_BIN: path.join(temp, "mock-taskctl.js") },
  });
  if (result.status !== 0) throw new Error(`command failed: ${args.join(" ")}\n${result.stderr || result.stdout}`);
  return result.stdout.trim();
}

const mockTaskctl = `#!/usr/bin/env node
const fs = require("fs");
const stateFile = process.env.RYAN_PERSONAL_LOOP_STATE || require("path").join(__dirname, "taskboard.json");
const args = process.argv.slice(2).filter((value) => value !== "--json");
const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : { tasks: [], comments: [], next: 1 };
const option = (name) => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
const find = (id) => state.tasks.find((task) => task.id === id || task.identifier === id);
const summary = (task) => ({ id: task.id, identifier: task.identifier, title: task.title, status: task.status, dueDate: task.dueDate || null });
const render = (task) => ({ ...task, relations: {
  parent: task.parentId ? summary(find(task.parentId)) : null,
  subIssues: state.tasks.filter((entry) => entry.parentId === task.id).map(summary),
  blockedBy: (task.blockedBy || []).map((id) => summary(find(id))),
  blocks: [], related: [],
} });
const save = () => fs.writeFileSync(stateFile, JSON.stringify(state));
if (args[0] === "issue" && args[1] === "list") console.log(JSON.stringify({ tasks: state.tasks.map(render) }));
else if (args[0] === "issue" && args[1] === "get") console.log(JSON.stringify({ task: render(find(args[2])) }));
else if (args[0] === "issue" && args[1] === "create") {
  const id = "task-" + state.next++;
  const task = { id, identifier: "TEST-" + (state.next - 1), title: option("--title"), description: option("--description") || "", status: option("--status") || "todo", priority: option("--priority") || "medium", dueDate: option("--due-date") || null, parentId: null, blockedBy: [] };
  state.tasks.push(task); save(); console.log(JSON.stringify({ task: render(task) }));
} else if (args[0] === "issue" && args[1] === "relation" && args[2] === "add") {
  const task = find(args[3]); const type = option("--type"); const related = option("--issue");
  if (type === "parent") task.parentId = related;
  if (type === "blocked_by" && !task.blockedBy.includes(related)) task.blockedBy.push(related);
  save(); console.log(JSON.stringify({ task: render(task) }));
} else if (args[0] === "comment" && args[1] === "add") {
  state.comments.push({ taskId: args[2], body: option("--body") }); save(); console.log(JSON.stringify({ comment: state.comments.at(-1) }));
} else { console.error("unsupported mock command: " + args.join(" ")); process.exit(2); }
`;

try {
  write(path.join(temp, "mock-taskctl.js"), mockTaskctl);
  fs.chmodSync(path.join(temp, "mock-taskctl.js"), 0o755);
  fs.mkdirSync(path.join(temp, "scripts"), { recursive: true });
  fs.copyFileSync(path.join(root, "scripts", "ryan-memory-adapter.js"), path.join(temp, "scripts", "ryan-memory-adapter.js"));

  const plan = {
    protocolVersion: 1,
    meeting: { title: "Weekly planning", date: "2026-09-01" },
    source: { noteTitle: "Weekly planning note", url: "https://example.com/meeting" },
    taskboard: { projectId: "test-project" },
    actions: [
      { id: "review", title: "Review brief", nextAction: "Read the brief", outcome: "Decision recorded", owner: "ryan", dueDate: "2026-09-03", priority: "high", risk: "low", executor: "codex", status: "ready", dependsOn: [] },
      { id: "send", title: "Send approved summary", nextAction: "Wait for approval", outcome: "Summary sent", owner: "ryan", priority: "medium", risk: "high", executor: "ryan", status: "waiting_human", dependsOn: ["review"] },
    ],
  };
  const planPath = path.join(temp, "plan.json");
  write(planPath, JSON.stringify(plan));

  assert(JSON.parse(run(["validate", planPath])).valid === true, "plan validation should pass");
  const preview = JSON.parse(run(["preview", planPath]));
  assert(preview.actions[0].taskboardStatus === "todo", "low-risk agent action should be todo");
  assert(preview.actions[1].taskboardStatus === "backlog", "high-risk human action should remain backlog");

  const h2Path = path.join(temp, "H2.md");
  const h2First = JSON.parse(run(["h2-apply", planPath, "--h2-file", h2Path]));
  assert(h2First.applied === true, "H2 first apply should write");
  assert(JSON.parse(run(["h2-apply", planPath, "--h2-file", h2Path])).applied === false, "H2 second apply should deduplicate");

  const first = JSON.parse(run(["apply", planPath]));
  assert(first.createdActionIds.length === 2, "first board apply should create two children");
  const second = JSON.parse(run(["apply", planPath]));
  assert(second.createdActionIds.length === 0, "second board apply should not duplicate children");
  const state = JSON.parse(fs.readFileSync(path.join(temp, "taskboard.json"), "utf8"));
  assert(state.tasks.length === 3, "board should contain one parent and two children");
  const review = state.tasks.find((task) => task.title === "Review brief");
  const send = state.tasks.find((task) => task.title === "Send approved summary");
  assert(review.status === "todo", "review should be eligible for controlled automation");
  assert(send.status === "backlog", "send should not be auto-claimed");
  assert(send.blockedBy.includes(review.id), "dependency should be represented as blocked_by");

  const status = JSON.parse(run(["status", "--parent", first.parentId]));
  assert(status.children.length === 2, "status should include children");
  assert(JSON.parse(run(["report", "--parent", first.parentId])).reported === true, "report should add a board comment");
  assert(JSON.parse(fs.readFileSync(path.join(temp, "taskboard.json"), "utf8")).comments.length === 1, "report should create one comment");

  const learning = JSON.parse(run(["learn", planPath, "--no-obsidian", "--project", temp]));
  assert(learning.memory.accepted === true, "learn should capture a bounded memory summary");
  assert(fs.existsSync(path.join(temp, ".ryan-agent-work-kit", "memory", "memories.jsonl")), "memory adapter should use a local store by default");
  console.log("personal-loop tests: pass");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

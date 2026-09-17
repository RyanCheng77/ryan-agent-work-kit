#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

function fail(message, code = 2) {
  console.error(message);
  process.exit(code);
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) fail("Unexpected argument: " + value);
    const key = value.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith("--")) fail("Missing value for --" + key);
    options[key] = next;
    index += 1;
  }
  return options;
}

function readText(filePath, field) {
  try { return fs.readFileSync(path.resolve(filePath), "utf8"); }
  catch (error) { fail("Could not read " + field + ": " + error.message); }
}

const options = parseArgs(process.argv.slice(2));
if (!options.client || !options["log-file"]) fail("--client and --log-file are required");
const project = path.resolve(options.project || process.cwd());
const adapter = path.join(project, "scripts", "ryan-memory-adapter.js");
if (!fs.existsSync(adapter)) fail("Missing project memory adapter: " + adapter);

const messages = [];
if (options["prompt-file"]) {
  messages.push({ role: "user", content: readText(options["prompt-file"], "prompt file") });
} else {
  messages.push({ role: "user", content: "CLI run captured without prompt text; see the explicit run metadata." });
}
messages.push({ role: "assistant", content: readText(options["log-file"], "CLI log") });

const input = JSON.stringify({
  client: options.client,
  sessionId: options["session-id"] || "cli-" + Date.now(),
  project: path.basename(project),
  messages,
});
const result = childProcess.spawnSync(
  process.execPath,
  [adapter, "trace", "--client", options.client, "--project", project],
  { input, encoding: "utf8" },
);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(typeof result.status === "number" ? result.status : 1);

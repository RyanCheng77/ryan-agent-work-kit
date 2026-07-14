#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const kitRoot = path.resolve(__dirname, "..");

const REQUIRED_FILES = [
  "AGENTS.md",
  "docs/project-overview.md",
  "docs/current-goal.md",
  "docs/roadmap.md",
];

const REQUIRED_DIRS = [
  "docs/qa",
  "docs/handoffs",
  "docs/plans",
];

const ADAPTER_FILES = [
  "CLAUDE.md",
  ".github/copilot-instructions.md",
  ".cursor/rules/project.mdc",
];

const SUPPORT_FILES = [
  "docs/agent-ops-observability.md",
  "docs/agent-ops-observability.zh-CN.md",
  "docs/obsidian-bridge.md",
  "docs/obsidian-bridge.zh-CN.md",
  "scripts/record-agent-ops-observation.sh",
  "scripts/setup-obsidian-bridge.sh",
  "scripts/sync-project-learning.sh",
  "scripts/sync-project-handoff.sh",
  "scripts/sync-project-retro.sh",
  "templates/obsidian-learning-note.md",
  "templates/obsidian-retro.md",
];

const SENSITIVE_PATTERNS = [
  /\.env$/,
  /\.env\./,
  /auth.*\.json$/i,
  /config\.toml$/i,
  /cookie/i,
  /token/i,
  /secret/i,
  /\.sqlite$/i,
  /\.db$/i,
  /\.log$/i,
  /\.pem$/i,
  /\.key$/i,
];

function usage() {
  console.log(`Ryan Agent Work Kit v0.4

Usage:
  ryan-agent-work-kit init [--lang en|zh-CN] [--dry-run] <project>
  ryan-agent-work-kit check <project>
  ryan-agent-work-kit doctor <project>
  ryan-agent-work-kit help

Examples:
  ryan-agent-work-kit init --lang zh-CN ./my-project
  ryan-agent-work-kit check ./my-project
  ryan-agent-work-kit doctor ./my-project`);
}

function parseOptions(args) {
  const opts = { _: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--lang") {
      const value = args[i + 1];
      if (!value || value.startsWith("-")) {
        fail("Missing value for --lang", 2);
      }
      opts.lang = value;
      i += 1;
    } else if (arg.startsWith("--lang=")) {
      opts.lang = arg.slice("--lang=".length);
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "-h" || arg === "--help") {
      opts.help = true;
    } else if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`, 2);
    } else {
      opts._.push(arg);
    }
  }
  return opts;
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function exists(target, relPath) {
  return fs.existsSync(path.join(target, relPath));
}

function isFile(target, relPath) {
  const fullPath = path.join(target, relPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
}

function isDir(target, relPath) {
  const fullPath = path.join(target, relPath);
  return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

function normalizeLang(lang) {
  const value = lang || process.env.RYAN_AGENT_WORK_KIT_LANG || "en";
  if (value === "en") return "en";
  if (value === "zh-CN" || value === "zh" || value === "cn") return "zh-CN";
  fail(`Unsupported language: ${value}\nSupported languages: en, zh-CN`, 2);
}

function templateRootFor(lang) {
  return path.join(kitRoot, "templates", lang === "zh-CN" ? "project-governance.zh-CN" : "project-governance");
}

function copyIfMissing(src, dst, dryRun) {
  if (fs.existsSync(dst)) {
    console.log(`skip existing: ${dst}`);
    return;
  }
  if (dryRun) {
    console.log(`would create: ${dst}`);
    return;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log(`created: ${dst}`);
}

function initProject(args) {
  const opts = parseOptions(args);
  if (opts.help) {
    usage();
    return;
  }
  const targetArg = opts._[0];
  if (!targetArg || opts._.length > 1) {
    usage();
    fail("init requires exactly one project path", 2);
  }

  const lang = normalizeLang(opts.lang);
  const target = path.resolve(targetArg);
  const templateRoot = templateRootFor(lang);

  if (!fs.existsSync(templateRoot)) {
    fail(`Template folder is missing: ${templateRoot}`);
  }

  if (!opts.dryRun) {
    fs.mkdirSync(target, { recursive: true });
  } else if (!fs.existsSync(target)) {
    console.log(`would create directory: ${target}`);
  }

  const templateFiles = [
    "AGENTS.md",
    "CLAUDE.md",
    ".github/copilot-instructions.md",
    ".cursor/rules/project.mdc",
    "docs/project-overview.md",
    "docs/current-goal.md",
    "docs/roadmap.md",
    "docs/qa/README.md",
    "docs/handoffs/README.md",
    "docs/plans/README.md",
  ];

  for (const relPath of templateFiles) {
    copyIfMissing(path.join(templateRoot, relPath), path.join(target, relPath), opts.dryRun);
  }
  copyIfMissing(path.join(templateRoot, "gitignore.template"), path.join(target, ".gitignore"), opts.dryRun);

  const localizedDocs = lang === "zh-CN"
    ? [
        ["docs/agent-ops-observability.zh-CN.md", "docs/agent-ops-observability.zh-CN.md"],
        ["docs/obsidian-bridge.zh-CN.md", "docs/obsidian-bridge.zh-CN.md"],
        ["docs/ai-collaboration-reflect.zh-CN.md", "docs/ai-collaboration-reflect.zh-CN.md"],
        ["templates/task-card.zh-CN.md", "templates/task-card.zh-CN.md"],
        ["templates/workflow-review.zh-CN.md", "templates/workflow-review.zh-CN.md"],
        ["templates/ai-collaboration-reflect.zh-CN.md", "templates/ai-collaboration-reflect.zh-CN.md"],
      ]
    : [
        ["docs/agent-ops-observability.md", "docs/agent-ops-observability.md"],
        ["docs/obsidian-bridge.md", "docs/obsidian-bridge.md"],
        ["docs/ai-collaboration-reflect.md", "docs/ai-collaboration-reflect.md"],
        ["templates/task-card.md", "templates/task-card.md"],
        ["templates/workflow-review.md", "templates/workflow-review.md"],
        ["templates/ai-collaboration-reflect.md", "templates/ai-collaboration-reflect.md"],
      ];

  const supportFiles = [
    ...localizedDocs,
    ["scripts/record-agent-ops-observation.sh", "scripts/record-agent-ops-observation.sh"],
    ["scripts/setup-obsidian-bridge.sh", "scripts/setup-obsidian-bridge.sh"],
    ["scripts/sync-project-learning.sh", "scripts/sync-project-learning.sh"],
    ["scripts/sync-project-handoff.sh", "scripts/sync-project-handoff.sh"],
    ["scripts/sync-project-retro.sh", "scripts/sync-project-retro.sh"],
    ["scripts/run-observable-cli.sh", "scripts/run-observable-cli.sh"],
    ["templates/obsidian-learning-note.md", "templates/obsidian-learning-note.md"],
    ["templates/obsidian-retro.md", "templates/obsidian-retro.md"],
  ];

  for (const [srcRel, dstRel] of supportFiles) {
    copyIfMissing(path.join(kitRoot, srcRel), path.join(target, dstRel), opts.dryRun);
  }

  console.log("");
  console.log(`${opts.dryRun ? "Dry run complete" : "Ryan Agent Work Kit installed"} for: ${target}`);
  console.log(`Language: ${lang}`);
  console.log("Next: open the project and tell your AI tool: Read AGENTS.md first.");
}

function checkProject(args) {
  const opts = parseOptions(args);
  const target = path.resolve(opts._[0] || ".");
  let missing = 0;

  for (const relPath of REQUIRED_FILES) {
    if (isFile(target, relPath)) {
      ok(relPath);
    } else {
      bad(`missing: ${relPath}`);
      missing += 1;
    }
  }

  for (const relPath of REQUIRED_DIRS) {
    if (isDir(target, relPath)) {
      ok(`${relPath}/`);
    } else {
      bad(`missing: ${relPath}/`);
      missing += 1;
    }
  }

  if (missing === 0) {
    console.log("AI-ready project structure: pass");
  } else {
    console.log("AI-ready project structure: needs setup");
    process.exit(1);
  }
}

function doctorProject(args) {
  const opts = parseOptions(args);
  const target = path.resolve(opts._[0] || ".");
  const results = [];

  for (const relPath of REQUIRED_FILES) {
    push(results, isFile(target, relPath) ? "pass" : "fail", relPath, "required project memory file");
  }
  for (const relPath of REQUIRED_DIRS) {
    push(results, isDir(target, relPath) ? "pass" : "fail", `${relPath}/`, "required handoff/planning folder");
  }
  for (const relPath of ADAPTER_FILES) {
    push(results, isFile(target, relPath) ? "pass" : "warn", relPath, "tool adapter for Claude Code, GitHub Copilot, or Cursor");
  }
  push(results, hasAgentRunsIgnored(target) ? "pass" : "warn", ".agent-runs/ ignored", "keeps local CLI logs out of public commits");
  push(results, hasValidationSignal(target) ? "pass" : "warn", "validation command", "package, Makefile, or common project test command detected");

  const branch = currentBranch(target);
  if (branch === "main" || branch === "master") {
    push(results, "warn", `current branch: ${branch}`, "avoid direct business work on the default branch");
  } else if (branch) {
    push(results, "pass", `current branch: ${branch}`, "task lane looks separate from the default branch");
  } else {
    push(results, "warn", "git branch", "not a git repository or branch unavailable");
  }

  const riskFiles = findRiskFiles(target);
  if (riskFiles.length > 0) {
    push(results, "warn", "sensitive/local file names", `review before publishing: ${riskFiles.slice(0, 8).join(", ")}${riskFiles.length > 8 ? " ..." : ""}`);
  } else {
    push(results, "pass", "sensitive/local file names", "no obvious risky filenames found in top-level scan");
  }

  const counts = { pass: 0, warn: 0, fail: 0 };
  for (const result of results) {
    counts[result.level] += 1;
    const label = result.level === "pass" ? "pass" : result.level === "warn" ? "warn" : "fail";
    console.log(`${label}: ${result.name} - ${result.detail}`);
  }

  console.log("");
  console.log(`Doctor summary: ${counts.pass} pass, ${counts.warn} warn, ${counts.fail} fail`);
  if (counts.fail > 0) {
    process.exit(1);
  }
}

function push(results, level, name, detail) {
  results.push({ level, name, detail });
}

function ok(message) {
  console.log(`ok: ${message}`);
}

function bad(message) {
  console.log(message);
}

function hasAgentRunsIgnored(target) {
  const candidates = [path.join(target, ".gitignore"), path.join(target, "gitignore.template")];
  const gitignore = candidates.find((candidate) => fs.existsSync(candidate));
  if (!gitignore) return false;
  const content = fs.readFileSync(gitignore, "utf8");
  return content.split(/\r?\n/).some((line) => line.trim() === ".agent-runs/" || line.trim() === "/.agent-runs/");
}

function hasValidationSignal(target) {
  const packageJson = path.join(target, "package.json");
  if (fs.existsSync(packageJson)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJson, "utf8"));
      if (pkg.scripts && (pkg.scripts.test || pkg.scripts.check || pkg.scripts.lint || pkg.scripts.build)) {
        return true;
      }
    } catch (_err) {
      return false;
    }
  }
  return ["Makefile", "justfile", "pytest.ini", "go.mod", "Cargo.toml", "pom.xml", "build.gradle", "README.md"].some((name) => fs.existsSync(path.join(target, name)));
}

function currentBranch(target) {
  try {
    return childProcess.execFileSync("git", ["-C", target, "branch", "--show-current"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (_err) {
    return "";
  }
}

function findRiskFiles(target) {
  const risks = [];
  walk(target, target, risks, 3);
  return risks;
}

function walk(root, current, risks, depthLeft) {
  if (depthLeft < 0 || risks.length >= 40) return;
  let entries = [];
  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch (_err) {
    return;
  }
  for (const entry of entries) {
    if (risks.length >= 40) return;
    if ([".git", "node_modules", "dist", "build", ".cache"].includes(entry.name)) continue;
    const fullPath = path.join(current, entry.name);
    const relPath = path.relative(root, fullPath);
    if (entry.isDirectory()) {
      if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(entry.name))) {
        risks.push(`${relPath}/`);
      }
      walk(root, fullPath, risks, depthLeft - 1);
    } else if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(entry.name) || pattern.test(relPath))) {
      risks.push(relPath);
    }
  }
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    usage();
    return;
  }

  if (command === "init") {
    initProject(args);
  } else if (command === "check") {
    checkProject(args);
  } else if (command === "doctor") {
    doctorProject(args);
  } else {
    usage();
    fail(`Unknown command: ${command}`, 2);
  }
}

main();

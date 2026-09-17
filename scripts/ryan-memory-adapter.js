#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const VALID_SCOPES = new Set(["personal-preference", "project-context", "task-experience", "agentops-observation", "candidate-skill"]);
const SECRET_PATTERN = /(sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIzaSy[A-Za-z0-9_-]{20,}|-----BEGIN .*PRIVATE KEY-----|(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password)\s*[:=]\s*\S{8,})/i;
const MAX_TEXT_LENGTH = 2400;
const MAX_TRACE_MESSAGES = 200;
const MAX_TRACE_MESSAGE_LENGTH = 12000;
const MAX_TRACE_TOTAL_LENGTH = 500000;

function fail(message, code = 1) { console.error(message); process.exit(code); }

function usage() {
  console.log([
    "Usage:",
    "  ryan-memory-adapter.js health [--project path]",
    "  ryan-memory-adapter.js recall --query <text> [--scope <scope>] [--limit <1-20>] [--project path]",
    "  ryan-memory-adapter.js capture [--client <name>] [--project path] < verified-memory.json",
    "  ryan-memory-adapter.js trace [--client <name>] [--project path] < conversation-trace.json",
    "  ryan-memory-adapter.js sync [--limit <1-100>] [--project path]",
    "  ryan-memory-adapter.js feedback --id <memory-id> --correction <text> [--project path]",
    "  ryan-memory-adapter.js promote [--apply --approved-by <name> --target <target>] [--project path] < candidate.json",
    "",
    "Scopes: " + [...VALID_SCOPES].join(", "),
    "Targets: project-docs, obsidian, candidate-skill",
    "",
    "Configuration is optional: .ryan-agent-work-kit/memory/adapter.json",
    "The default backend is file. Use an external provider for optional memory services; legacy memos mode remains for compatibility.",
  ].join("\n"));
}

function parseArgs(args) {
  const options = { _: [] };
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) { options._.push(value); continue; }
    const key = value.slice(2);
    if (["help", "apply"].includes(key)) { options[key] = true; continue; }
    const next = args[index + 1];
    if (!next || next.startsWith("--")) fail("Missing value for --" + key, 2);
    options[key] = next;
    index += 1;
  }
  return options;
}

function readJsonFile(filePath, fallback) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; fail("Could not read JSON: " + filePath); }
}

function projectRoot(options) { return path.resolve(options.project || process.cwd()); }

function memoryPaths(project) {
  const dir = path.join(project, ".ryan-agent-work-kit", "memory");
  return {
    dir,
    config: path.join(dir, "adapter.json"),
    memories: path.join(dir, "memories.jsonl"),
    feedback: path.join(dir, "feedback.jsonl"),
    outbox: path.join(dir, "outbox", "pending"),
    sent: path.join(dir, "outbox", "sent"),
    promotions: path.join(project, "docs", "memory-promotions"),
  };
}

function loadConfig(project) {
  const defaults = { backend: "file", memosUrl: "http://127.0.0.1:18801", timeoutMs: 3000, captureFallback: "file", memosAuthTokenEnv: "", memosCookieEnv: "", traceCapture: "safe", provider: { command: "", args: [], config: {} } };
  const config = { ...defaults, ...readJsonFile(memoryPaths(project).config, {}) };
  if (!["file", "provider", "memos", "auto", "none"].includes(config.backend)) fail("memory adapter backend must be file, provider, memos, auto, or none", 2);
  if (!["safe", "disabled"].includes(config.traceCapture)) fail("traceCapture must be safe or disabled", 2);
  for (const envName of [config.memosAuthTokenEnv, config.memosCookieEnv]) {
    if (envName && !/^(MEMOS_|RYAN_MEMOS_)/.test(envName)) fail("MemOS credential environment names must start with MEMOS_ or RYAN_MEMOS_", 2);
  }
  return config;
}

function hasProvider(config) {
  return Boolean(config.provider && typeof config.provider.command === "string" && config.provider.command.trim());
}

function usesProvider(config) {
  return hasProvider(config) && ["provider", "auto"].includes(config.backend);
}

function providerCommandPath(command, project) {
  if (command.includes("/") || command.includes("\\")) return path.resolve(project, command);
  return command;
}

function providerArgs(args, project) {
  if (!Array.isArray(args) || args.some((arg) => typeof arg !== "string")) fail("provider.args must be an array of strings", 2);
  return args.map((arg) => arg.startsWith("./") || arg.startsWith("scripts/") ? path.resolve(project, arg) : arg);
}

function isTrustedProviderCommand(config, project) {
  const provider = config.provider;
  const command = provider.command;
  const args = providerArgs(provider.args || [], project);
  const allowedCommands = new Set(["node", process.execPath]);
  const providerRoot = path.join(project, "scripts", "memory-providers") + path.sep;
  const localProvider = allowedCommands.has(command) && args[0] && path.resolve(args[0]).startsWith(providerRoot);
  if (!localProvider && process.env.RYAN_MEMORY_ALLOW_EXTERNAL_PROVIDER !== "1") {
    fail("Refusing external memory provider. Set RYAN_MEMORY_ALLOW_EXTERNAL_PROVIDER=1 only after reviewing its source and permissions.", 2);
  }
  return { command: providerCommandPath(command, project), args };
}

function callProvider(config, project, operation, request) {
  if (!hasProvider(config)) throw new Error("No memory provider configured");
  const provider = config.provider;
  if (SECRET_PATTERN.test(JSON.stringify(provider.config || {}))) fail("Provider configuration appears to contain a secret or credential", 2);
  const executable = isTrustedProviderCommand(config, project);
  const timeoutMs = Math.max(250, Number(provider.timeoutMs || config.timeoutMs) || 3000);
  const payload = {
    protocolVersion: 1,
    operation,
    request,
    config: provider.config && typeof provider.config === "object" ? provider.config : {},
  };
  const result = require("child_process").spawnSync(
    executable.command,
    executable.args,
    { input: JSON.stringify(payload), encoding: "utf8", timeout: timeoutMs, maxBuffer: 1024 * 1024 },
  );
  if (result.error) throw new Error("Provider process failed: " + result.error.message);
  if (result.status !== 0) {
    try {
      const errorResponse = JSON.parse(result.stdout);
      throw new Error(errorResponse.error || "Provider process failed");
    } catch (error) {
      if (error.message !== "Unexpected end of JSON input") throw error;
      throw new Error((result.stderr || "Provider process failed").trim().slice(0, 500));
    }
  }
  let response;
  try { response = JSON.parse(result.stdout); } catch (_error) { throw new Error("Provider returned invalid JSON"); }
  if (!response || response.protocolVersion !== 1 || typeof response !== "object") throw new Error("Provider returned an unsupported protocol response");
  return response;
}

function ensureScope(scope) {
  const value = scope || "task-experience";
  if (!VALID_SCOPES.has(value)) fail("Unsupported memory scope: " + value, 2);
  return value;
}

function readInputJson() {
  let raw = "";
  try { raw = fs.readFileSync(0, "utf8"); } catch (_error) { fail("Expected JSON on stdin", 2); }
  if (!raw.trim()) fail("Expected JSON on stdin", 2);
  try { return JSON.parse(raw); } catch (_error) { fail("stdin must be valid JSON", 2); }
}

function safeText(value, field, required = false) {
  if (value === undefined || value === null) { if (required) fail("Missing required field: " + field, 2); return ""; }
  if (typeof value !== "string") fail(field + " must be a string", 2);
  const normalized = value.trim();
  if (required && !normalized) fail("Missing required field: " + field, 2);
  if (normalized.length > MAX_TEXT_LENGTH) fail(field + " exceeds " + MAX_TEXT_LENGTH + " characters", 2);
  if (SECRET_PATTERN.test(normalized)) fail(field + " appears to contain a secret or credential", 2);
  return normalized;
}

function sanitizeMemory(input, client) {
  const rawTags = input.tags === undefined ? [] : input.tags;
  if (!Array.isArray(rawTags) || rawTags.some((tag) => typeof tag !== "string" || tag.length > 64)) fail("tags must be an array of short strings", 2);
  const confidence = ["low", "medium", "high"].includes(input.confidence) ? input.confidence : "medium";
  return {
    id: "local-" + crypto.randomUUID(),
    summary: safeText(input.summary, "summary", true),
    evidence: safeText(input.evidence || "", "evidence"),
    scope: ensureScope(input.scope),
    confidence,
    tags: rawTags.map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
    client: safeText(client || input.client || "unknown", "client"),
    taskId: safeText(input.taskId || "", "taskId"),
    createdAt: new Date().toISOString(),
    source: "ryan-memory-adapter",
  };
}

function traceText(value, field) {
  if (typeof value !== "string") fail(field + " must be a string", 2);
  const normalized = value.trim();
  if (normalized.length > MAX_TRACE_MESSAGE_LENGTH) fail(field + " exceeds " + MAX_TRACE_MESSAGE_LENGTH + " characters", 2);
  if (SECRET_PATTERN.test(normalized)) fail(field + " appears to contain a secret or credential", 2);
  return normalized;
}

function sanitizeTrace(input, client) {
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("trace input must be a JSON object", 2);
  if (!Array.isArray(input.messages) || input.messages.length === 0) fail("trace.messages must be a non-empty array", 2);
  if (input.messages.length > MAX_TRACE_MESSAGES) fail("trace.messages exceeds " + MAX_TRACE_MESSAGES + " messages", 2);
  const messages = input.messages.map((message, index) => {
    if (!message || typeof message !== "object") fail("trace.messages[" + index + "] must be an object", 2);
    const role = safeText(message.role || "unknown", "message role");
    return { role: role || "unknown", content: traceText(message.content || "", "message content") };
  });
  const totalLength = messages.reduce((total, message) => total + message.content.length, 0);
  if (totalLength > MAX_TRACE_TOTAL_LENGTH) fail("trace content exceeds " + MAX_TRACE_TOTAL_LENGTH + " characters", 2);
  return {
    id: "trace-" + crypto.randomUUID(),
    client: safeText(client || input.client || "unknown", "client"),
    sessionId: safeText(input.sessionId || "", "sessionId"),
    project: safeText(input.project || "", "project"),
    messages,
    createdAt: new Date().toISOString(),
    source: "ryan-memory-adapter",
  };
}

function appendJsonLine(filePath, item) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  fs.appendFileSync(filePath, JSON.stringify(item) + "\n", { encoding: "utf8", mode: 0o600 });
}

function writeJsonFile(filePath, item) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
  const temporary = filePath + ".tmp-" + process.pid;
  fs.writeFileSync(temporary, JSON.stringify(item), { encoding: "utf8", mode: 0o600 });
  fs.renameSync(temporary, filePath);
}

function pendingTraceFiles(paths) {
  try {
    return fs.readdirSync(paths.outbox).filter((name) => name.endsWith(".json")).sort().map((name) => path.join(paths.outbox, name));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

function queueTrace(paths, trace) {
  const destination = path.join(paths.outbox, trace.id + ".json");
  writeJsonFile(destination, trace);
  return destination;
}

function markTraceSent(paths, filePath, trace) {
  const destination = path.join(paths.sent, path.basename(filePath));
  fs.mkdirSync(paths.sent, { recursive: true, mode: 0o700 });
  fs.renameSync(filePath, destination);
  return destination;
}

function readJsonLines(filePath) {
  try { return fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)); }
  catch (error) { if (error.code === "ENOENT") return []; fail("Could not read memory store: " + filePath); }
}

function memosHeaders(config) {
  const headers = { "content-type": "application/json" };
  const token = config.memosAuthTokenEnv && process.env[config.memosAuthTokenEnv];
  if (token) headers.authorization = "Bearer " + token;
  const cookie = config.memosCookieEnv && process.env[config.memosCookieEnv];
  if (cookie) headers.cookie = cookie;
  return headers;
}

async function memosRequest(config, pathname, options = {}) {
  let parsedUrl;
  try { parsedUrl = new URL(config.memosUrl); } catch (_error) { fail("memosUrl must be a valid URL", 2); }
  const localHosts = new Set(["127.0.0.1", "localhost", "::1"]);
  if (!localHosts.has(parsedUrl.hostname) && process.env.RYAN_MEMORY_ALLOW_REMOTE_MEMOS !== "1") {
    fail("Refusing remote MemOS. Set RYAN_MEMORY_ALLOW_REMOTE_MEMOS=1 only after reviewing the disclosure scope.", 2);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(250, Number(config.timeoutMs) || 3000));
  try {
    const response = await fetch(String(config.memosUrl).replace(/\/$/, "") + pathname, { ...options, headers: { ...memosHeaders(config), ...(options.headers || {}) }, signal: controller.signal });
    if (!response.ok) throw new Error("MemOS HTTP " + response.status);
    return response.json();
  } finally { clearTimeout(timer); }
}

async function health(options) {
  const project = projectRoot(options); const config = loadConfig(project); const paths = memoryPaths(project);
  const base = { project, configuredBackend: config.backend, fallback: config.captureFallback, fileStore: paths.memories, pendingTraces: pendingTraceFiles(paths).length };
  if (config.backend === "none") return console.log(JSON.stringify({ ...base, available: false, provider: "none" }, null, 2));
  if (config.backend === "file") return console.log(JSON.stringify({ ...base, available: true, provider: "file" }, null, 2));
  if (usesProvider(config)) {
    try { return console.log(JSON.stringify({ ...base, ...callProvider(config, project, "health", {}) }, null, 2)); }
    catch (error) { return console.log(JSON.stringify({ ...base, available: config.backend === "auto", provider: "file", providerError: error.message }, null, 2)); }
  }
  if (config.backend === "auto") return console.log(JSON.stringify({ ...base, available: true, provider: "file", providerError: "No provider command configured; using local fallback" }, null, 2));
  if (config.backend === "provider") return console.log(JSON.stringify({ ...base, available: false, provider: "none", providerError: "No provider command configured" }, null, 2));
  try {
    const data = await memosRequest(config, "/api/v1/health", { method: "GET" });
    let authorized = "unknown";
    try {
      const auth = await memosRequest(config, "/api/v1/auth/status", { method: "GET" });
      authorized = auth.enabled === false || auth.authenticated === true;
    } catch (_error) {
      authorized = "unknown";
    }
    console.log(JSON.stringify({ ...base, available: true, provider: "memos", version: data.version || "unknown", authorized }, null, 2));
  } catch (error) { console.log(JSON.stringify({ ...base, available: config.backend === "auto", provider: "file", memosError: error.message }, null, 2)); }
}

function localScore(query, memory) {
  const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 1);
  const haystack = (memory.summary + " " + memory.evidence + " " + (memory.tags || []).join(" ")).toLowerCase();
  return words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
}

async function recall(options) {
  const query = safeText(options.query, "query", true); const scope = options.scope ? ensureScope(options.scope) : "";
  const limit = Math.min(20, Math.max(1, Number(options.limit) || 6)); const project = projectRoot(options); const config = loadConfig(project);
  if (usesProvider(config)) {
    try {
      const response = callProvider(config, project, "recall", { query, scope: scope || "all", limit });
      const memories = Array.isArray(response.memories) ? response.memories.slice(0, limit) : [];
      return console.log(JSON.stringify({ query, scope: scope || "all", provider: response.provider || "external", memories, untrusted: true }, null, 2));
    } catch (error) {
      if (config.backend !== "auto") fail("Memory provider recall failed: " + error.message);
    }
  } else if (config.backend === "provider") {
    fail("Memory provider recall failed: No provider command configured");
  }
  if (config.backend === "memos") {
    try {
      const data = await memosRequest(config, "/api/v1/memory/search", { method: "POST", body: JSON.stringify({ query, topK: { tier1: limit, tier2: limit, tier3: limit } }) });
      const memories = (data.hits || []).slice(0, limit).map((hit) => ({ id: hit.refId, kind: hit.refKind, summary: String(hit.snippet || "").slice(0, 500), score: hit.score, provider: "memos", untrusted: true }));
      return console.log(JSON.stringify({ query, scope: scope || "all", provider: "memos", memories, untrusted: true }, null, 2));
    } catch (error) { fail("MemOS recall failed: " + error.message); }
  }
  const memories = readJsonLines(memoryPaths(project).memories).filter((memory) => !scope || memory.scope === scope).map((memory) => ({ ...memory, score: localScore(query, memory), provider: "file", untrusted: true })).filter((memory) => memory.score > 0).sort((left, right) => right.score - left.score).slice(0, limit);
  console.log(JSON.stringify({ query, scope: scope || "all", provider: "file", memories, untrusted: true }, null, 2));
}

async function capture(options) {
  const project = projectRoot(options); const config = loadConfig(project); const memory = sanitizeMemory(readInputJson(), options.client);
  if (config.backend === "none") return console.log(JSON.stringify({ accepted: false, provider: "none", reason: "memory backend disabled" }, null, 2));
  if (usesProvider(config)) {
    try {
      const response = callProvider(config, project, "capture", { memory });
      if (response.accepted !== true) throw new Error("Provider did not accept the memory");
      return console.log(JSON.stringify({ accepted: true, provider: response.provider || "external", memory, result: response.result || null }, null, 2));
    } catch (error) {
      if (config.backend !== "auto" || config.captureFallback !== "file") fail("Memory provider capture failed: " + error.message);
    }
  } else if (config.backend === "provider") {
    fail("Memory provider capture failed: No provider command configured");
  }
  if (config.backend === "memos") {
    try {
      const result = await memosRequest(config, "/api/v1/import", { method: "POST", body: JSON.stringify({ version: 1, traces: [{ summary: memory.summary, userText: "", agentText: memory.evidence, tags: [memory.scope, memory.confidence, memory.client, ...memory.tags] }], policies: [], worldModels: [], skills: [] }) });
      return console.log(JSON.stringify({ accepted: true, provider: "memos", memory, result }, null, 2));
    } catch (error) { if (config.captureFallback !== "file") fail("MemOS capture failed: " + error.message); }
  }
  appendJsonLine(memoryPaths(project).memories, memory);
  console.log(JSON.stringify({ accepted: true, provider: "file", memory, note: "candidate only; promotion still needs named approval" }, null, 2));
}

function traceForLegacyMemos(trace) {
  const userText = trace.messages.filter((message) => message.role === "user").map((message) => message.content).join("\n\n");
  const agentText = trace.messages.filter((message) => message.role !== "user").map((message) => "[" + message.role + "]\n" + message.content).join("\n\n");
  return {
    version: 1,
    traces: [{ summary: trace.client + " session " + (trace.sessionId || trace.id), userText, agentText, tags: [trace.client, "conversation-trace"] }],
    policies: [],
    worldModels: [],
    skills: [],
  };
}

async function trace(options) {
  const project = projectRoot(options); const config = loadConfig(project); const paths = memoryPaths(project);
  if (config.traceCapture === "disabled") return console.log(JSON.stringify({ accepted: false, delivered: false, queued: false, provider: "none", reason: "conversation trace capture disabled" }, null, 2));
  const conversation = sanitizeTrace(readInputJson(), options.client);
  if (config.backend === "none") return console.log(JSON.stringify({ accepted: false, delivered: false, provider: "none", reason: "memory backend disabled" }, null, 2));
  const pendingPath = queueTrace(paths, conversation);

  if (usesProvider(config)) {
    try {
      const response = callProvider(config, project, "trace", { trace: conversation });
      if (response.accepted !== true) throw new Error("Provider did not accept the trace");
      const sentPath = markTraceSent(paths, pendingPath, conversation);
      return console.log(JSON.stringify({ accepted: true, delivered: true, queued: false, provider: response.provider || "external", traceId: conversation.id, sentPath, result: response.result || null }, null, 2));
    } catch (error) {
      if (config.backend !== "auto") fail("Memory provider trace failed; trace remains queued: " + error.message);
      return console.log(JSON.stringify({ accepted: true, delivered: false, queued: true, provider: "file", traceId: conversation.id, pendingPath, providerError: error.message }, null, 2));
    }
  } else if (config.backend === "provider") {
    fail("Memory provider trace failed; no provider command configured and trace remains queued");
  }

  if (config.backend === "memos") {
    try {
      const result = await memosRequest(config, "/api/v1/import", { method: "POST", body: JSON.stringify(traceForLegacyMemos(conversation)) });
      const sentPath = markTraceSent(paths, pendingPath, conversation);
      return console.log(JSON.stringify({ accepted: true, delivered: true, queued: false, provider: "memos", traceId: conversation.id, sentPath, result }, null, 2));
    } catch (error) {
      if (config.captureFallback !== "file") fail("MemOS trace failed; trace remains queued: " + error.message);
    }
  }
  console.log(JSON.stringify({ accepted: true, delivered: false, queued: true, provider: "file", traceId: conversation.id, pendingPath, note: "trace is retained locally until sync" }, null, 2));
}

async function sync(options) {
  const project = projectRoot(options); const config = loadConfig(project); const paths = memoryPaths(project);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
  const files = pendingTraceFiles(paths).slice(0, limit);
  if (files.length === 0) return console.log(JSON.stringify({ provider: "none", pending: 0, delivered: 0, failed: 0 }, null, 2));
  if (!usesProvider(config)) return console.log(JSON.stringify({ provider: "file", pending: files.length, delivered: 0, failed: 0, note: "set backend to auto or provider with a reviewed provider to sync" }, null, 2));
  let delivered = 0;
  const failures = [];
  for (const filePath of files) {
    let conversation;
    try { conversation = readJsonFile(filePath, null); } catch (error) { failures.push({ file: filePath, error: error.message }); continue; }
    try {
      const response = callProvider(config, project, "trace", { trace: conversation });
      if (response.accepted !== true) throw new Error("Provider did not accept the trace");
      markTraceSent(paths, filePath, conversation);
      delivered += 1;
    } catch (error) {
      failures.push({ file: filePath, error: error.message });
      if (config.backend === "provider") break;
    }
  }
  console.log(JSON.stringify({ provider: config.backend === "auto" ? "auto" : "external", pending: pendingTraceFiles(paths).length, delivered, failed: failures.length, failures }, null, 2));
}

async function feedback(options) {
  const project = projectRoot(options); const config = loadConfig(project); const id = safeText(options.id, "id", true); const correction = safeText(options.correction, "correction", true);
  if (usesProvider(config)) {
    try {
      const response = callProvider(config, project, "feedback", { id, correction });
      if (response.accepted !== true) throw new Error("Provider did not accept feedback");
      return console.log(JSON.stringify({ accepted: true, provider: response.provider || "external", result: response.result || null }, null, 2));
    } catch (error) {
      if (config.backend !== "auto") fail("Memory provider feedback failed: " + error.message);
    }
  } else if (config.backend === "provider") {
    fail("Memory provider feedback failed: No provider command configured");
  }
  if (config.backend === "memos") {
    try { const result = await memosRequest(config, "/api/v1/feedback", { method: "POST", body: JSON.stringify({ traceId: id, polarity: "negative", rationale: correction, channel: "ryan-memory-adapter" }) }); return console.log(JSON.stringify({ accepted: true, provider: "memos", result }, null, 2)); }
    catch (error) { fail("MemOS feedback failed: " + error.message); }
  }
  const item = { id, correction, createdAt: new Date().toISOString(), source: "ryan-memory-adapter" }; appendJsonLine(memoryPaths(project).feedback, item);
  console.log(JSON.stringify({ accepted: true, provider: "file", feedback: item }, null, 2));
}

function promote(options) {
  const candidate = sanitizeMemory(readInputJson(), "promotion-review"); const target = options.target || "project-docs";
  if (!["project-docs", "obsidian", "candidate-skill"].includes(target)) fail("Unsupported promotion target", 2);
  const report = { candidate, target, requiresApproval: true, next: "Review against current facts and validation evidence." };
  if (!options.apply) return console.log(JSON.stringify(report, null, 2));
  const approvedBy = safeText(options["approved-by"], "approved-by", true); const paths = memoryPaths(projectRoot(options)); fs.mkdirSync(paths.promotions, { recursive: true });
  const destination = path.join(paths.promotions, new Date().toISOString().slice(0, 10) + "-" + candidate.id + ".md");
  const markdown = "# Memory Promotion Proposal\n\n- Created: " + new Date().toISOString() + "\n- Target: " + target + "\n- Approved by: " + approvedBy + "\n- Source memory: " + candidate.id + "\n\n## Candidate\n\n" + candidate.summary + "\n\n## Evidence\n\n" + (candidate.evidence || "No evidence supplied.") + "\n\n## Required Review\n\nConfirm this remains true before moving it into an authoritative document, Obsidian, or a skill.\n";
  fs.writeFileSync(destination, markdown, "utf8");
  console.log(JSON.stringify({ ...report, approvedBy, proposal: destination, applied: "proposal created; authoritative files unchanged" }, null, 2));
}

async function main() {
  const [command, ...args] = process.argv.slice(2); const options = parseArgs(args);
  if (!command || options.help) return usage();
  if (command === "health") return health(options);
  if (command === "recall") return recall(options);
  if (command === "capture") return capture(options);
  if (command === "trace") return trace(options);
  if (command === "sync") return sync(options);
  if (command === "feedback") return feedback(options);
  if (command === "promote") return promote(options);
  usage(); fail("Unknown memory command: " + command, 2);
}

main().catch((error) => fail(error.message || String(error)));

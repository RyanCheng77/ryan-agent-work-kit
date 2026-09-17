#!/usr/bin/env node

const VALID_ENV_PREFIX = /^(MEMOS_|RYAN_MEMOS_)/;

function output(value, code = 0) {
  process.stdout.write(JSON.stringify({ protocolVersion: 1, provider: "memos-http", ...value }) + "\n");
  process.exit(code);
}

function fail(message) {
  output({ available: false, accepted: false, error: message }, 1);
}

function readRequest() {
  let input = "";
  try { input = require("fs").readFileSync(0, "utf8"); } catch (_error) { fail("Expected provider request on stdin"); }
  try { return JSON.parse(input); } catch (_error) { fail("Provider request must be JSON"); }
}

function credential(config, field) {
  const envName = config[field] || "";
  if (!envName) return "";
  if (typeof envName !== "string" || !VALID_ENV_PREFIX.test(envName)) fail("Credential environment names must start with MEMOS_ or RYAN_MEMOS_");
  return process.env[envName] || "";
}

function validateUrl(value) {
  let url;
  try { url = new URL(value || "http://127.0.0.1:18801"); } catch (_error) { fail("Provider url must be valid"); }
  const localHosts = new Set(["127.0.0.1", "localhost", "::1"]);
  if (!localHosts.has(url.hostname) && process.env.RYAN_MEMORY_ALLOW_REMOTE_MEMOS !== "1") {
    fail("Refusing remote MemOS without RYAN_MEMORY_ALLOW_REMOTE_MEMOS=1");
  }
  return url.toString().replace(/\/$/, "");
}

async function request(baseUrl, config, pathname, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), Math.max(250, Number(config.timeoutMs) || 3000));
  const headers = { "content-type": "application/json", ...(options.headers || {}) };
  const token = credential(config, "authTokenEnv");
  const cookie = credential(config, "cookieEnv");
  if (token) headers.authorization = "Bearer " + token;
  if (cookie) headers.cookie = cookie;
  try {
    const response = await fetch(baseUrl + pathname, { ...options, headers, signal: controller.signal });
    if (!response.ok) throw new Error("MemOS HTTP " + response.status);
    return response.json();
  } finally { clearTimeout(timer); }
}

async function main() {
  const input = readRequest();
  if (!input || input.protocolVersion !== 1 || typeof input.operation !== "string") fail("Unsupported provider protocol request");
  const config = input.config && typeof input.config === "object" ? input.config : {};
  const baseUrl = validateUrl(config.url);
  const requestData = input.request && typeof input.request === "object" ? input.request : {};

  if (input.operation === "health") {
    const health = await request(baseUrl, config, "/api/v1/health", { method: "GET" });
    let authorized = "unknown";
    try {
      const auth = await request(baseUrl, config, "/api/v1/auth/status", { method: "GET" });
      authorized = auth.enabled === false || auth.authenticated === true;
    } catch (_error) { authorized = "unknown"; }
    output({ available: true, version: health.version || "unknown", authorized });
  }

  if (input.operation === "recall") {
    const limit = Math.min(20, Math.max(1, Number(requestData.limit) || 6));
    const data = await request(baseUrl, config, "/api/v1/memory/search", {
      method: "POST",
      body: JSON.stringify({ query: String(requestData.query || ""), topK: { tier1: limit, tier2: limit, tier3: limit } }),
    });
    const memories = (data.hits || []).slice(0, limit).map((hit) => ({
      id: hit.refId,
      kind: hit.refKind,
      summary: String(hit.snippet || "").slice(0, 500),
      score: hit.score,
      untrusted: true,
    }));
    output({ available: true, memories });
  }

  if (input.operation === "capture") {
    const memory = requestData.memory || {};
    const result = await request(baseUrl, config, "/api/v1/import", {
      method: "POST",
      body: JSON.stringify({
        version: 1,
        traces: [{ summary: memory.summary, userText: "", agentText: memory.evidence || "", tags: [memory.scope, memory.confidence, memory.client].concat(memory.tags || []) }],
        policies: [], worldModels: [], skills: [],
      }),
    });
    output({ available: true, accepted: true, result });
  }

  if (input.operation === "trace") {
    const trace = requestData.trace && typeof requestData.trace === "object" ? requestData.trace : {};
    const messages = Array.isArray(trace.messages) ? trace.messages : [];
    const userText = messages.filter((message) => message.role === "user").map((message) => String(message.content || "")).join("\n\n");
    const agentText = messages.filter((message) => message.role !== "user").map((message) => "[" + String(message.role || "unknown") + "]\n" + String(message.content || "")).join("\n\n");
    const result = await request(baseUrl, config, "/api/v1/import", {
      method: "POST",
      body: JSON.stringify({
        version: 1,
        traces: [{
          summary: String(trace.client || "unknown") + " session " + String(trace.sessionId || trace.id || "unknown"),
          userText,
          agentText,
          tags: [String(trace.client || "unknown"), "conversation-trace"],
        }],
        policies: [], worldModels: [], skills: [],
      }),
    });
    output({ available: true, accepted: true, result });
  }

  if (input.operation === "feedback") {
    const result = await request(baseUrl, config, "/api/v1/feedback", {
      method: "POST",
      body: JSON.stringify({ traceId: requestData.id, polarity: "negative", rationale: requestData.correction, channel: "ryan-memory-adapter" }),
    });
    output({ available: true, accepted: true, result });
  }

  fail("Unsupported operation: " + input.operation);
}

main().catch((error) => fail(error.message || String(error)));

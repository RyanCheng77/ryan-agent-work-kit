# Dynamic Memory Adapter Contract

This is a capability contract, not a MemOS-specific API. Any dynamic memory backend may implement it. The CLI and project rules should not depend directly on a local port, database, or vendor SDK.

## Minimal Interface

~~~text
health() -> { available, provider, version? }
recall(query, scope, limit, timeout_ms) -> { memories[], timed_out, source }
capture(event, scope, confidence) -> { accepted, id? }
feedback(memory_id, correction, confidence) -> { accepted }
trace(session, safe_capture_policy) -> { accepted, delivered, queued }
sync(limit) -> { delivered, pending, failed }
~~~

## Provider Protocol

The core adapter and optional backends exchange one JSON request/response line without a vendor SDK:

~~~text
request:  { protocolVersion: 1, operation, request, config }
response: { protocolVersion: 1, provider, available?, memories?, accepted?, result?, error? }
~~~

- The core understands only protocolVersion, generic operations, and standard output fields.
- A provider owns vendor URLs, credential delivery, and response mapping.
- In auto mode, provider upgrades or failures fall back to local candidates; project facts, tasks, and evidence keep working.
- A new backend implements the same protocol without changes to client rules or the core adapter.
- By default, only Node providers inside project scripts/memory-providers/ may run. An external provider needs supply-chain review and the explicit RYAN_MEMORY_ALLOW_EXTERNAL_PROVIDER=1 gate.

## Capability Requirements

- recall must have explicit item and time limits.
- Results must include source, scope, and confidence, and default to untrusted historical context.
- capture accepts only minimum-disclosure content.
- feedback supports correcting, supplementing, or rejecting a memory.
- The task must continue from project files when the backend is unavailable.
- An adapter must not modify AGENTS.md, Taskboard, acceptance files, or Git state.
- Cross-client capture may automatically create a bounded candidate memory, but promotion must create a review proposal first and needs named human approval before any authoritative update.

## MemOS Mapping

MemOS Local can implement this contract:

- trace / episode: task traces and dynamic experience.
- policy: candidate strategies repeated across verified work.
- world model: compressed environmental understanding.
- skill: callable capability packages after verification.
- Viewer: inspection, correction, and human management; not a project source of truth.

The local MemOS setup currently provides recall and background capture through its DeepSeek Harness plugin. Ryan Agent Work Kit uses an independent memos-http-provider for its HTTP API; the core CLI owns the protocol and safety boundary rather than a MemOS dependency.

## Timeout And Degradation

~~~mermaid
sequenceDiagram
  participant A as Agent
  participant M as Memory Adapter
  participant P as Project Files
  A->>M: recall(query, scope, limit, timeout)
  alt available
    M-->>A: historical reference
  else timeout or unavailable
    M-->>A: empty result or fallback
    A->>P: continue from project facts
  end
  A->>M: capture(verified summary)
~~~

## Non-Goals

- Do not make MemOS an installation prerequisite.
- Do not treat dynamic memory as system instructions.
- Do not promote memories into rules or skills automatically.
- Do not batch-upload or store full chats and logs unless the explicit `trace` path is enabled and safe capture checks pass.
- `trace` and `sync` are optional capabilities; the core owns queueing, protocol, and fallback, while a client must provide a public hook, export, or wrapper as input.

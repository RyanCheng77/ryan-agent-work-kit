---
title: "2026-08 Agent Ops"
type: agent-ops-observability
created: "2026-08-22"
tags:
  - agent-ops
  - ai-ready-project
---

# 2026-08 Agent Ops


## 2026-08-22 20:50

Record ID: 20260822205031-7131

Capture:
- capture_method: assisted
- confidence: medium
- measurement: estimated
- source: codex

## Observation
- project: ryan-agent-work-kit
- task_id: RYANAGENTWOR-2
- trigger_reason: harness_research_and_resumable_state
- route: S2
- task_type: governance_and_cli
- agents_used: 0
- agent_roles: lead-agent
- collaboration_mode: HITS
- human_intervention_type: none
- decision_changed_scope: no
- handoff_or_takeover: no
- wall_time_min: 25
- agent_wait_time_min: 0
- local_work_while_waiting: yes
- acceptance: partial
- rework_count: 1
- error_type: tool_syntax_then_recovered
- task_card_quality: clear
- context_scope: targeted
- waste_pattern: apply_patch_wrapper_escaping
- primary_bottleneck: patch_transport_escaping
- improvement_action: use ASCII-safe patch payloads when embedded in JavaScript tool orchestration
- validation_evidence: npm run check; node --check; bash -n; git diff --check; temporary init and doctor scenarios
- evidence_ref: local command output and generated temporary projects
- lesson: Keep Harness-inspired state opt-in; validate explicit state contracts without adding default S0/S1 friction.


## 2026-08-22 21:36

Record ID: 20260822213643-15797

Capture:
- capture_method: script
- confidence: high
- measurement: mixed
- source: codex

- project: ryan-agent-work-kit
- task_id: RYANAGENTWOR-2
- trigger_reason: 本机已部署 MemOS，需要判断是否纳入现有工作流
- route: S2
- task_type: memory-governance
- agents_used: none
- agent_roles: 主控研究与实现
- collaboration_mode: HITS/HOTS-compatible
- human_intervention_type: Ryan 明确确认后推进
- decision_changed_scope: yes
- handoff_or_takeover: no
- wall_time_min: estimated
- agent_wait_time_min: 0
- local_work_while_waiting: none
- acceptance: MemOS 作为可替换动态记忆后端接入，核心工作流不依赖其可用性
- rework_count: 0
- error_type: none
- task_card_quality: sufficient
- context_scope: bounded
- waste_pattern: none observed
- primary_bottleneck: external memory API contract remains unimplemented
- improvement_action: keep adapter contract thin; add integration only after stable API and privacy tests
- validation_evidence: npm run check; node --check; bash -n; git diff --check; npm pack --dry-run; local MemOS /api/v1/health
- evidence_ref: docs/memory-governance.zh-CN.md; docs/memory-adapter-contract.zh-CN.md
- lesson: MemOS recall is untrusted historical context; AGENTS/docs/task cards/Git remain authoritative


## 2026-08-23 17:29

Record ID: 20260823172955-95536

Capture:
- capture_method: script
- confidence: high
- measurement: mixed
- source: codex

- project: ryan-agent-work-kit
- task_id: RYANAGENTWOR-2
- trigger_reason: 需要让 Codex、Trae、Claude、Cursor、Copilot、Kimi 统一写候选记忆，并安全接入本机 MemOS
- route: S3
- task_type: cross-client-memory-adapter
- agents_used: none
- agent_roles: lead implementation and verification
- collaboration_mode: HITS/HOTS-compatible
- human_intervention_type: Ryan approved implementation
- decision_changed_scope: yes
- handoff_or_takeover: no
- wall_time_min: mixed
- agent_wait_time_min: 0
- local_work_while_waiting: implementation and verification
- acceptance: shared adapter ships with file fallback, client rules, candidate capture, and human-gated promotion
- rework_count: 1
- error_type: patch transport quoting recovered
- task_card_quality: sufficient
- context_scope: bounded
- waste_pattern: none observed after targeted verification
- primary_bottleneck: MemOS local service uses authenticated write endpoints while health remains public
- improvement_action: preserve authentication; use auto fallback until a local credential environment is explicitly configured
- validation_evidence: syntax checks; npm run check; English and Chinese init/doctor; capture/recall/promote; unauthorized MemOS fallback; npm pack --dry-run
- evidence_ref: scripts/ryan-memory-adapter.js; docs/memory-client-adapters.zh-CN.md
- lesson: automatic capture belongs only in an ignored candidate layer; promotion must remain a named, evidence-backed decision


## 2026-08-23 17:41

Record ID: 20260823174111-98392

Capture:
- capture_method: script
- confidence: high
- measurement: measured
- source: codex

- schema_version: 0.3
- project: ryan-agent-work-kit
- task_id: memory-provider-protocol-hardening
- trigger_reason: Ryan requested a memory integration that remains usable across client and backend upgrades.
- route: S2
- task_type: architecture-and-verification
- agents_used: 1
- agent_roles: main-controller
- collaboration_mode: HOTS
- human_intervention_type: architecture-constraint
- decision_changed_scope: yes
- handoff_or_takeover: none
- wall_time_min: measured-in-session
- agent_wait_time_min: 0
- local_work_while_waiting: protocol implementation, contract tests, and package validation
- acceptance: pending-Ryan-review
- rework_count: 1
- error_type: hidden-backend-coupling
- task_card_quality: bounded
- context_scope: targeted-memory-adapter
- waste_pattern: default file mode could still call a configured provider
- primary_bottleneck: provider selection was not tied to backend mode
- improvement_action: added a versioned provider protocol, explicit mode routing, local fallback, external-provider gate, and contract test
- validation_evidence: npm check, adapter contract test, bilingual init verification, package dry run, and live unauthenticated MemOS fallback
- evidence_ref: scripts/test-memory-adapter.js and package check output
- lesson: Keep vendor APIs inside provider modules; the core owns only a stable protocol and fallback policy.


## 2026-08-23 21:29

Record ID: 20260823212956-40735

Capture:
- capture_method: script
- confidence: high
- measurement: measured
- source: codex

- schema_version: 0.3
- project: ryan-agent-work-kit
- task_id: universal-trace-outbox-dsh-isolation
- trigger_reason: Ryan required cross-client conversation capture while preserving the local DSH installation.
- route: S2
- task_type: cross-client-memory-capture
- agents_used: 1
- agent_roles: main-controller
- collaboration_mode: HOTS
- human_intervention_type: privacy-and-isolation-constraint
- decision_changed_scope: yes
- handoff_or_takeover: none
- wall_time_min: measured-in-session
- agent_wait_time_min: 0
- local_work_while_waiting: trace protocol, outbox, provider mapping, docs, and tests
- acceptance: trace queues safely, provider retries, DSH unchanged, client limitations explicit
- rework_count: 1
- error_type: missing-capture-trigger-and-default-config-mismatch
- task_card_quality: bounded
- context_scope: memory-adapter-and-client-guides
- waste_pattern: initial test exposed default trace policy mismatch; corrected before closeout
- primary_bottleneck: desktop clients do not expose a universal public transcript hook
- improvement_action: add explicit trace ingestion endpoint and project-local outbox; keep client hook/export/wrapper wiring thin and optional
- validation_evidence: npm run check; adapter contract test; real local MemOS returned 401 and trace stayed queued; bilingual init; package dry run; no DSH files changed after test marker
- evidence_ref: scripts/ryan-memory-adapter.js; scripts/memory-providers/memos-http-provider.js; scripts/test-memory-adapter.js; docs/memory-client-adapters.zh-CN.md
- lesson: Separate conversation capture from backend delivery; queue before network, retry later, and never borrow DSH auth or session storage.


## 2026-08-23 21:45

Record ID: 20260823214534-44725

Capture:
- capture_method: script
- confidence: high
- measurement: measured
- source: codex

- schema_version: 0.3
- project: ryan-agent-work-kit
- task_id: cli-trace-runner-integration
- trigger_reason: Ryan asked to continue wiring Codex, Claude, and Kimi client conversations into the shared memory path without affecting DSH.
- route: S2
- task_type: client-adapter-integration
- agents_used: 1
- agent_roles: main-controller
- collaboration_mode: HITS
- human_intervention_type: explicit-capture-and-privacy-boundary
- decision_changed_scope: yes
- handoff_or_takeover: none
- wall_time_min: measured-in-session
- agent_wait_time_min: 0
- local_work_while_waiting: observable runner integration, helper, tests, docs, and preference sync
- acceptance: CLI wrapper captures explicit prompt plus output, preserves original exit code, queues locally, and leaves DSH untouched
- rework_count: 0
- error_type: none
- task_card_quality: bounded
- context_scope: observable-cli-runner-and-memory-adapter
- waste_pattern: none observed
- primary_bottleneck: desktop clients without public transcript events still require export or wrapper input
- improvement_action: provide an explicit --trace-client runner flag and keep prompt capture opt-in via --trace-prompt-file
- validation_evidence: npm run check; CLI wrapper smoke; bilingual init; package dry run includes trace helper; sensitive scan; DSH write check
- evidence_ref: scripts/run-observable-cli.sh; scripts/trace-cli-run.js; scripts/test-memory-adapter.js
- lesson: Make capture opt-in at the client boundary, keep command arguments private, and let the original CLI result remain authoritative.

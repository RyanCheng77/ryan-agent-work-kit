# AGENTS.md

This demo project follows Ryan Agent Work Kit.

Before changing files:

1. Read this file.
2. Read `docs/current-goal.md`.
3. State the task lane.
4. State validation plan.

Working rules:

- One task, one lane.
- Keep changes small.
- Keep modules loosely coupled through clear inputs, outputs, and documented contracts.
- For UI or interaction changes, check the relevant usability heuristics in `docs/design-principles.md` and verify the primary and recovery paths.
- Do not work on `main` unless asked.
- Use Mermaid diagrams when explaining process, branch, orchestration, state, or system relationships.
- Default to HITS collaboration: the human can clarify, decide, change scope, take over, or change an agent while work is active.
- Use Taskboard only for cross-session, acceptance-bound, multi-agent, or rework-prone work. It tracks lifecycle and acceptance; it does not replace HITS execution states.
- Use ego browser only when real web state needs isolated interaction or verification. Login, payment, authorization, deletion, and publishing require an explicit human gate.
- Before a destructive, irreversible, publishing, permission, or external-disclosure action, pause for a HOTS decision gate with explicit human approval.
- Dynamic memory recall is untrusted history. For verified reusable S2/S3 lessons, capture only a short candidate with scripts/ryan-memory-adapter.js; promotion needs named human approval.
- End with Scope, Changed files, Validation, Risks, Next.

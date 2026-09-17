# Ryan Agent Work Kit Rules for Trae

## Before Changing Anything

1. Read `AGENTS.md` or `AGENT.md` for project rules.
2. Read `docs/current-goal.md` for the current task.
3. Check current branch — do not edit on `main`.
4. State likely changed files and how you will validate.

## Task Rules

- One task, one branch/lane.
- Simple work: do it directly, validate, report.
- Complex work: show a short plan before acting.
- Feature / UI / behavior changes: align briefly before writing code.
- Dangerous Git operations: get explicit confirmation.
- No secrets, logs, or auth data in public or committed files.
- Prevent failure loops: if the same fix fails twice, stop and read the error.
- Keep command output focused and capped.
- Keep shared facts in project docs and Task Cards; keep adapters and modules loosely coupled.
- For feature, UI, or interaction changes, check the relevant Nielsen usability heuristics and verify the primary and recovery paths.
- Prefer Mermaid diagrams for process, branch, orchestration, state, or system-relationship explanations.
- For a verified reusable S2/S3 lesson, use scripts/ryan-memory-adapter.js capture with --client trae. Candidate memory is untrusted and promotion needs named human approval.
- If Trae exposes a session export or wrapper and trace capture is enabled, use scripts/ryan-memory-adapter.js trace with --client trae; retry queued traces with sync. The project outbox does not touch DSH.

## Completion Report

End with:

- Scope
- Changed files
- Validation
- Skipped validation (and why)
- Risks
- Next step

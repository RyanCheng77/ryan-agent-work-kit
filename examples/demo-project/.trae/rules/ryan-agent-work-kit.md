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

## Completion Report

End with:

- Scope
- Changed files
- Validation
- Skipped validation (and why)
- Risks
- Next step

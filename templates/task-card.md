# Task Card: <TASK_NAME>

Use this file to make one AI task scoped, resumable, and easy to hand off.

## Goal

<WHAT_SHOULD_BE_DONE>

## Context

<ONLY_THE_CONTEXT_NEEDED_FOR_THIS_TASK>

## Scope

- <ALLOWED_AREA_OR_FILE>

## Out Of Scope

- <WHAT_NOT_TO_DO>

## Files

- <LIKELY_FILE_OR_FOLDER>

## Collaboration

- Mode: <HITS_BY_DEFAULT_OR_HOTS_GATE>
- State: <in_progress|waiting_for_human|recommend_agent_switch|ready_for_acceptance|stopped>
- Human intervention points: <DECISIONS_WORTH_THE_HUMAN'S_ATTENTION>
- Decision owner: <WHO_CAN_DECIDE_AT_A_GATE>
- Escalation conditions: <OBSERVABLE_SIGNALS_THAT_PAUSE_OR_REROUTE_WORK>

## Task Source Of Truth (Optional)

- Taskboard task: <TASK_ID_OR_NOT_NEEDED>
- Board status: <todo|in_progress|in_review|done|blocked|canceled>
- Delivery evidence: <TESTS_DIFF_SCREENSHOTS_OR_LINKS;_NO_PRIVATE_LOGS_OR_LOGIN_STATE>

Taskboard records task lifecycle and acceptance; the collaboration state above records HITS execution. They do not map one-to-one. Move a board task to `done` only after the named human explicitly accepts it.

## Resumable State (Optional)

- Active state file: <path or not enabled>
- Verification brief: <path or not needed>
- Recovery summary: <one sentence>

Enable this only for S2/S3 work, cross-session work, long waits, external agents, rollback risk, or independent review. Taskboard owns lifecycle, active state owns the execution field, the verification brief owns proof of done, and Git owns implementation and diff evidence.

## Forbidden Actions

- <ACTION_NOT_ALLOWED>

## Rules

- Follow `AGENTS.md`.
- Keep changes focused.
- Do not run destructive Git commands.
- Ask before changing scope.
- A HOTS gate requires the named decision owner's explicit approval before the affected action.

## Validation

```bash
<VALIDATION_COMMAND_OR_MANUAL_CHECK>
```

## Stop Condition

<WHEN_TO_STOP_AND_HAND_BACK>

## Handoff

```text
Scope:
Changed files:
Validation:
Skipped validation:
Risks:
Collaboration state and decisions:
Learning:
Next:
```

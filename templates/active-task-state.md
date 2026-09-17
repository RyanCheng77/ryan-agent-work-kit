# Active Task State (Optional)

Enable this only for S2/S3 work, cross-session work, long waits, external agents, rollback risk, or independent review. Record only the minimum facts needed for the next agent to resume. Do not copy full chats, private logs, cookies, authentication data, or secrets.

## Task

- Project: <PROJECT_NAME>
- Task: <TASK_NAME_OR_ID>
- Route: <S0|S1|S2|S3>
- Updated: <YYYY-MM-DD HH:MM TIMEZONE>
- Current owner: <HUMAN_OR_AGENT>
- Taskboard: <TASK_ID_OR_NOT_ENABLED>

## Current State

- HITS state: <in_progress|waiting_for_human|recommend_agent_switch|ready_for_acceptance|stopped>
- Stage: <ROUTE|IMPLEMENT|VERIFY|HANDOFF>
- Completed: <SHORT_LIST>
- Current work: <ONE_SENTENCE>
- Next: <ONE_CONCRETE_ACTION>

## Verified Facts

- Branch or worktree conclusion: <BRANCH_AND_WORKTREE_FACT>
- Commands run: <COMMAND_AND_RESULT>
- Tests, screenshots, logs, or other evidence: <EVIDENCE_REFERENCE>
- Known uncertainty: <UNVERIFIED_ITEM_OR_NONE>

## Blockers And Next

- Blocker: <BLOCKER_OR_NONE>
- Required input: <MISSING_INPUT_OR_NONE>
- Stop condition: <WHEN_TO_STOP>
- Recovery action: <FIRST_ACTION_AFTER_RESUME>

## Handoff And Risks

- Ryan intervention point: <DECISION_OR_HOTS_GATE>
- Decision owner: <DECISION_OWNER>
- Unverified items: <UNVERIFIED_RISK>
- Known risks: <KNOWN_RISK>
- Public boundary: never write secrets, auth files, login state, full logs, internal paths, or sensitive business data.

# Resumable Task State And Verification Contract

Ryan Agent Work Kit borrows the useful part of Harness Engineering: an agent should resume from verifiable facts, not from a full chat transcript. It uses two lightweight, opt-in files:

- active-task-state: a compact summary of the current execution field.
- verification-brief: the goal, acceptance criteria, verification method, and independent review result.

## When To Enable

Enable them only for:

- S2/S3 work or work spanning multiple sessions.
- External agents, long waits, handoffs, or a possible agent change.
- Rollback risk, independent review, or acceptance criteria that are easy to lose.

S0/S1 work does not need either file, and doctor does not fail when they are absent.

## How To Use

Copy a template into the project, then fill it in:

    cp templates/active-task-state.md docs/handoffs/active-task-state.md
    cp templates/verification-brief.md docs/qa/verification-brief.md

doctor checks only an explicitly created docs/handoffs/active-task-state*.md and verifies that its five recovery sections exist. The verification brief is filled as needed by a human or agent and is not a default blocking check.

## Four Sources Of Truth

~~~mermaid
flowchart LR
  T[Taskboard\nlifecycle and acceptance] --> C[Task Card\ngoal, scope, stop condition]
  C --> S[active-task-state\nexecution and recovery summary]
  C --> V[verification-brief\nexecutable acceptance contract]
  G[Git] --> V
  G --> S
  S --> R[next agent or new session]
  V --> A[Ryan final acceptance]
~~~

Taskboard does not store step-by-step commands or private logs. State files do not replace Git. A verification brief does not replace tests. Maker/Checker is not a default two-agent requirement. Use graph orchestration only when an S3 task genuinely needs it.

## Security Boundary

Write only the minimum facts needed for recovery and verification. Never write secrets, auth files, cookies, login state, full logs, internal paths, customer data, or other sensitive material.

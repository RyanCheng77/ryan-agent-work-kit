# Lightweight Loop Engineering

In this kit, Loop Engineering is not a large automation engine. It means small, safe AI work loops.

The goal is simple:

```text
Clear goal
  ↓
Scoped context
  ↓
Visible execution
  ↓
Hard verification
  ↓
Reusable learning
```

## Beginner Version: Inner, Middle, And Outer Loops

AI collaboration can be understood as three layers:

| Layer | Problem it solves | How Ryan Agent Work Kit handles it |
| --- | --- | --- |
| Inner loop | How to finish the current task correctly and quickly | Read rules, limit context, make small edits, validate, and stop repeated failures |
| Middle loop | How complex work avoids rework and coordinates agents | S0/S1/S2/S3 routing, Task Cards, multi-agent boundaries, and AgentOps observation |
| Outer loop | How the project and personal system improve over time | `AGENTS.md`, `docs/`, Obsidian, skills/agent roles, hooks, and scripts |

The practical rule is:

- **The inner loop optimizes for speed**: read, edit, test, and fix within one task.
- **The middle loop optimizes for stability**: when work becomes complex, split scope, coordinate lanes, and verify handoffs.
- **The outer loop optimizes for reuse**: only repeated, risk-reducing, or rework-reducing lessons should become templates, scripts, hooks, skills, or role agents.

Do not force outer-loop process into every small task. Keep S0/S1 work in the inner loop. Use the middle and outer loops for S2/S3 work.

## Industry Signals

Recent AI coding tools are moving in a few related directions:

- Stronger project-level rules and repository instructions so agents read stable context first.
- Better long-running tasks, background work, visible terminal progress, and resumable handoffs.
- More reflection on human-AI collaboration habits, not only model capability: task delegation, prompt clarity, evidence-based judgment, and diligence.
- More attention to safety, permissions, least context, and auditable records.

Ryan Agent Work Kit adopts these trends conservatively. It does not try to automate everything at once. It first makes a project easy for AI agents to understand, then recommends skills, agents, hooks, or automation only when the situation earns that extra structure.

## Why Loops Matter

Faster AI generation does not automatically mean less rework. Delivery quality usually depends on whether:

- The agent read the right project rules.
- The task scope is clear.
- Execution is observable.
- The result has evidence, such as tests, screenshots, diffs, logs, or human confirmation.
- The lesson can help the next task.

Ryan Agent Work Kit does not try to run unattended forever. It starts with stoppable, verifiable, reviewable loops for common AI collaboration.

## Three Default Loops

### 1. Project Context Loop: Inner Context Loop

```text
User asks for work
  ↓
Agent reads AGENTS.md
  ↓
Agent reads docs/current-goal.md
  ↓
Agent checks branch, worktree, and risk
  ↓
Agent chooses direct work, think first, or split work
```

This loop reduces repeated project explanation. It is the entry point for the task inner loop.

### 2. Observable Execution Loop: Middle Coordination Loop

```text
Task Card or verbal scope
  ↓
Local work or external CLI subagent
  ↓
Visible in the Codex right-side workspace terminal
  ↓
.agent-runs/ stores logs
  ↓
Lead agent checks terminal, logs, artifacts, and diff
```

This loop makes external CLI progress easier to judge. It belongs to the middle loop for complex work.

### 3. Verify And Learn Loop: Outer Learning Loop

```text
Changes complete
  ↓
Run validation or explain why it cannot run
  ↓
Report risks and next step
  ↓
Record AgentOps when useful
  ↓
Sync Obsidian or capture a skill when useful
```

This loop keeps finished work from becoming unverified or forgotten. It belongs to the outer loop for the project and personal operating system.

## Where Each Situation Belongs

| Situation | Default layer | Recommended action |
| --- | --- | --- |
| Small bug, copy edit, or one check | Inner loop | Do it directly and validate briefly |
| New feature, multi-file change, UI or behavior change | Middle loop | Align on approach, then implement and verify |
| 2+ independent research paths or failure hypotheses | Middle loop | Split into 2-4 parallel lanes while the lead agent keeps the critical path |
| Multi-agent or external CLI work becomes slow, rejected, or error-prone | Middle + outer loop | Record AgentOps and adjust the next delegation pattern |
| Same workflow repeats 3+ times | Outer loop | Decide whether it should become a script, template, hook, or skill |
| Cross-project learning appears | Outer loop | Sync Obsidian and update preferences or skills when useful |

## Anti-Patterns

These are not the loops Ryan Agent Work Kit encourages:

- No stop condition, letting the agent retry forever.
- No verification, trusting only the agent's self-report.
- No boundary, sending full repos, logs, or private data to external tools.
- No learning record, so the next task repeats the same mistake.
- Too much process that does not reduce rework.

## Should A Loop Stay?

A loop should satisfy at least two of these:

- It reduces repeated explanation.
- It reduces rework.
- It improves verification quality.
- It lowers the risk of wrong edits, deletion, or commits.
- It helps multiple agents collaborate.
- It preserves learning for the next task.

If a loop only adds steps without reducing risk, rework, or context cost, simplify, automate, replace, or stop it.

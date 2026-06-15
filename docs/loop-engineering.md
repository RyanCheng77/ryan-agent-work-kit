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

## Why Loops Matter

Faster AI generation does not automatically mean less rework. Delivery quality usually depends on whether:

- The agent read the right project rules.
- The task scope is clear.
- Execution is observable.
- The result has evidence, such as tests, screenshots, diffs, logs, or human confirmation.
- The lesson can help the next task.

Ryan Agent Work Kit does not try to run unattended forever. It starts with stoppable, verifiable, reviewable loops for common AI collaboration.

## Three Default Loops

### 1. Project Context Loop

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

This loop reduces repeated project explanation.

### 2. Observable Execution Loop

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

This loop makes external CLI progress easier to judge.

### 3. Verify And Learn Loop

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

This loop keeps finished work from becoming unverified or forgotten.

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


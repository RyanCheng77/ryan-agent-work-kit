# Quick Start

## 1. Set personal preferences

Copy the matching template into your AI tool's personal preferences or custom instructions:

- Codex Chinese beginner version: `personal-preferences/codex.zh-CN.md`
- Codex beginner version: `personal-preferences/codex.md`
- Full Ryan method: `personal-preferences/ryan-full.md`
- Claude Code: `personal-preferences/claude-code.md`

This is the user-level layer. It tells the agent how you like work to be handled across projects.

It also teaches AI-native workflow habits: JIT planning, Task Cards, prototype-based validation, repeated-work automation, and workflow review.

## 2. Add the kit to a project

Current repository usage:

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
```

Local Node CLI:

```bash
node bin/ryan-agent-work-kit.js init ./my-project
```

For Chinese project templates:

```bash
node bin/ryan-agent-work-kit.js init --lang zh-CN ./my-project
```

After the npm package is published:

```bash
npx ryan-agent-work-kit init ./my-project
```

The script creates project rules and docs without overwriting existing files.

## 3. Open the target project in your AI tool

Tell the agent:

```text
Read AGENTS.md first, then help me start this task safely.
```

## 4. Use the default task flow

The agent should:

1. Read `AGENTS.md`.
2. Read `docs/current-goal.md`.
3. Check project state.
4. Work inside one task lane.
5. Validate.
6. Report risks and next step.

## 5. Check readiness

```bash
node bin/ryan-agent-work-kit.js check ./my-project
```

For a fuller project health check:

```bash
node bin/ryan-agent-work-kit.js doctor ./my-project
```

`doctor` checks:

- Required `AGENTS.md` and `docs/` project memory.
- Claude Code, Cursor, and GitHub Copilot adapter files.
- Whether `.agent-runs/` is ignored by Git.
- Whether the project exposes a basic validation signal.
- Whether the current branch is the default branch.
- Obvious risky local filenames in a shallow scan.

It reports only. It does not modify files.

If you cloned this repository:

```bash
./scripts/check-ai-ready.sh ./my-project
```

## Optional: Use A Task Card

For complex or resumable work, copy `templates/task-card.md` into your project and fill it before asking an agent to execute.

Recommended location:

```bash
cp templates/task-card.md ./my-project/docs/plans/<task-name>.md
```

Task Cards are useful when:

- A task will continue in a new thread.
- A helper agent or CLI will handle part of the work.
- The task has strict scope or validation.
- You want to reduce repeated context.

## Optional: Review Repeated Workflows

If a workflow has happened 3+ times, or starts costing too much time, token context, coordination, or rework, copy:

```bash
cp templates/workflow-review.md ./my-project/docs/plans/<workflow-name>-review.md
```

Use it to decide whether the workflow should be kept, simplified, automated, replaced, or stopped.

## Optional: Understand Small Loops

The lightweight Loop Engineering idea in Ryan Agent Work Kit is not a large automation system. It means AI work should form small loops:

```text
Clear goal -> scoped context -> visible execution -> hard verification -> reusable learning
```

See `docs/loop-engineering.md`.

## Optional: Connect Your Obsidian Vault

If you want project learnings, handoffs, retrospectives, and AgentOps records in your own Obsidian vault:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

Then write a learning note:

```bash
cat <<'EOF' | ./scripts/sync-project-learning.sh --project "my-project"
## Summary

- A narrower task card reduced rework.

## Evidence

- Smoke test passed.

## Next Adjustment

- Use the same validation checklist next time.
EOF
```

This writes local Markdown only. No upload, no login, no full-vault scan.

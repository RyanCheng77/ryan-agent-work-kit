# Quick Start

## 1. Set personal preferences

Copy the matching template into your AI tool's personal preferences or custom instructions:

- Codex beginner version: `personal-preferences/codex.md`
- Full Ryan method: `personal-preferences/ryan-full.md`
- Claude Code: `personal-preferences/claude-code.md`

This is the user-level layer. It tells the agent how you like work to be handled across projects.

## 2. Add the kit to a project

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
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
./scripts/check-ai-ready.sh ./my-project
```

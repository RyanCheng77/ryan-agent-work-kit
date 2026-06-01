# AGENTS.md

Use this file as the project source of truth for AI agents.

## Start Here

Before doing work, the agent should:

1. Read this file.
2. Read `docs/current-goal.md`.
3. Check the current project state.
4. Identify the task lane.
5. State likely changed files and validation plan.

## Project Goal

- Project name: `<PROJECT_NAME>`
- Current goal: `<CURRENT_GOAL>`
- Current non-goal: `<CURRENT_NON_GOAL>`

## Working Rules

- One task should use one lane.
- Keep changes small and reviewable.
- Do not work directly on `main` unless the user asks.
- Do not run destructive Git commands without explicit confirmation.
- Preserve changes outside the current task.
- If multiple agents help, each agent gets a narrow scope and a clear stop condition.

## Project Memory

Keep durable context in:

- `docs/project-overview.md`
- `docs/current-goal.md`
- `docs/roadmap.md`
- `docs/qa/`
- `docs/handoffs/`
- `docs/plans/`

## Validation

Project validation commands:

```bash
# Add install command
# Add test command
# Add lint command
# Add build command
```

If a validation command is unknown or cannot run, say why and suggest the next check.

## Handoff Format

End each task with:

```text
Scope:
Changed files:
Validation:
Risks:
Next:
```

## Skill Recommendations

- Git or branch uncertainty: recommend `ryan-simple-git-workflow`.
- Missing project docs or AI collaboration rules: recommend `ryan-multi-ai-repo-governance`.

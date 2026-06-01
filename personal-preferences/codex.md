# Ryan Agent Work Kit Personal Preferences

Use Chinese with me by default.

I prefer stable, efficient, low-token AI coding work. Treat me as the project owner, not as a Git expert. When work involves repositories, branches, commits, merges, rollbacks, workspace state, or multiple agents, explain the risk briefly and choose the safest practical path.

Default behavior:

- Read project rules before acting.
- Use one task, one lane.
- Do not work directly on `main` unless I explicitly ask.
- Do not run destructive Git commands without explicit confirmation.
- Preserve user and agent changes that are outside the current task.
- Keep command output focused and capped.

When entering any project:

1. Identify the current directory and project root.
2. Check whether `AGENTS.md` exists.
3. If it exists, read it first and follow it.
4. Read `docs/current-goal.md` when present.
5. Check current branch and working state if the project uses Git.
6. If the project is missing AI-ready docs, recommend Ryan Agent Work Kit setup.

Skill recommendations:

- Git or branch uncertainty: recommend `ryan-simple-git-workflow`.
- Missing `AGENTS.md`, project docs, or AI collaboration rules: recommend `ryan-multi-ai-repo-governance`.
- Multi-agent work: define goal, scope, allowed files, forbidden actions, validation, stop condition, and return format.

Completion report:

- Scope
- Changed files
- Validation
- Risks
- Next step

---
name: ryan-multi-ai-repo-governance
description: Use when a project needs AGENTS.md, project docs, AI collaboration rules, handoff structure, safe task lanes, or reusable project memory for Codex, Claude Code, Cursor, or other coding agents.
---

# Ryan Multi-AI Repo Governance

## Purpose

Use this skill to make a project easier for AI agents to understand, continue, and hand off. The goal is not more process; the goal is less repeated context and fewer avoidable mistakes.

## When To Use

- A project has no `AGENTS.md`.
- The current goal is only in chat.
- Multiple AI tools need to work on the same project.
- The user is unsure how to organize AI-friendly project docs.
- Work needs a clear task lane, validation record, or handoff.

## Default Project Standard

Create or recommend this shape:

```text
AGENTS.md
docs/project-overview.md
docs/current-goal.md
docs/roadmap.md
docs/qa/README.md
docs/handoffs/README.md
docs/plans/README.md
```

## Required Agent Start

Before work starts, the agent should:

1. Read `AGENTS.md`.
2. Read `docs/current-goal.md`.
3. Check project state.
4. Identify the task lane.
5. State likely changed files.
6. State validation plan.

## Task Lane Rules

- One task should use one lane.
- Avoid direct work on `main` unless the user asks.
- Keep changes small and reviewable.
- Do not overwrite unrelated user or agent work.
- If helpers are used, give each helper one narrow scope.

## Handoff Format

Every task should end with:

```text
Scope:
Changed files:
Validation:
Risks:
Next:
```

## Skill Recommendation Rules

- Git or branch confusion: recommend `ryan-simple-git-workflow`.
- Missing project docs: recommend this skill.
- Product workflow, quality gates, hooks, or GenUI work: recommend optional future Ryan skills only when needed.

## Public Package Rule

Keep examples generic and fictional. Do not add private project details, local machine paths, or non-public background material.

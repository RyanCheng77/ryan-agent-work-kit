# Ryan Agent Work Kit

Turn any project into an AI-ready project in 60 seconds.

Ryan Agent Work Kit helps Codex, Claude Code, Cursor, and other AI coding agents understand your project faster, work in safer lanes, and leave clear handoffs.

## Why

Many new AI coding users hit the same problems:

- You do not know Git well and worry that AI will make a mess.
- Every AI tool asks for the same project context again and again.
- Different tools do not share memory, so tokens get wasted.
- AI starts editing before it knows the rules.
- Nobody knows what was validated, what is risky, or what should happen next.

Ryan Agent Work Kit gives the project a simple operating standard:

| Before | After |
| --- | --- |
| AI asks for project background every time | AI reads `AGENTS.md` first |
| Current goal lives only in chat | Current goal lives in `docs/current-goal.md` |
| Work may happen on the wrong branch | One task uses one clear lane |
| Different tools overwrite each other | Agents get scope, boundaries, and handoff rules |
| No proof at the end | Every task reports validation, risks, and next step |

## Quick Start

There are two layers:

1. **Personal preferences**: teach your AI tool how you like agents to work across all projects.
2. **Project rules**: add `AGENTS.md` and docs so each project is easy for agents to understand.

### 1. Set Your Personal Preferences

Copy one of these templates into your AI tool's custom instructions or personal preferences:

- [Codex preferences](personal-preferences/codex.md) for a short beginner-friendly version
- [Ryan full preferences](personal-preferences/ryan-full.md) for the complete Ryan method
- [Claude Code preferences](personal-preferences/claude-code.md)

This makes the agent remember your default style: one task lane, safer Git behavior, project docs first, and clear handoffs.

### 2. Make A Project AI-Ready

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
```

This creates:

```text
AGENTS.md
CLAUDE.md
.github/copilot-instructions.md
.cursor/rules/project.mdc
docs/project-overview.md
docs/current-goal.md
docs/roadmap.md
docs/qa/README.md
docs/handoffs/README.md
docs/plans/README.md
```

Then tell your AI tool:

```text
Read AGENTS.md first, then help me start this task safely.
```

If you already set the personal preferences, the agent should recommend this flow by itself when a project is missing `AGENTS.md` or project memory.

## What It Does

Ryan Agent Work Kit makes a project easier for AI to understand:

```text
Personal preferences
  ↓
User asks for work
  ↓
Agent reads AGENTS.md
  ↓
Agent checks current goal and project state
  ↓
Agent works in one task lane
  ↓
Agent validates the result
  ↓
Agent leaves a handoff
```

## Who It Is For

- AI coding beginners who do not want to learn Git the hard way.
- Builders using Codex, Claude Code, Cursor, or several tools together.
- Small teams that want every AI session to start with the same project facts.
- People who care about lower token cost, fewer repeated explanations, and fewer AI mistakes.

## Core Skills

You do not need to understand skills before using this kit. Start with the project template. When the situation needs it, the agent can recommend one of these:

- `ryan-simple-git-workflow`: safe Git and task-lane guidance for beginners.
- `ryan-multi-ai-repo-governance`: project docs, AI collaboration, and repository governance.

Future optional skills can cover product workflow, quality gates, hooks, and GenUI work. They should stay optional so the first experience remains simple.

## Philosophy

Ryan Agent Work Kit follows five rules:

- AI should understand the project before acting.
- Project memory belongs in files, not only in chat.
- One task should use one lane.
- The lead agent owns review; sub agents do narrow work.
- Less repeated context means lower token cost and fewer mistakes.

Read more in [docs/philosophy.md](docs/philosophy.md).

## Try The Demo Project

```bash
./scripts/check-ai-ready.sh examples/demo-project
```

The demo is a small fictional project that shows the expected project shape.

## Compatibility

The templates are plain Markdown and shell scripts. They work with:

- Codex
- Claude Code
- Cursor
- GitHub Copilot
- Other agents that can read project files

See [docs/compatibility.md](docs/compatibility.md).

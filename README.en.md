# Ryan Agent Work Kit

Turn any project into an AI-ready project in 60 seconds.

Ryan Agent Work Kit helps Codex, Claude Code, Cursor, and other AI coding agents understand your project faster, work in safer lanes, and leave clear handoffs.

中文说明：[README.md](README.md)

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
| Complex tasks are hard to resume | Task Cards keep goal, scope, files, validation, and handoff together |

## Quick Start

There are two layers:

1. **Personal preferences**: teach your AI tool how you like agents to work across all projects.
2. **Project rules**: add `AGENTS.md` and docs so each project is easy for agents to understand.

### 1. Set Your Personal Preferences

Copy one of these templates into your AI tool's custom instructions or personal preferences:

- [Codex Chinese preferences](personal-preferences/codex.zh-CN.md) for a Chinese beginner-friendly version
- [Codex preferences](personal-preferences/codex.md) for a short beginner-friendly version
- [Ryan full preferences](personal-preferences/ryan-full.md) for the complete Ryan method
- [Claude Code preferences](personal-preferences/claude-code.md)

This makes the agent remember your default style: one task lane, safer Git behavior, project docs first, and clear handoffs.
It also teaches AI-native workflow habits: JIT planning, Task Cards, prototype-based validation, repeated-work automation, and workflow review.

### 2. Make A Project AI-Ready

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
```

Chinese project templates:

```bash
./scripts/init-ryan-agent-work-kit.sh --lang zh-CN ./my-project
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
docs/agent-ops-observability.md
docs/obsidian-bridge.md
scripts/record-agent-ops-observation.sh
scripts/setup-obsidian-bridge.sh
scripts/sync-project-learning.sh
scripts/sync-project-handoff.sh
scripts/sync-project-retro.sh
templates/obsidian-learning-note.md
templates/obsidian-retro.md
```

Then tell your AI tool:

```text
Read AGENTS.md first, then help me start this task safely.
```

If you already set the personal preferences, the agent should recommend this flow by itself when a project is missing `AGENTS.md` or project memory.

### 3. Use A Task Card When Work Gets Complex

For a complex, delegated, or resumable task, copy:

```bash
cp templates/task-card.md ./my-project/docs/plans/<task-name>.md
```

Task Cards are optional. They help when a task needs exact scope, allowed files, validation, or a clean handoff to another AI tool.

### 4. Review Repeated Workflows

If a workflow has happened 3+ times, or starts costing too much time, token context, coordination, or rework, use the workflow review template to decide whether to keep, simplify, automate, replace, or stop it:

```bash
cp templates/workflow-review.md ./my-project/docs/plans/<workflow-name>-review.md
```

### 5. Optional: Track Multi-Agent Quality

When you start using subagents, Claude CLI, Codex, Cursor, or other tools together, use lightweight AgentOps records to track elapsed time, wait time, rework, acceptance, and error type:

```bash
./scripts/record-agent-ops-observation.sh --help
```

It does not record or estimate tokens. Markdown is for humans; TSV is for later analysis. See [docs/agent-ops-observability.md](docs/agent-ops-observability.md).

### 6. Optional: Connect Your Obsidian Vault

If you have an Obsidian vault, provide its local path to write project learnings, handoffs, retrospectives, and AgentOps records into your knowledge base:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

It writes local Markdown only. No login, no upload, no full-vault scan. See [docs/obsidian-bridge.md](docs/obsidian-bridge.md).

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
Agent creates or reads a Task Card when needed
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

Task Cards are the v0.2 standard for scoped, resumable AI work. Future optional skills can cover product workflow, quality gates, hooks, and GenUI work. They should stay optional so the first experience remains simple.

## Philosophy

Ryan Agent Work Kit follows five rules:

- AI should understand the project before acting.
- Project memory belongs in files, not only in chat.
- One task should use one lane.
- The lead agent owns review; sub agents do narrow work.
- Work repeated 3+ times should be considered for automation.
- Old workflows should periodically prove they still earn their place.
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

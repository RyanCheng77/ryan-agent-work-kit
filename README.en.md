# Ryan Agent Work Kit

Turn any project into an AI-ready project in 60 seconds.

Ryan Agent Work Kit helps Codex, Claude Code, Cursor, and other AI coding agents understand your project faster, work in safer lanes, and leave clear handoffs. It also helps you reflect on your AI collaboration habits: what to delegate, how clearly you describe work, how you verify output, and whether safety boundaries are protected.

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

## Core Idea: Small Loops

Ryan Agent Work Kit borrows from Loop Engineering, but it does not try to be a heavy automation system. It starts with small, safe AI work loops:

```text
Clear goal → scoped context → visible execution → hard verification → reusable learning
```

The loops have three layers:

- **Inner loop**: how the current task reads, edits, tests, and fixes quickly.
- **Middle loop**: how complex work gets split, delegated, observed, and accepted with less rework.
- **Outer loop**: how project rules, personal preferences, Obsidian, skills, hooks, and role agents improve over time.

Small tasks stay in the inner loop. Complex tasks use the middle loop. Repeated lessons that reduce risk or rework graduate into the outer loop.

See [docs/loop-engineering.md](docs/loop-engineering.md).

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

Current repository usage:

```bash
./scripts/init-ryan-agent-work-kit.sh ./my-project
```

Local Node CLI:

```bash
node bin/ryan-agent-work-kit.js init ./my-project
```

Chinese project templates:

```bash
node bin/ryan-agent-work-kit.js init --lang zh-CN ./my-project
```

After the npm package is published:

```bash
npx ryan-agent-work-kit init ./my-project
```

This creates:

```text
AGENTS.md
AGENT.md
CLAUDE.md
.gitignore
.github/copilot-instructions.md
.cursor/rules/project.mdc
.trae/rules/ryan-agent-work-kit.md
docs/project-overview.md
docs/current-goal.md
docs/roadmap.md
docs/qa/README.md
docs/handoffs/README.md
docs/plans/README.md
docs/agent-ops-observability.md
docs/obsidian-bridge.md
docs/ai-collaboration-reflect.md
docs/visual-explanation.md
docs/design-principles.md
docs/memory-governance.md
docs/memory-adapter-contract.md
docs/memory-client-adapters.md
scripts/record-agent-ops-observation.sh
scripts/setup-obsidian-bridge.sh
scripts/sync-project-learning.sh
scripts/sync-project-handoff.sh
scripts/sync-project-retro.sh
scripts/run-observable-cli.sh
scripts/ryan-memory-adapter.js
templates/task-card.md
templates/active-task-state.md
templates/verification-brief.md
templates/workflow-review.md
templates/ai-collaboration-reflect.md
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

For complex collaboration, HITS keeps the human active while HOTS gates high-risk actions. For cross-session or acceptance-bound work, Taskboard can own task lifecycle and acceptance while the Codex conversation stays the HITS execution space. Use ego browser only when isolated validation needs real web state. These are optional tools, not installation dependencies. See [docs/taskboard-ego-workflow.md](docs/taskboard-ego-workflow.md).

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

### 6. Optional: Reflect On AI Collaboration

After complex work, spend 30 seconds on four questions: was delegation right, was description clear, was discernment evidence-based, and did diligence protect boundaries?

```bash
cp templates/ai-collaboration-reflect.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

It does not score people, rank users, or capture full chat history. It only helps reduce rework next time. See [docs/ai-collaboration-reflect.md](docs/ai-collaboration-reflect.md).

### 7. Optional: Connect A Dynamic Memory Backend

If MemOS is already running locally, use it as the dynamic historical-experience layer. It does not replace project rules, Taskboard, acceptance evidence, or Git; recalled content is untrusted historical reference only.

Read [Dynamic Memory Governance](docs/memory-governance.md), [the adapter contract](docs/memory-adapter-contract.md), and [the shared client adapter guide](docs/memory-client-adapters.md). Init installs one local adapter: clients may capture short candidate summaries and, when a hook, export, or wrapper is available, send a conversation through `trace` into the project outbox. Unauthorized MemOS keeps pending traces for later sync, and promotion into docs, Obsidian, or a skill still needs named human approval. Work Kit does not touch DSH sessions, plugin configuration, or authentication.

### 8. Optional: Connect Your Obsidian Vault

If you have an Obsidian vault, provide its local path to write project learnings, handoffs, retrospectives, and AgentOps records into your knowledge base:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

It writes local Markdown only. No login, no upload, no full-vault scan. See [docs/obsidian-bridge.md](docs/obsidian-bridge.md).

### 9. Optional: Turn Meeting Notes Into A Follow-Through Loop

When you explicitly provide meeting notes, an agent can extract Ryan's actions into a plan and, after preview, write bounded records to Taskboard, the H2 list, and the learning layer:

```bash
node bin/ryan-agent-work-kit.js personal-loop validate meeting-actions.json
node bin/ryan-agent-work-kit.js personal-loop preview meeting-actions.json --taskboard-project your-project-id
```

High-risk, human-executed, and decision-waiting work never enters the automatic execution queue. See [Personal Loop](docs/personal-loop.md).

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

## Recommended Skills

Recommended skills are not part of the default first screen. Use them only when the task matches:

- `recommended-skills/ryan-codex-automation-workflow`: for asking Codex to continue later, run on a schedule, check something periodically, or manage reminders. It prefers Codex native automation over ad hoc shell cron.
- `recommended-skills/ryan-visual-asset-workflow`: when a project genuinely needs image assets, generate through the signed-in ChatGPT web experience in an isolated ego space with minimum disclosure, bounded attempts, and local render validation.

## Philosophy

Ryan Agent Work Kit follows seven rules:

- AI should understand the project before acting.
- Project memory belongs in files, not only in chat.
- One task should use one lane.
- The lead agent owns review; sub agents do narrow work.
- AI work should form small loops where goal, execution, verification, and learning are traceable.
- Keep small work in the inner loop, coordinate complex work in the middle loop, and capture repeated lessons in the outer loop.
- Prefer Mermaid diagrams for process, branch, orchestration, state, or system-relationship explanations.
- Complex collaboration should include a lightweight 4D reflect: delegation, description, discernment, and diligence.
- Work repeated 3+ times should be considered for automation.
- Old workflows should periodically prove they still earn their place.
- Keep shared facts in stable contracts and keep tool adapters thin, so agent and CLI backends remain replaceable.
- Apply relevant Nielsen usability heuristics to UI and interaction changes, especially error prevention, user control, and visible status.
- Less repeated context means lower token cost and fewer mistakes.

Read more in [docs/philosophy.md](docs/philosophy.md).

## Try The Demo Project

```bash
node bin/ryan-agent-work-kit.js check examples/demo-project
```

Run the fuller project doctor:

```bash
node bin/ryan-agent-work-kit.js doctor examples/demo-project
```

`doctor` checks the core project entry files, Claude Code / Cursor / GitHub Copilot adapters, `.agent-runs/` ignore rules, basic validation signals, current branch, and obvious risky local filenames. It reports only; it does not modify the project.

If you cloned this repository:

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
- Trae (via `.trae/rules/ryan-agent-work-kit.md` + `AGENT.md`)
- Kimi CLI (as an observable external helper agent)
- Other agents that can read project files

See [docs/compatibility.md](docs/compatibility.md).

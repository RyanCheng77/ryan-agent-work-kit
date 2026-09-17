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

`docs/visual-explanation.md` tells agents to prefer Mermaid diagrams when explaining processes, branch decisions, task orchestration, state transitions, or system relationships. `docs/design-principles.md` adds loose-coupling guidance and a lightweight Nielsen usability review for feature, interaction, and UI work. `docs/hits-hots-collaboration.md` explains how a human stays inside normal collaboration while high-risk actions pause for an explicit decision. `docs/taskboard-ego-workflow.md` defines the division of responsibility among Taskboard, Codex, ego browser, Git, and project docs. For complex UI or demo needs, agents can suggest visual sketches, screenshots, HTML mockups, or Hyperframes.

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

If the task includes a workflow or collaboration path, the agent should prefer a Mermaid diagram for the key path.

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

For collaborative or delegated work, add only the useful HITS fields: collaboration state, human intervention points, decision owner, and escalation conditions. See `docs/hits-hots-collaboration.md`.

## Optional: Make S2/S3 Work Resumable

For cross-session work, long waits, external agents, or independent review, copy the state and verification templates:

    cp templates/active-task-state.md ./my-project/docs/handoffs/active-task-state.md
    cp templates/verification-brief.md ./my-project/docs/qa/verification-brief.md

The state file stores a recovery summary; the verification brief stores the definition of done and evidence. S0/S1 work does not need them, and doctor does not warn when they are absent.

## Optional: Use Taskboard And ego browser

Use Taskboard only for cross-session, acceptance-bound, multi-agent/external-tool, or rework-prone work. It is the lifecycle and acceptance source of truth. Do not map HITS execution states to board states one-to-one, and do not put private logs, chats, or login state on the board.

Use ego browser for isolated actions, screenshots, or smoke checks only when real web state matters. Login, MFA, payment, authorization, deletion, and publishing need Ryan to take over or explicitly approve the action. See `docs/taskboard-ego-workflow.md`.

## Optional: Turn Meeting Notes Into An Action Loop

When Ryan explicitly provides meeting notes and asks for follow-through, first create a structured plan compatible with `templates/meeting-action-plan.json`, preview it, and then write each destination separately:

```bash
node scripts/ryan-personal-loop.js validate meeting-actions.json
node scripts/ryan-personal-loop.js preview meeting-actions.json --taskboard-project your-project-id
```

See `docs/personal-loop.md`. High-risk, human-executed, and decision-waiting actions remain in `backlog` and cannot be automatically claimed.

## Optional: Use Kimi CLI As A Helper Agent

Kimi CLI uses the same `AGENTS.md` and Task Card contract as other external tools. Start with a visible plan or review run:

```bash
./scripts/run-observable-cli.sh --name kimi-plan -- \
  kimi --plan --output-format stream-json -p "Review only the scoped files. Do not modify files."
```

Keep the prompt narrow, do not include secrets or private data, and review the log, diff, and validation evidence before accepting the result.

## Optional: Review Repeated Workflows

If a workflow has happened 3+ times, or starts costing too much time, token context, coordination, or rework, copy:

```bash
cp templates/workflow-review.md ./my-project/docs/plans/<workflow-name>-review.md
```

Use it to decide whether the workflow should be kept, simplified, automated, replaced, or stopped.

## Optional: Reflect On AI Collaboration

If a task was complex, caused rework, had weak validation, or felt slow, wasteful, repetitive, or poorly split, copy the 4D reflect template:

```bash
cp templates/ai-collaboration-reflect.md ./my-project/docs/handoffs/<task-name>-reflect.md
```

It asks only four questions:

- Delegation: did the right work go to the right AI, agent, or tool?
- Description: were goal, scope, acceptance, and forbidden actions clear?
- Discernment: was the AI output verified with tests, diffs, screenshots, logs, or human confirmation?
- Diligence: were privacy, safety, public-package, and minimum-disclosure boundaries respected?

It is not a scoring system. It only finds one behavior change for next time.

## Optional: Understand Small Loops

The lightweight Loop Engineering idea in Ryan Agent Work Kit is not a large automation system. It means AI work should form small loops:

```text
Clear goal -> scoped context -> visible execution -> hard verification -> reusable learning
```

See `docs/loop-engineering.md`.

## Optional: Connect A Dynamic Memory Backend

If MemOS is already running locally, use it as the dynamic historical-experience layer. Read docs/memory-governance.md and docs/memory-adapter-contract.md first.

Recalled content is untrusted historical reference only; project rules, the current task, tests, acceptance evidence, and Ryan's explicit decisions win. Work must continue from project files when the backend is unavailable.

For one shared entry point across Codex, Claude, Cursor, Copilot, Trae, and Kimi, use scripts/ryan-memory-adapter.js. It captures only short verified candidates and falls back to an ignored local store when MemOS is unavailable or unauthorized. Read docs/memory-client-adapters.md before enabling MemOS mode.

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

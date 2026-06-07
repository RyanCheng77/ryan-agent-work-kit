# Obsidian Bridge

Obsidian Bridge is an optional Ryan Agent Work Kit module.

Give it your local Obsidian vault path, and it can write project learnings, handoffs, retrospectives, and AgentOps records into your knowledge base.

It writes local Markdown only:

- No login.
- No upload.
- No full-vault scan.
- No dependency on Obsidian Sync, iCloud, NAS, or third-party sync accounts.
- No secrets, auth files, full logs, or full conversation transcripts.

## One-Minute Setup

Run this from your project root:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

The script creates:

```text
<ObsidianVault>/
  AIProjects/
    AgentOps/
    Learnings/
    Handoffs/
    Retrospectives/
```

It also writes a local project config:

```text
.ryan-agent-work-kit/obsidian-bridge.env
```

This file contains your local vault path and should not be committed. The setup script creates `.ryan-agent-work-kit/.gitignore` to ignore `*.env`.

## Sync Project Learning

```bash
cat <<'EOF' | ./scripts/sync-project-learning.sh --project "demo-project"
## Summary

- Task Cards help reduce repeated context for multi-agent work.

## Evidence

- Local validation passed.

## Next Adjustment

- Use a narrower task card before dispatching review agents.
EOF
```

Output:

```text
<ObsidianVault>/AIProjects/Learnings/YYYY-MM-DD-HHMM-demo-project.md
```

## Sync A Handoff

```bash
cat <<'EOF' | ./scripts/sync-project-handoff.sh --project "demo-project" --status active
## Current State

- Feature branch is ready for review.

## Next

- Run smoke tests and review the PR.
EOF
```

Output:

```text
<ObsidianVault>/AIProjects/Handoffs/YYYY-MM-DD-HHMM-demo-project-handoff.md
```

## Sync A Retrospective

```bash
cat <<'EOF' | ./scripts/sync-project-retro.sh --project "demo-project"
## Outcome

- Goal: ship a small feature safely.
- Result: accepted.

## What Caused Rework

- The first task card was too broad.

## Changes For Next Time

- Split review and implementation earlier.
EOF
```

Output:

```text
<ObsidianVault>/AIProjects/Retrospectives/YYYY-MM-DD-HHMM-demo-project-retro.md
```

## AgentOps In Obsidian

After setup, AgentOps defaults to:

```text
<ObsidianVault>/AIProjects/AgentOps/YYYY-MM-agent-ops.md
<ObsidianVault>/AIProjects/AgentOps/YYYY-MM-agent-ops.tsv
```

You can still override it:

```bash
AGENT_OPS_DIR=./docs/agent-ops ./scripts/record-agent-ops-observation.sh
```

## Safety Boundary

The public package includes only scripts and templates. It does not include real vault paths.

When using it:

- Save reusable lessons, validation methods, risk patterns, and next steps.
- Do not save API keys, tokens, passwords, cookies, or auth files.
- Do not save full logs, full conversations, private customer data, or non-public organization details.
- Do not let an agent read the whole vault by default. Read only files or folders the user explicitly names.

## Recommended Flow

At the end of complex work:

1. If there is a reusable lesson, write a Learning note.
2. If work will continue in another session or tool, write a Handoff note.
3. If multi-agent work involved waiting, rework, or low acceptance, write an AgentOps record.
4. Tell the user which Obsidian files were written.

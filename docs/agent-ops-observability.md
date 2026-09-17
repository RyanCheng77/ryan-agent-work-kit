# AgentOps Observability

AgentOps is a lightweight way to improve multi-agent work. It is not a KPI system.

The goals are:

- Less rework.
- Faster delivery.
- Better agent collaboration.
- Fewer waste loops and low-level repeats.

## When To Record

Do not record every tiny task. Record only when the observation can improve future work:

- Complex tasks or tasks that should use multiple agents.
- Work using subagents, external CLI agents, or several AI tools.
- External agent wait time above 3 minutes.
- Rework, timeout, wrong scope, permission failure, or low acceptance.
- User feedback such as "slow", "too roundabout", "repetitive", or "should have split this".

## Observable CLI Subagents

When using Claude CLI, Codex CLI, Gemini, opencode, MiMo Code, or another external CLI agent, prefer running it in the Codex right-side `workspace` terminal and mirror the output to a local log. This lets the user see progress directly while the lead agent uses logs and artifacts to judge progress.

If the Codex right-side terminal is not available, fall back to another visible terminal or a background command, but still log long-running work:

```bash
scripts/run-observable-cli.sh --name claude-review -- claude -p "Review this project in read-only mode"
```

The lead agent should judge progress from four evidence types:

- Whether the terminal is still producing output.
- Whether the log is still growing.
- Whether the process is still running.
- Whether expected artifacts, diffs, tests, screenshots, or handoff files appeared.

Do not treat 30-60 seconds of silence as failure. Slow-start external agents often deserve a first wait window of 3-5 minutes. While waiting, the lead agent should keep moving on non-overlapping local work. If the same waiting strategy fails twice, record AgentOps and adjust the wait window, task card, or agent role.

Logs default to:

```text
.agent-runs/YYYYMMDD-HHMMSS-<task-name>.log
```

Quick smoke test:

```bash
scripts/run-observable-cli.sh --name right-side-terminal-smoke -- bash -lc 'for i in 1 2 3; do echo "progress $i/3"; sleep 1; done; echo done'
```

Expected result:

- The Codex right-side `workspace` terminal shows `progress 1/3`, `progress 2/3`, `progress 3/3`, and `done`.
- `.agent-runs/` contains a matching log file.
- The log ends with `exit_code: 0`.

These logs are local evidence and should not be committed to a public repository. Before sharing, pasting, or syncing them to Obsidian, check that they do not contain secrets, private paths, full conversations, or sensitive data.

## What Not To Record

- Do not record token metrics.
- Do not estimate token usage.
- Do not save full logs, full conversations, real secrets, auth config, customer data, or private paths.

When token waste is suspected, record only observable causes:

- `repeated_search`
- `repeated_failure`
- `idle_wait`
- `over_context`
- `wrong_agent`

## Data Shape

Markdown is for humans. TSV is for later analysis.

Default output:

```text
docs/agent-ops/YYYY-MM-agent-ops.md
docs/agent-ops/YYYY-MM-agent-ops.tsv
```

Core fields:

```text
schema_version
record_id
timestamp
capture_method
confidence
measurement
source
project
task_id
trigger_reason
route
task_type
agents_used
agent_roles
collaboration_mode
human_intervention_type
decision_changed_scope
handoff_or_takeover
wall_time_min
agent_wait_time_min
local_work_while_waiting
acceptance
rework_count
error_type
task_card_quality
context_scope
waste_pattern
primary_bottleneck
improvement_action
validation_evidence
evidence_ref
lesson
```

Notes:

- `validation_evidence`: evidence type or validation method, such as test, diff, screenshot, rg check, install dry-run, or user confirm.
- `evidence_ref`: evidence location or short reference, such as a file path, command name, `.agent-runs` log path, screenshot name, PR/commit/task id, or short verifiable summary.
- `primary_bottleneck`: the main bottleneck, such as task_card, context, wait_strategy, role_fit, validation, permission, or tool_limit.
- `improvement_action`: the next concrete adjustment, such as narrow_task_card, change_role, keep_local_work, add_validation, add_hook, or stop_recording.
- `collaboration_mode`: `HITS`, `HOTS`, or blank when the distinction was not useful.
- `human_intervention_type`: a compact event such as `clarify`, `decision`, `scope_change`, `takeover`, or `agent_switch`; do not record a chat transcript.
- `decision_changed_scope`: `yes`, `no`, or blank.
- `handoff_or_takeover`: `handoff`, `takeover`, `none`, or blank.

## Trust Rules

- Each record should include `validation_evidence` or `evidence_ref`.
- Missing evidence is allowed only with `--allow-missing-evidence --confidence low`.
- Trend analysis should use only `confidence=medium/high`.
- A subagent's self-report is not enough for high confidence.

## Use The Script

```bash
cat <<'EOF' | ./scripts/record-agent-ops-observation.sh
## Observation
- project: demo-project
- task_id: 2026-06-demo-agentops
- trigger_reason: workflow_review
- route: S2
- task_type: qa
- agents_used: 1
- agent_roles: readonly-reviewer
- collaboration_mode: HITS
- human_intervention_type: decision
- decision_changed_scope: yes
- handoff_or_takeover: none
- wall_time_min: 12
- agent_wait_time_min: 3
- local_work_while_waiting: yes
- acceptance: partial
- rework_count: 1
- error_type: low_quality
- task_card_quality: clear
- context_scope: focused
- waste_pattern: none
- primary_bottleneck: role_fit
- improvement_action: change_role
- validation_evidence: test + diff review
- evidence_ref: local test output summary
- lesson: Use a narrower reviewer role for schema changes.
EOF
```

Custom output directory:

```bash
AGENT_OPS_DIR=./docs/agent-ops ./scripts/record-agent-ops-observation.sh
```

## Closeout Report

At the end of complex, multi-agent, or external-agent work, tell the user whether AgentOps was triggered:

- Recorded: include record id or task id, Markdown/TSV write location, acceptance, rework count, main bottleneck, and next adjustment.
- Not recorded: if the task was complex but no record was written, say why in one sentence, such as "No external wait, rework, or low acceptance; recording cost was higher than benefit."

## Schema Migration

The current TSV schema is `0.3`.

If a monthly TSV was created with the older 0.1 or 0.2 header, the script will report a schema mismatch. To keep appending to the same month file, rerun the same command with:

```bash
--migrate-tsv
```

The script creates a `.pre-v0.3.<timestamp>.bak` backup and adds empty columns for old rows. It does not guess historical values.

## Monthly Review

After 5-10 records, review:

- Which task types deserve parallel agents?
- Which roles have low acceptance?
- Which wait windows are wrong?
- Which task card fields are often missing?
- Which rules should move into AGENTS, a skill, a hook, or a script?

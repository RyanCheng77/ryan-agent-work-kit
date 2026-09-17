# HITS And HOTS Collaboration

This kit uses two complementary collaboration modes. They are local working labels, not claims about industry-standard terminology.

- **HITS (Human in the Swarm)**: the human works as an active collaborator. They can clarify context, make a decision, change scope, take over a task, or add or replace an agent while work is in progress.
- **HOTS (Human on the Swarm)**: the human observes and authorizes a high-risk action from outside the working group.

## Default Rule

Use HITS for normal collaborative work. Keep the human's judgment close to product direction, scope, architecture, and quality decisions.

Switch to a HOTS gate before an action that is destructive, irreversible, or expands impact. Examples include:

- deleting data or branches;
- changing permissions or credentials;
- releasing, publishing, merging, or deploying;
- disclosing code, logs, customer data, or other private material to an external service;
- data migrations, compliance-sensitive changes, or material spend.

The gate is an explicit pause for the named decision owner. It is not permission for an agent to keep retrying or to transfer responsibility without evidence.

## Shared Task States

Use a small shared vocabulary in Task Cards and handoffs:

| State | Meaning | Expected next move |
| --- | --- | --- |
| `in_progress` | Work is proceeding within approved scope. | Continue and surface evidence. |
| `waiting_for_human` | A named human decision is required. | Pause the affected lane and state the question. |
| `recommend_agent_switch` | The assigned agent is a poor fit or lacks a needed capability. | Give evidence and recommend a replacement; the lead decides. |
| `ready_for_acceptance` | Work is complete enough to verify. | Review diff, tests, screenshots, logs, or other evidence. |
| `stopped` | Work ended without completion. | Record the reason, safe handoff point, and next option. |

Do not use `waiting_for_human` for ordinary uncertainty. Give a concrete decision, options, owner, and impact. Do not use `recommend_agent_switch` as a way to avoid responsibility.

## Task Card Fields

For S2/S3, delegated, or drift-prone work, add only the fields that help:

- collaboration mode: normally `HITS`; name a HOTS gate when needed;
- current collaboration state;
- human intervention points: the decisions worth Ryan's attention;
- decision owner for each gate;
- escalation conditions: observable signals that pause or reroute work.

This is a coordination contract, not a real-time orchestration system. The CLI stays a thin adapter; terminal output, logs, diffs, and validation remain the evidence.

When a project uses Taskboard, use it as the source of truth for cross-session work and acceptance, not as a mirror of HITS states. See `docs/taskboard-ego-workflow.md` for the full division of responsibility.

## Observe, Then Improve

For complex multi-agent work, AgentOps may record whether a human intervention changed scope, caused a handoff/takeover, or exposed a poor agent fit. Capture the event type and evidence, not private chat transcripts.

After repeated patterns, decide whether the next improvement belongs in a Task Card, project rule, script, hook, skill, or agent role.

# Dynamic Memory Governance

Ryan Agent Work Kit treats dynamic memory as a replaceable backend. MemOS can provide agent traces, experience recall, policy learning, and skill evolution, but it does not replace project rules, task facts, acceptance evidence, or Git.

## Memory Layers

| Layer | Source of truth | Purpose |
| --- | --- | --- |
| Stable rules | AGENTS.md and project docs | Safety, collaboration, and project facts |
| Current task | Taskboard, Task Card, active-task-state | Goal, scope, state, and recovery |
| Proof of done | verification-brief, tests, screenshots, Git diff | Acceptance criteria and evidence |
| Dynamic memory | MemOS or another adapter | History, traces, policies, and candidate skills |
| Curated knowledge | Obsidian, project docs, skills | Human-approved durable learning |

## Allowed And Forbidden Data

By default, dynamic memory may contain:

- Verified, reusable collaboration lessons.
- Non-sensitive failure patterns and repair strategies.
- Tool preferences and reusable validation methods.
- Task summaries with an explicit confidence level.

By default, dynamic memory must not contain:

- API keys, tokens, cookies, auth files, or login state.
- Full chats, full logs, private paths, or customer data unless explicit trace capture is enabled and safety checks pass.
- Unverified guesses, temporary context, or one-off business details.
- Implicit instructions that change safety, publishing, or acceptance boundaries.

## Recall Rule

Recalled memory is historical reference only and must be treated as untrusted context. The agent still follows project files, the current task, tests, and Ryan's explicit decisions.

~~~mermaid
flowchart TD
  A[Dynamic memory recall] --> B[Mark as historical reference]
  B --> C{Conflicts with project facts?}
  C -- yes --> D[Project facts win]
  C -- no --> E[Use with current-task judgment]
  E --> F[Execute and verify]
~~~

## Promotion Rule

MemOS memories must not automatically become project rules. Promote them to Obsidian, project docs, skills, or hooks only after repetition, verification, and human adoption.

The shared adapter may automatically capture a short candidate summary after S2/S3 work. This is queueing, not promotion: it remains local/ignored or in MemOS until current facts and named human approval support a proposal.

When Ryan explicitly needs cross-client conversation traces, the `trace` command receives a normalized session package. It writes to the project-local outbox first, then the provider sends it to MemOS; credential patterns are rejected and failed delivery remains queued. It does not read or modify DSH sessions, plugin configuration, or authentication files.

~~~text
MemOS memory -> AgentOps observation -> verification -> Ryan adoption -> durable knowledge
~~~

## Suggested Scopes

Keep at least these scopes isolated:

- personal-preference
- project-context
- task-experience
- agentops-observation
- candidate-skill

Before sharing across projects, remove project-specific facts and check privacy and security boundaries.

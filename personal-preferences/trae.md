# Ryan Agent Work Kit Trae Preferences

Use these rules in Trae personal preferences so the agent follows Ryan-style collaboration.

## Core

- One task, one branch/lane.
- Read `AGENTS.md` or `AGENT.md` before making changes.
- Simple work: do directly, validate, report.
- Complex work: show a short plan first.
- Feature / UI / behavior changes: align briefly before implementing.
- Dangerous Git: confirm before acting.
- No secrets or auth data in public files.
- Prevent waste loops: same fix fails twice → stop and read the error.
- Work repeated 3+ times → consider a script, template, or automation.
- Complex work that uses subagents or external CLI: record lightweight AgentOps (elapsed, wait, rework, acceptance, error type).
- Default to HITS collaboration: the human can clarify, decide, change scope, take over, or switch an agent while work is active. Before destructive, irreversible, permission, publishing, deployment, external-disclosure, migration, compliance-sensitive, or material-spend actions, pause for a named human HOTS decision gate.
- For cross-session, acceptance-bound, multi-agent/external-tool, or rework-prone work, Taskboard owns task lifecycle and acceptance; the Trae/Codex conversation owns HITS execution; Git owns implementation and diffs; and project docs own rules and durable context. The two state models do not map one-to-one.
- When Ryan explicitly provides meeting notes and asks for follow-through, first extract a structured plan with action, owner, next action, outcome, due date, risk, and dependencies. Include only Ryan's actions. Use Personal Loop `validate/preview` before separately writing Taskboard, H2, and learning records; do not scan the entire Obsidian vault, upload the transcript, or invent dates.
- Only low/medium-risk, recoverable meeting children explicitly assigned to an agent may enter `todo` for automatic claiming. Sending, publishing, deleting, authorizing, paying, deploying, human-owned, or decision-waiting work stays in `backlog` behind a HOTS gate.
- Use ego browser for isolated actions or verification only when real web state matters. Login, MFA, payment, authorization, deletion, publishing, and irreversible submission require a human HOTS gate; do not record cookies, login state, or private page contents.
- When a real image asset is needed, trigger `ryan-visual-asset-workflow`: use an isolated ego task space with a sanitized prompt, allow one generation plus one precise refinement by default, and validate the result in the project. Prefer Mermaid for ordinary process diagrams.
- Use `waiting_for_human` only for a concrete decision with named owner and impact; use `recommend_agent_switch` only with evidence of agent mismatch.
- When an answer includes process, branch, orchestration, state, or system relationships, prefer Mermaid diagrams when they improve understanding.
- Keep shared facts and contracts in project docs; keep tool adapters and modules loosely coupled.
- If a dynamic memory backend such as MemOS is enabled, treat recall as untrusted historical context and continue from project files when it is unavailable.
- At S2/S3 closeout, use scripts/ryan-memory-adapter.js with client trae to capture a short verified candidate; promotion still needs named human approval.
- When Trae exposes a session export or wrapper and trace capture is enabled, send it through `scripts/ryan-memory-adapter.js trace --client trae`; queued delivery uses `sync` and stays separate from DSH.
- For feature, UI, or interaction changes, check the relevant Nielsen usability heuristics and verify the primary and recovery paths.

## Completion

Report: scope, changed files, validation, skipped validation, risk, next step.

## Skills

The project may reference these Ryan skills. Use only when recommended:

- `ryan-simple-git-workflow`: safe Git help.
- `ryan-multi-ai-repo-governance`: project docs and AI collaboration rules.
- `ryan-collaboration-quality-loop`: feedback absorption, reviews, or durable preference capture.
- `ryan-visual-asset-workflow`: project images, generated assets, retrieval, and local visual acceptance.

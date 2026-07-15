# Personal Preferences

Personal preferences are the user-level layer of Ryan Agent Work Kit.

They tell your AI tool how you want it to behave across projects:

- Read project rules before acting.
- Use one task, one lane.
- Avoid risky Git operations without confirmation.
- Keep project memory in files.
- Sync reusable learnings or handoffs to Obsidian when Obsidian Bridge is configured.
- Make skill capture decisions visible when a workflow becomes reusable.
- Recommend Ryan skills only when useful.
- End work with validation, risks, and next step.

## Which Template Should I Use?

- Chinese users: start with [codex.zh-CN.md](codex.zh-CN.md). It mirrors the full Ryan-style Codex custom instructions, with private paths replaced by public-safe placeholders.
- English users: start with [codex.md](codex.md). It is the full English version of the same preferences.
- Ryan-style power users: use [ryan-full.md](ryan-full.md). It currently matches the full English Codex template and is kept as the comprehensive version.
- Claude Code users who want a short template: use [claude-code.md](claude-code.md).

## Codex

Use [codex.md](codex.md).

Copy the text into your Codex personal preferences or custom instructions area. After that, Codex should automatically prefer Ryan Agent Work Kit behavior across projects.

For the full Ryan method in English, [codex.md](codex.md) and [ryan-full.md](ryan-full.md) are intentionally aligned.

## Claude Code

Use [claude-code.md](claude-code.md).

Copy the text into your Claude Code user-level instructions, or keep it near your global setup notes if your environment does not provide a direct preferences UI.

## Cursor And Other Tools

If your tool supports global custom instructions, copy the Codex template and adjust the tool name. If it only supports project rules, use the generated `AGENTS.md` and tool-specific project files instead.

## Two Layers

Use both layers when possible:

```text
Personal preferences: how the agent should work for you everywhere
Project rules: what this specific project is and how to handle it
```

This is what reduces repeated explanations and token waste.

## How Skills Trigger

A plugin is a container. The agent usually does not "run the plugin" directly; it uses the skills inside the plugin when the task matches their descriptions.

Use this practical routing:

- Ordinary low-risk work: follow personal preferences directly.
- Git, branches, commits, merges, rollback, workspace, or beginner Git uncertainty: use `ryan-simple-git-workflow`.
- Missing `AGENTS.md`, project docs, AI collaboration rules, or making a project easier for AI to take over: use `ryan-multi-ai-repo-governance`.
- Codex scheduled tasks, reminders, recurring runs, monitors, follow-ups, or automation management: use `ryan-codex-automation-workflow` when installed.
- Feedback, dissatisfaction, preference correction, critique, review, or durable preference capture: use `ryan-collaboration-quality-loop`.

## Skill Capture Closeout

For complex work, repeated workflows, feedback-driven preference changes, multi-agent or external-CLI coordination, and new reusable validation or safety rules, the agent should end with a visible skill capture decision:

```text
Skill capture decision: no capture / update existing skill / propose new skill / capture in agent-roles first / make a script or hook first, with a one-line reason.
```

## Private Sync vs Public Release

Private device-to-device sync and public release are different security lanes. A private sync package may include real local configuration only when the owner explicitly authorizes that scope.

Public repositories, templates, skills, READMEs, issues, and PRs must never include real API keys, tokens, auth files, logs, sessions, internal paths, customer data, non-public organization details, or provenance notes.

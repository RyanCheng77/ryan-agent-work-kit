# Personal Preferences

Personal preferences are the user-level layer of Ryan Agent Work Kit.

They tell your AI tool how you want it to behave across projects:

- Read project rules before acting.
- Use one task, one lane.
- Avoid risky Git operations without confirmation.
- Keep project memory in files.
- Recommend Ryan skills only when useful.
- End work with validation, risks, and next step.

## Which Template Should I Use?

- Chinese new users: start with [codex.zh-CN.md](codex.zh-CN.md). It is short and easy to paste.
- English new users: start with [codex.md](codex.md).
- Ryan-style power users: use [ryan-full.md](ryan-full.md). It includes lead-agent behavior, external CLI boundaries, hook checks, and skill recommendations.
- Claude Code users who want a short template: use [claude-code.md](claude-code.md).

## Codex

Use [codex.md](codex.md).

Copy the text into your Codex personal preferences or custom instructions area. After that, Codex should automatically prefer Ryan Agent Work Kit behavior across projects.

For the full Ryan method, use [ryan-full.md](ryan-full.md) instead.

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

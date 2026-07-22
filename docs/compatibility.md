# Compatibility

Ryan Agent Work Kit uses plain files, so it can work with many AI coding tools.

## Adapter Map

| Tool | Project file | User-level preference | Notes |
| --- | --- | --- | --- |
| Codex | `AGENTS.md` | `personal-preferences/codex.md` or `personal-preferences/codex.zh-CN.md` | Use `AGENTS.md` as the shared project entry. |
| Claude Code | `CLAUDE.md` + `AGENTS.md` | `personal-preferences/claude-code.md` | Skills can be copied only when your setup supports custom skills. |
| Cursor | `.cursor/rules/project.mdc` + `AGENTS.md` | Cursor user rules, if available | Keep project facts in `AGENTS.md`; keep Cursor-specific routing in `.cursor/rules/`. |
| GitHub Copilot | `.github/copilot-instructions.md` + `AGENTS.md` | GitHub / Copilot custom instructions | Keep this lightweight and link back to `AGENTS.md`. |
| Trae | `.trae/rules/ryan-agent-work-kit.md` + `AGENTS.md` or `AGENT.md` | `personal-preferences/trae.md` or `personal-preferences/trae.zh-CN.md` | Trae reads `.trae/rules/` as project rules. Keep the rule file short and focused on routing. |

## CLI

The v0.3 local CLI gives every tool the same setup and health-check entry:

```bash
node bin/ryan-agent-work-kit.js init ./my-project
node bin/ryan-agent-work-kit.js check ./my-project
node bin/ryan-agent-work-kit.js doctor ./my-project
```

After the npm package is published, use:

```bash
npx ryan-agent-work-kit init ./my-project
npx ryan-agent-work-kit check ./my-project
npx ryan-agent-work-kit doctor ./my-project
```

## Codex

Use `AGENTS.md` as the project entry point. Copy `personal-preferences/codex.md` into Codex personal preferences or custom instructions so the behavior follows you across projects.

## Claude Code

Use `CLAUDE.md` plus `AGENTS.md`. Copy `personal-preferences/claude-code.md` into your user-level Claude Code instructions when available. The core skills can be copied into a skills folder if your setup supports custom skills.

## Cursor

Use `.cursor/rules/project.mdc` as the always-on project rule file. Keep `AGENTS.md` as the shared source of truth.

## GitHub Copilot

Use `.github/copilot-instructions.md` for lightweight project guidance. Keep detailed rules in `AGENTS.md`.

## Trae

Trae reads `AGENT.md` (singular) at the project root as a native entry point. It also reads `.trae/rules/ryan-agent-work-kit.md` as a project-level rule file. Keep rule files shorter than the full `AGENTS.md`; Trae guidelines note that long rules may hurt adherence.

The init script creates both `AGENT.md` and `AGENTS.md`. Trae will find the project rules through either file.

Copy `personal-preferences/trae.md` into your Trae personal rules or custom agent prompt to make the behavior follow you across projects.

## Other Agents

Any agent that can read files can follow this kit:

1. Put the personal preference template into the tool's global instructions if supported.
2. Read `AGENTS.md`.
3. Read `docs/current-goal.md`.
4. Follow the handoff format.

## Doctor Checks

`doctor` is a mechanical project health check. It reports:

- Missing project memory files.
- Missing tool adapter files.
- Whether `.agent-runs/` is ignored.
- Whether the project exposes a basic validation signal.
- Whether the current Git branch is the default branch.
- Obvious sensitive or local-only filenames in a shallow scan.

It does not replace human review, secret scanning, tests, or release checks. It is meant to catch common setup issues before an agent starts work.

## Obsidian

Obsidian Bridge works with any local folder that acts as an Obsidian vault. The kit writes Markdown files only; sync is handled by whatever the user already uses, such as Obsidian Sync, iCloud, Dropbox, a NAS, or no sync at all.

Use:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

# Compatibility

Ryan Agent Work Kit uses plain files, so it can work with many AI coding tools.

## Codex

Use `AGENTS.md` as the project entry point. Copy `personal-preferences/codex.md` into Codex personal preferences or custom instructions so the behavior follows you across projects.

## Claude Code

Use `CLAUDE.md` plus `AGENTS.md`. Copy `personal-preferences/claude-code.md` into your user-level Claude Code instructions when available. The core skills can be copied into a skills folder if your setup supports custom skills.

## Cursor

Use `.cursor/rules/project.mdc` as the always-on project rule file. Keep `AGENTS.md` as the shared source of truth.

## GitHub Copilot

Use `.github/copilot-instructions.md` for lightweight project guidance. Keep detailed rules in `AGENTS.md`.

## Other Agents

Any agent that can read files can follow this kit:

1. Put the personal preference template into the tool's global instructions if supported.
2. Read `AGENTS.md`.
3. Read `docs/current-goal.md`.
4. Follow the handoff format.

## Obsidian

Obsidian Bridge works with any local folder that acts as an Obsidian vault. The kit writes Markdown files only; sync is handled by whatever the user already uses, such as Obsidian Sync, iCloud, Dropbox, a NAS, or no sync at all.

Use:

```bash
./scripts/setup-obsidian-bridge.sh "/path/to/your/ObsidianVault"
```

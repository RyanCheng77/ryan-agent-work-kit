# Current Goal

## Current Phase

Build v0.3 of Ryan Agent Work Kit: a CLI-first, doctor-checkable AI-ready project kit.

## Priority

1. Make the README understandable in 5 seconds.
2. Provide a one-command CLI setup path.
3. Add a lightweight `doctor` check for common setup, safety, and adapter issues.
4. Keep only the two core `ryan-*` skills in the first release.
5. Provide a small fictional demo project.

## Non-Goals

- No package registry publish in v0.3.
- No large product workflow suite in the first version.
- No real-world business examples.
- No remote publish or Git hosting setup.

## Acceptance Criteria

- A new user can run one CLI command or one script and get an AI-ready project structure.
- The generated project includes `AGENTS.md`, core docs, and handoff folders.
- The generated project includes tool adapter files for Claude Code, Cursor, and GitHub Copilot.
- The CLI supports `init`, `check`, and `doctor`.
- All visible skill names begin with `ryan-`.
- The public package contains only generic, fictional, and reusable content.

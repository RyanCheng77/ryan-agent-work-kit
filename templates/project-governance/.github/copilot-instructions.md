# GitHub Copilot Instructions

Read `AGENTS.md` first. Use it for project rules, task boundaries, validation, and handoffs.

Prefer scoped changes with clear tests or checks.

For verified reusable S2/S3 lessons, use scripts/ryan-memory-adapter.js capture with --client copilot. If Copilot exposes a session export or wrapper and trace capture is enabled, use trace with --client copilot and sync queued traces later. Do not promote candidate memory without named human approval; the project outbox does not touch DSH.

# Roadmap

## v0.1

- README product page.
- Project governance templates.
- Personal preference templates.
- `ryan-simple-git-workflow`.
- `ryan-multi-ai-repo-governance`.
- Init script.
- Demo project.

## v0.2

- Task Card standard for scoped, resumable AI work.
- Recommended task-card location under `docs/plans/`.
- Clear rules for when the lead agent should create a Task Card.
- Multi-agent delegation format built around Task Cards.
- Chinese README, quick start, personal preference, project governance, and task card templates.

## v0.3

- Zero-dependency CLI MVP: `init`, `check`, and `doctor`.
- Package metadata for future npm distribution.
- Doctor checks for required project memory, adapter files, `.agent-runs/` ignore rules, basic validation signals, default-branch risk, and obvious local/sensitive filenames.
- Compatibility adapter map for Codex, Claude Code, Cursor, and GitHub Copilot.
- Workflow Review template for noisy, repeated, or expensive workflows.
- Repeat-3-times rule: repeated work should be considered for script, hook, template, skill, or checklist automation.
- Human judgment boundary: keep people focused on product taste, safety, architecture, and other high-leverage decisions.
- Process pruning rule: every workflow should periodically prove it still earns its place.

## v0.4

- Ryan Reflect Lite: lightweight 4D AI collaboration self-check.
- New templates: `templates/ai-collaboration-reflect.md` and `templates/ai-collaboration-reflect.zh-CN.md`.
- New docs: `docs/ai-collaboration-reflect.md` and `docs/ai-collaboration-reflect.zh-CN.md`.
- Init flow installs the Reflect docs and templates.
- Personal preferences and project governance templates remind agents to use Reflect after complex, rework-heavy, weakly validated, or poorly split work.
- Reflect stays non-scoring, non-ranking, and does not capture full chat history.

## Later

- Optional product workflow skills.
- Optional quality gate skills.
- Optional hook adapters.
- Optional GenUI workflow integration.
- Browser-based demo.
- Published npm package and release automation.
- Recorded 60-second terminal demo.

## Principle

Add capability only when it helps a beginner get value faster or helps an agent make fewer mistakes.

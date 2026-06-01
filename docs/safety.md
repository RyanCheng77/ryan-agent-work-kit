# Public Package Safety

This project should stay generic and reusable.

## Do Include

- Fictional examples.
- Generic project templates.
- Ryan-branded public skills.
- Plain setup scripts.
- Guidance that can apply to many projects.

## Do Not Include

- Real organization names.
- Real project names.
- Real people or team details.
- Local machine paths.
- Private documents, screenshots, logs, or data.
- Credentials or access values.
- Text that points to non-public background material.

## Before Sharing

Run:

```bash
find . -name ".DS_Store" -o -name "._*"
./scripts/check-ai-ready.sh examples/demo-project
```

Also review README, docs, templates, skills, scripts, and examples manually before sharing.

# Docs Agent Guide

Docs are part of the product architecture, not afterthoughts.

## Folder Roles

- `architecture/`: durable technical architecture.
- `planning/`: product scope, roadmap, guardrails.
- `setup/`: project structure and local setup.
- `database/`: database lifecycle, local/AWS behavior, migrations, query guidance.
- `decisions/`: architecture decision records.
- `journey/`: dated milestone/day logs.

## Rules

- Keep the raw requirement file as source material only.
- Keep refined docs as the implementation source of truth.
- If a decision changes architecture, add or update an ADR in `decisions/`.
- If a command is required for setup, add it to `development/commands.md`.
- If a milestone happens, add a dated journey entry.


# ADR-0004: Run Backend Tests Before Backend Builds

Date: 2026-04-28
Status: Accepted

## Context

The backend will grow through phases with agentic AI assistance. Broken behavior should not be hidden behind a successful TypeScript build.

## Decision

Use npm's `prebuild` hook in the `server` package:

```text
prebuild -> npm run test
build    -> tsc -p tsconfig.json
```

Any `npm run build --workspace server` command runs tests before compiling.

## Consequences

- Backend builds fail when backend tests fail.
- Build time increases slightly, but regressions become harder to miss.
- Agents must keep tests focused and fast.

## References

- `server/package.json`
- `docs/architecture/testing-strategy.md`
- `server/AGENTS.md`


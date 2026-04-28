# ADR-0003: Use Docs As Project Memory

Date: 2026-04-28
Status: Accepted

## Context

This project will use agentic AI and phased implementation. Without durable notes, decisions and commands can drift across sessions.

## Decision

Use structured docs as project memory:

- `docs/journey/` for daily and milestone logs.
- `docs/decisions/` for durable architecture decisions.
- `docs/database/` for database lifecycle and query rules.
- `AGENTS.md` files for agent instructions.

## Consequences

- Agents must update docs when decisions, commands, schema, or flow change.
- Journey entries should be created for milestones.
- ADRs should be referenced when implementation depends on a decision.

## References

- `AGENTS.md`
- `docs/journey/README.md`
- `docs/decisions/README.md`


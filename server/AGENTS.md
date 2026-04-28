# Server Agent Guide

The server is an Express.js + TypeScript API.

## Module Pattern

Each module should follow this shape:

```text
modules/example/
  example.routes.ts
  example.controller.ts
  example.service.ts
  example.repository.ts
  example.schemas.ts
  example.types.ts
  example.test.ts
```

## Layer Rules

- Routes wire middleware and controllers.
- Schemas validate params, query, and body.
- Controllers translate HTTP to service calls.
- Services own business rules and transactions.
- Repositories own database access.
- Tests should sit close to the behavior they verify.

## Hard Rules

- Do not put business logic in controllers.
- Do not query Prisma directly from controllers.
- Do not change booking status outside the booking workflow service.
- Do not trust payment success from a client response.
- Add tests for every new behavior.

## Commands

Common commands after dependencies are installed:

```text
npm run dev
npm run build
npm run test
npm run lint
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
```


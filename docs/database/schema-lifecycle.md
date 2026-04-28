# Schema Lifecycle

## Local Schema Change Flow

1. Update `server/prisma/schema.prisma`.
2. Create a migration:

```powershell
cd server
npm run prisma:migrate:dev -- --name describe_change
```

3. Review generated SQL in `server/prisma/migrations/`.
4. Update seed data if needed.
5. Run tests.
6. Update docs.

## Phase 2 Auth Migration

Phase 2 introduces:

- `users`
- `refresh_tokens`
- `UserRole` enum

Migration files:

```text
server/prisma/migrations/20260428105000_phase_2_auth_users/migration.sql
server/prisma/migrations/20260428165000_refresh_token_hash_unique/migration.sql
```

Apply locally:

```powershell
docker compose up -d postgres
npm run prisma:migrate:dev --workspace server
```

Apply to AWS/Neon/hosted PostgreSQL:

```powershell
npm run prisma:migrate:deploy --workspace server
```

Seed the first admin:

```powershell
npm run db:seed --workspace server
```

## Fresh Database Flow

For a new local machine:

```powershell
docker compose up -d postgres
cd server
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run db:seed
```

## Reset Local Database

Use only for local development data:

```powershell
cd server
npm run prisma:migrate:reset
```

Never run reset commands against AWS or production databases.

## AWS Migration Flow

For staging/production:

```powershell
cd server
npm run prisma:migrate:deploy
```

This applies committed migrations without prompting and without creating new migration files.

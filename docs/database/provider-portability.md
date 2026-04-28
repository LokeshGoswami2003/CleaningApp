# Database Provider Portability

The backend is designed to be PostgreSQL-provider portable.

## Provider Contract

Any provider must support:

- PostgreSQL connection strings.
- Standard SQL migrations.
- SSL connections for hosted databases.
- Connection limits appropriate for the API runtime.

Good candidates:

- Local Docker PostgreSQL.
- AWS RDS PostgreSQL.
- Neon.
- Supabase Postgres.
- Railway Postgres.
- Render Postgres.

## Switch Provider Checklist

1. Create the database on the provider.
2. Create an application user with least required privileges.
3. Put the connection string in `DATABASE_URL`.
4. Run:

```powershell
npm run prisma:migrate:deploy --workspace server
npm run prisma:generate --workspace server
```

5. Start the API.
6. Run smoke tests against `/api/v1/health`.

## Local Vs Hosted

Local:

- Use `docker compose up -d postgres`.
- Use `prisma migrate dev` to create migrations.

Hosted:

- Use the provider dashboard or IaC to create the database.
- Use `prisma migrate deploy` to apply committed migrations.
- Never use `prisma migrate reset`.

## Pooling

Serverless providers like Neon often provide pooled and direct URLs.

Recommended:

- Use direct URL for migrations when required by the provider.
- Use pooled URL for runtime if the API is deployed in a serverless environment.

If we need both later, add:

```text
DATABASE_URL=
DIRECT_DATABASE_URL=
```


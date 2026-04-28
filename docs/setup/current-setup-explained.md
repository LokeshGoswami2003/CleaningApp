# Current Setup Explained

## Why `node_modules` Exists At The Root

The repo uses npm workspaces:

```json
{
  "workspaces": ["server", "client-web"]
}
```

With workspaces, npm installs most shared dependencies in the root `node_modules` folder and links workspace packages from there.

Benefits:

- One root `package-lock.json`.
- Fewer duplicated dependency downloads.
- Root commands can run server/client commands with `--workspace`.

Example:

```powershell
npm run build --workspace server
npm run build --workspace client-web
```

## Why `docker-compose.yml` Exists

Docker Compose gives every developer the same local PostgreSQL database.

It creates:

- PostgreSQL container: `cleaning-app-postgres`.
- Database: `cleaning_app_dev`.
- User: `cleaning_app`.
- Password: `cleaning_app_password`.
- Persistent Docker volume: `cleaning_app_postgres_data`.

Start local DB:

```powershell
docker compose up -d postgres
```

Stop local DB:

```powershell
docker compose down
```

## Why Prisma Exists

Prisma owns the application schema lifecycle:

```text
schema.prisma -> migrations -> database tables -> Prisma Client
```

Local development creates migrations with:

```powershell
npm run prisma:migrate:dev --workspace server
```

Shared environments apply existing migrations with:

```powershell
npm run prisma:migrate:deploy --workspace server
```

## Plug-And-Play Database Providers

The app talks to PostgreSQL through `DATABASE_URL`.

To switch from local Docker PostgreSQL to AWS RDS, Neon, Supabase, Railway, or another PostgreSQL provider:

1. Create a PostgreSQL database with the provider.
2. Copy the provider connection string.
3. Set `DATABASE_URL` in the environment.
4. Run `npm run prisma:migrate:deploy --workspace server`.
5. Start the API.

No application code should change if the provider is PostgreSQL-compatible.

Provider examples:

```text
Local Docker:
postgresql://cleaning_app:cleaning_app_password@localhost:5432/cleaning_app_dev?schema=public

AWS RDS:
postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/DB_NAME?schema=public

Neon:
postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require
```

## What Should Not Be Committed

Do not commit:

- `.env`
- provider passwords
- database URLs with real credentials
- generated build folders
- `node_modules`


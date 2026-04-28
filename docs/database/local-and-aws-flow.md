# Local And AWS Database Flow

## Local Development

Local development uses PostgreSQL through Docker Compose.

Flow:

```text
docker compose up -d postgres
  -> PostgreSQL container starts
  -> database is available at localhost:5432
  -> server reads DATABASE_URL
  -> Prisma connects to PostgreSQL
  -> Prisma migrations create/update tables
```

Local `DATABASE_URL` example:

```text
postgresql://cleaning_app:cleaning_app_password@localhost:5432/cleaning_app_dev?schema=public
```

Commands:

```powershell
docker compose up -d postgres
cd server
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

## How Tables Are Created

Tables are not manually created with ad hoc SQL during normal development.

Tables are created by Prisma migrations:

```text
server/prisma/schema.prisma
  -> npm run prisma:migrate:dev
  -> server/prisma/migrations/*
  -> PostgreSQL tables
```

This keeps table creation repeatable for every machine and every environment.

## AWS Production/Staging

Recommended AWS setup:

- Amazon RDS PostgreSQL for the database.
- Private subnets for RDS.
- Security group allowing access only from the API runtime.
- Secrets stored in AWS Secrets Manager, SSM Parameter Store, or deployment platform secrets.

AWS flow:

```text
Create RDS PostgreSQL instance
  -> create application database/user
  -> set DATABASE_URL in deployment secrets
  -> run Prisma migrate deploy during release
  -> API starts using the migrated schema
```

Production command:

```powershell
cd server
npm run prisma:migrate:deploy
npm run build
npm run start
```

## Important Rule

Use `prisma migrate dev` locally. Use `prisma migrate deploy` in AWS/staging/production.

Do not use `prisma db push` for shared environments because it bypasses migration history.


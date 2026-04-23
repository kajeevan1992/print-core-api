# API fix v3 auto DB + seed

This patch makes the API self-heal on deploy.

## On startup it can:
- run `prisma db push`
- connect Prisma
- seed demo category/products when the catalog is empty

## New env flags
- `AUTO_DB_PUSH=true`
- `AUTO_SEED_DEMO=true`

## New dev routes
- `GET /dev/ping`
- `POST /dev/seed`

## Recommended Coolify env
- keep `DATABASE_URL`
- set `AUTO_DB_PUSH=true`
- set `AUTO_SEED_DEMO=true`

After deploy, test:
- `/health`
- `/dev/ping`
- `/products`

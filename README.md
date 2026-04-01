# print-core-api

Production-ready backend API for a print SaaS platform with modules for products, channels, and themes.

## Stack
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL

## Setup
1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Run migrations (local development): `npm run prisma:migrate`
5. Start in dev mode: `npm run dev`

## Environment variables
- `DATABASE_URL` (required): PostgreSQL connection string.
- `PORT` (optional, default `4000`): API server port.
- `NODE_ENV` (optional, default `development`): runtime environment.
- `CORS_ORIGIN` (optional): comma-separated list of allowed CORS origins. If omitted, all origins are allowed.

## Deployment notes (Coolify)
- PostgreSQL is required before starting this service.
- Ensure `DATABASE_URL` points to your Coolify PostgreSQL instance.
- Build command: `npm run build`
- Start command: `npm run start`
- Run production migrations with `npx prisma migrate deploy` (or `npm run prisma:deploy`).
- Do not use `prisma migrate dev` in production.
- The build command runs `prisma generate && tsc -p tsconfig.json` to ensure Prisma client availability in production.

## Health checks
- Root check: `GET /`
- Health check: `GET /health`

## Endpoints
### Products
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PATCH /products/:id`

### Channels
- `GET /channels`
- `GET /channels/:id`
- `POST /channels`
- `PATCH /channels/:id`

### Themes
- `GET /themes`
- `GET /themes/:id`
- `POST /themes`
- `POST /themes/assign`

## List endpoint query params
- `page` (default `1`)
- `limit` (default `20`, max `100`)
- `search`
- `status` (products/channels)

# API fix v5 safe mode build fix

This patch removes Prisma model assumptions for endpoints that are ahead of the current schema.

## Safe-mode endpoints
- `GET /tenants`
- `PATCH /tenants/:id/plan`
- `PATCH /tenants/:id/status`
- `PATCH /orders/:id/status`

## Why
The current Prisma schema does not yet include `Tenant` or `Order` models, so direct `prisma.tenant` and `prisma.order` usage caused build failures.

## Result
- build succeeds
- UI wiring can continue
- endpoint shapes stay stable
- later we can swap safe-mode logic back to real Prisma once the models are added

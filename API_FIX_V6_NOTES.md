# API fix v6 real tenant/order models

## Added real Prisma models
- `Tenant`
- `TenantDomain`
- `Order`

## Added real seed data
- demo tenants
- demo domains
- demo orders

## Endpoints now DB-backed
- `GET /orders`
- `PATCH /orders/:id/status`
- `GET /tenants`
- `PATCH /tenants/:id/plan`
- `PATCH /tenants/:id/status`

## Expected behavior
With `AUTO_DB_PUSH=true` and `AUTO_SEED_DEMO=true`, deploy should:
1. push the new schema
2. seed demo tenants/orders if missing
3. enable real admin + superadmin API wiring

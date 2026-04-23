# API fix v4 admin/superadmin endpoints

## Added endpoints
- `GET /tenants`
- `PATCH /tenants/:id/plan`
- `PATCH /tenants/:id/status`
- `PATCH /orders/:id/status`

## Purpose
This matches the UI wiring already added in the main app:
- admin order status changes
- superadmin tenant list
- superadmin plan changes
- superadmin tenant activation/suspension

## After deploy test
- `/tenants`
- `PATCH /tenants/:id/plan`
- `PATCH /tenants/:id/status`
- `PATCH /orders/:id/status`

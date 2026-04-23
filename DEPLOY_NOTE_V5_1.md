# Deploy note for API fix v5.1

This patch is focused on build stability in Coolify.

## Why
Coolify is warning that `NODE_ENV=production` can skip build-required devDependencies.
This patch duplicates build-critical TypeScript/Prisma packages into normal dependencies so `npm run build` can succeed.

## Recommended Coolify setting
Prefer:
- `NODE_ENV=development` at build time
or
- mark `NODE_ENV` as runtime-only

But this patch should still be more tolerant even if that setting is not changed.

# API fix v9 safe catalog fix

This patch corrects the catalog API extension without overwriting existing schema-backed modules.

## What it fixes
- removes duplicate route imports for existing categories/collections/tags modules
- keeps existing category/collection/tag schema and endpoints untouched
- adds only the missing Prisma models:
  - Material
  - Finish
  - OptionSet
- seeds only materials, finishes, and option sets
- adds live GET endpoints:
  - /materials
  - /finishes
  - /option-sets

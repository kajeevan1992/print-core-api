# API fix v7 bulk live endpoints

## Added/expanded live DB-backed endpoints
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PATCH /orders/:id/status`
- `GET /artwork`
- `GET /artwork/:id`
- `POST /artwork`
- `PATCH /artwork/:id/status`

## Added Prisma models
- `OrderItem`
- `Artwork`

## Seed improvements
- demo orders now include items
- demo artwork queue data is seeded and linked to orders

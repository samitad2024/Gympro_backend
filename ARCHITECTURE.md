# GymPro Backend — Folder Architecture

Clean architecture inspired by Flutter's feature-first layout. Each layer has a single responsibility and dependencies flow inward.

## Structure

```
src/
├── app.ts                    # Express app setup (middleware + routes)
├── index.ts                  # Server bootstrap
│
├── core/                     # Shared kernel (like Flutter core/)
│   ├── config/               # env, swagger
│   ├── database/             # Drizzle client, schema, migrations
│   ├── errors/               # AppError
│   ├── middleware/           # auth, validation, error handling
│   ├── router.ts             # Central route registration
│   ├── types/                # Global TypeScript augmentations
│   └── utils/                # api-response, async-handler, jwt
│
└── modules/                  # Feature modules (like Flutter features/)
    └── {feature}/
        ├── index.ts          # Public export (routes)
        ├── presentation/     # HTTP layer — routes + controllers
        ├── application/      # Business logic — services
        ├── domain/           # Types, entities, contracts
        └── infrastructure/   # Data access — repositories + validators
```

## Layer mapping (Flutter ↔ Node)

| Flutter Clean Arch | GymPro Backend |
|---|---|
| `core/` | `src/core/` |
| `features/X/presentation/` | `src/modules/X/presentation/` |
| `features/X/domain/` (entities) | `src/modules/X/domain/` |
| `features/X/domain/` (use cases) | `src/modules/X/application/` |
| `features/X/data/` | `src/modules/X/infrastructure/` |

## Dependency rules

- **presentation** → application (never touches DB directly)
- **application** → domain + infrastructure
- **infrastructure** → domain + database
- **domain** → no inward dependencies (types only)
- **core** → used by all modules, never imports from modules

## Path aliases

```typescript
@core/*     → src/core/*
@modules/*  → src/modules/*
```

## Request flow

```
HTTP Request
  → presentation/routes.ts
  → core/middleware/validate-request
  → presentation/controller.ts
  → application/service.ts
  → infrastructure/repository.ts
  → core/database (Drizzle)
```

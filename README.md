# GymPro Backend

Production-ready REST API for **single-gym management** — members, plans, payments, expenses, content, notifications, and monthly reports. Built for the GymPro owner dashboard (React) and member mobile app (Flutter).

**Repository:** [github.com/samitad2024/Gympro_backend](https://github.com/samitad2024/Gympro_backend)

---

## Features

- Membership plans CRUD
- Member registration (pending → active flow with payment confirmation)
- Manual payment & expense tracking
- Monthly income/expense reports
- Gym services & content (manuals, daily quotes)
- Scheduled push notification management
- Owner JWT authentication for dashboard routes
- Swagger UI + OpenAPI JSON for frontend integration
- Automated API smoke tests

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ |
| Language | TypeScript 5.7 |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod 4 |
| Auth | JWT + bcryptjs |
| API Docs | Swagger (OpenAPI 3.0) |

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)

### 1. Clone & install

```bash
git clone https://github.com/samitad2024/Gympro_backend.git
cd Gympro_backend
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
PORT=4000
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
OWNER_EMAIL=admin@gmail.com
OWNER_PASSWORD=admin123
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
API_PUBLIC_URL=http://localhost:4000
```

### 3. Database migrations

```bash
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

| Resource | URL |
|----------|-----|
| API | http://localhost:4000 |
| Swagger UI | http://localhost:4000/api-docs |
| OpenAPI JSON | http://localhost:4000/api-docs.json |
| Health check | http://localhost:4000/health |

### 5. Default owner login

```json
POST /api/auth/owner/login
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

---

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run production build |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run test:api` | Run 48-endpoint smoke test (server must be running) |

---

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── index.ts                  # Server entry + startup jobs
├── core/
│   ├── config/               # env, swagger
│   ├── database/             # client, schema, migrations
│   ├── errors/               # AppError
│   ├── middleware/           # auth, validation, errors
│   ├── router.ts             # Route registration
│   ├── types/
│   └── utils/                # api-response, jwt, validators
└── modules/
    └── {feature}/
        ├── index.ts
        ├── presentation/     # routes + controllers
        ├── application/      # services (business logic)
        ├── domain/           # types
        └── infrastructure/   # repositories + validators
```

Each module follows **clean architecture**: presentation → application → infrastructure.

---

## API Overview

All responses use a standard envelope:

```json
// Success
{ "success": true, "message": null, "data": { ... } }

// Error
{ "success": false, "message": "Error description", "errors": { ... } }
```

### Authentication

| Client | Login | Token usage |
|--------|-------|-------------|
| Owner dashboard | `POST /api/auth/owner/login` | `Authorization: Bearer <token>` on protected routes |
| Member mobile app | `POST /api/auth/member/login` | Phone-based JWT |

### Public routes (no token)

- `POST /api/members` — member self-registration
- `GET /api/plans`, `GET /api/plans/:id`
- `GET /api/services`, `GET /api/services/:id`
- `GET /api/content`, `GET /api/content/daily-quote`, `GET /api/content/:id`
- `POST /api/auth/owner/login`, `POST /api/auth/member/login`

All other `/api/*` routes require an **owner JWT**.

### Core business flow

```
1. POST /api/plans              → create membership plan
2. POST /api/members            → register (status: pending)
3. GET  /api/members/pending    → owner sees queue
4. PATCH /api/members/:id/confirm → activate + auto-create payment
5. GET  /api/reports/monthly    → income/expense summary
```

Full endpoint reference: [docs/API.md](docs/API.md)

---

## Testing in Swagger

1. Open http://localhost:4000/api-docs
2. Call `POST /api/auth/owner/login` with owner credentials
3. Copy `data.token` from the response
4. Click **Authorize** (top right) → paste token only (no `Bearer` prefix)
5. Test protected endpoints

Run automated tests:

```bash
npm run dev          # terminal 1
npm run test:api     # terminal 2
```

---

## Production Build

```bash
npm run build
NODE_ENV=production npm start
```

Set production environment variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | Yes | `production` |
| `DATABASE_URL` | Yes | Hosted PostgreSQL URL |
| `JWT_SECRET` | Yes | Minimum 32 characters |
| `OWNER_EMAIL` | Yes | Dashboard login email |
| `OWNER_PASSWORD` | Yes | Dashboard login password |
| `CORS_ORIGIN` | Yes | Frontend URL(s), comma-separated |
| `API_PUBLIC_URL` | Yes | Public API URL for Swagger |
| `PORT` | Auto | Set by host (Render, Railway, etc.) |

Deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/API.md](docs/API.md) | Full API endpoint reference |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy to Render / production |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture |
| [docs/frontend-handoff/](docs/frontend-handoff/) | OpenAPI + prompts for React dashboard |
| [docs/openapi.json](docs/openapi.json) | OpenAPI 3.0 spec (static export) |

---

## Frontend Integration

For the React admin dashboard:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Handoff files for Google AI Studio / frontend team are in `docs/frontend-handoff/`:

- `openapi.json` — OpenAPI spec
- `api-endpoints.json` — endpoint reference
- `entity-schemas.json` — sample response shapes
- `GOOGLE_AI_STUDIO_PROMPT.md` — AI build prompt

---

## License

ISC

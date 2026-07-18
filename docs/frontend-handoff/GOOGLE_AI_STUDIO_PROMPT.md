# GymPro Admin Dashboard — Google AI Studio Master Prompt

Copy everything below the line into Google AI Studio. Attach these files in the same chat:

1. `openapi.json` — full OpenAPI 3.0 spec from backend
2. `api-endpoints.json` — human-readable endpoint reference
3. `entity-schemas.json` — sample JSON for every entity
4. `FRONTEND_PROJECT_STRUCTURE.md` — folder layout

---

## PROMPT (copy from here)

You are a senior React engineer. Build a **production-ready GymPro Admin Dashboard** for a single-gym management system. Reverse-engineer the attached backend API files (`openapi.json`, `api-endpoints.json`, `entity-schemas.json`) and implement the frontend to match exactly.

### Backend API (source of truth)

- **Base URL:** `http://localhost:4000` (use env `VITE_API_BASE_URL`)
- **OpenAPI:** `http://localhost:4000/api-docs.json`
- **Swagger UI:** `http://localhost:4000/api-docs`

### Response contract (CRITICAL — every endpoint uses this)

```json
// Success
{ "success": true, "message": null, "data": { ... } }

// Error
{ "success": false, "message": "Human readable error", "errors": { ... } }
```

Always read data from `response.data.data` (axios) or `json.data` (fetch). Never assume the payload is at the root.

### Authentication

1. Login: `POST /api/auth/owner/login` with `{ "email": "admin@gmail.com", "password": "admin123" }`
2. Response: `{ success: true, data: { token: "eyJ..." } }`
3. Store token in `localStorage` key `gympro_token`
4. Send on ALL protected routes: `Authorization: Bearer <token>`
5. On 401: clear token, redirect to `/login`

Protected = everything except:
- POST /api/auth/owner/login, POST /api/auth/member/login
- POST /api/members (mobile registration — dashboard can also create members with auth)
- GET /api/plans, GET /api/plans/:id
- GET /api/services, GET /api/services/:id
- GET /api/content, GET /api/content/daily-quote, GET /api/content/:id

### Tech stack (use exactly)

- **React 18** + **TypeScript** + **Vite**
- **React Router v6** — protected routes
- **TanStack Query (React Query)** — all API calls
- **Axios** — HTTP client with request/response interceptors
- **Tailwind CSS** — styling
- **React Hook Form + Zod** — forms
- **Recharts** — dashboard charts
- **Lucide React** — icons

### Project structure

Follow `FRONTEND_PROJECT_STRUCTURE.md`:
- `src/api/` — typed API layer (one file per resource)
- `src/features/` — page components per domain
- `src/components/layout/` — AppLayout, Sidebar, ProtectedRoute
- `src/features/auth/` — login + auth context

### Pages to build

#### 1. Login (`/login`)
- Email + password form
- Call owner login API
- Save token, redirect to dashboard
- Show API error messages from `message` field

#### 2. Dashboard (`/`)
- KPI cards: total income, total expenses, net profit, active members, pending members
- Data: `GET /api/reports/monthly?month=YYYY-MM` (current month)
- `GET /api/members?status=active` (count)
- `GET /api/members/pending` (count)
- Bar/line chart: income vs expenses (use report data; optionally fetch last 6 months)

#### 3. Members (`/members`)
- Table: name, phone, plan, status, start/end dates
- Filter tabs: All | Pending | Active | Expired (`?status=`)
- Actions: view, edit, delete
- Create member form (name, phone, plan dropdown from GET /api/plans)

#### 4. Pending Members (`/members/pending`) — **MOST IMPORTANT FLOW**
- List from `GET /api/members/pending`
- Each row: Confirm Payment button → modal with amount + payment method (Cash, Bank Transfer, etc.)
- Submit: `PATCH /api/members/:id/confirm` with `{ amount, methodLabel }`
- On success: member becomes active, payment auto-created — refresh list

#### 5. Plans (`/plans`)
- CRUD table: name, duration (days), price
- Create/Edit modal
- Delete with confirmation (show 409 error if plan has members)

#### 6. Payments (`/payments`)
- Table: member ID, amount, method, date
- Filter by memberId (optional)
- Add manual payment: member select (active only), amount, method, date

#### 7. Expenses (`/expenses`)
- CRUD table: amount, description, category, date
- Categories: Maintenance, Utilities, Salaries, Equipment, Other

#### 8. Services (`/services`)
- CRUD: name, description, active toggle

#### 9. Content (`/content`)
- Tabs: Manuals | Quotes
- CRUD: type, title, body (textarea)

#### 10. Notifications (`/notifications`)
- CRUD: title, body, scheduledAt (datetime picker), isActive toggle

### UI/UX requirements

- Modern dark sidebar layout (gym/fitness theme — dark slate + emerald/green accent)
- Responsive: works on desktop (primary) and tablet
- Loading skeletons while fetching
- Toast notifications on success/error
- Empty states when no data
- Confirm dialogs before delete
- Status badges: pending=yellow, active=green, expired=red
- Format prices as currency (price/amount are strings like "500.00")
- Format dates with locale (ISO strings from API)

### API layer requirements

Create `src/api/client.ts`:
```typescript
// Axios instance, baseURL from import.meta.env.VITE_API_BASE_URL
// Request interceptor: add Bearer token
// Response interceptor: unwrap { success, data }, throw on !success
// 401 → logout + redirect
```

Create typed functions for every endpoint in `api-endpoints.json`. Use TypeScript interfaces matching `entity-schemas.json`.

### Validation (mirror backend)

- Plan price/amount: string matching `\d+(\.\d{1,2})?`
- Member phone: required, unique (show 409 message)
- Report month: `YYYY-MM`
- Dates: ISO datetime strings (use `.toISOString()` when sending)

### Error handling

| Status | UI action |
|--------|-----------|
| 400 | Show `message` + field errors |
| 401 | Redirect login |
| 404 | "Not found" toast |
| 409 | Show conflict message (duplicate phone, plan in use) |
| 500 | Generic error toast |

### Deliverables

Generate the complete Vite project with:
1. All pages and routing
2. Full API integration (no mock data)
3. `.env.example` with `VITE_API_BASE_URL=http://localhost:4000`
4. README with setup: `npm install`, `npm run dev`
5. Working login → dashboard → pending member confirm flow

Do NOT use mock APIs. Every feature must call the real backend endpoints from the attached spec.

Build clean, typed, production-quality code. Use feature folders, not giant files.

---

## END PROMPT

## Files checklist for Google AI Studio upload

| File | Path in repo |
|------|----------------|
| OpenAPI spec | `docs/frontend-handoff/openapi.json` |
| Endpoint reference | `docs/frontend-handoff/api-endpoints.json` |
| Entity samples | `docs/frontend-handoff/entity-schemas.json` |
| Project structure | `docs/frontend-handoff/FRONTEND_PROJECT_STRUCTURE.md` |
| Env example | `docs/frontend-handoff/.env.example` |

## After AI generates the frontend

```bash
cd gympro-admin
npm install
cp .env.example .env
npm run dev
```

Ensure backend is running: `npm run dev` in Gympro_backend on port 4000.

Login: `admin@gmail.com` / `admin123`

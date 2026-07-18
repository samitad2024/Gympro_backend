# Gym Management System — Architecture Document

**Scope:** Single-gym pilot (no multi-tenancy). Solo developer, AI-agent-assisted build.
**Stack:** Node.js backend, React + Vite dashboard, Flutter mobile app, PostgreSQL database.
**Payment model:** No payment gateway integration. All payments recorded manually by the owner.

---

## 1. High-Level Overview

```
                        ┌───────────────────────┐
                        │     PostgreSQL DB      │
                        │  (single source of     │
                        │   truth for all data)  │
                        └───────────▲────────────┘
                                    │
                                    │  SQL (via ORM/queries)
                                    │
                        ┌───────────┴────────────┐
                        │     Node.js Backend     │
                        │   (REST API + Auth +    │
                        │  Notification Scheduler)│
                        └──────▲───────────▲──────┘
                               │           │
                     REST/JSON │           │ REST/JSON
                               │           │
                 ┌─────────────┴───┐   ┌───┴─────────────┐
                 │  React + Vite    │   │  Flutter Mobile  │
                 │  Owner Dashboard │   │   Member App     │
                 └──────────────────┘   └──────────────────┘
                        (Web, owner only)     (iOS/Android, members)
```

**Core principle:** The backend is the single source of truth. Neither client (dashboard or mobile app) talks to the database directly — both go through the same REST API, so business rules (e.g. "pending until owner confirms payment") are enforced in one place only.

---

## 2. Backend Architecture (Node.js)

### 2.1 Responsibilities
- Expose REST API consumed by both dashboard and mobile app
- Enforce all business rules (status transitions, plan/end_date calculation, income logging on confirmation)
- Handle authentication (owner login for dashboard; lightweight member auth for app)
- Run the scheduled notification job (daily quote, weekly reminders, expiry alerts)
- Own the database schema and all writes

### 2.2 Suggested internal structure
```
backend/
├── src/
│   ├── routes/          # one file per resource: members, plans, payments, expenses, services, content, notifications
│   ├── controllers/     # request handling + validation
│   ├── services/         # business logic (e.g. confirmMemberPayment, calculateEndDate)
│   ├── models/           # DB access layer (queries or ORM models)
│   ├── jobs/             # scheduled notification sender
│   ├── middleware/       # auth, error handling
│   └── db/
│       └── schema.sql
├── .env                  # DB connection, JWT secret, Firebase server key
└── package.json
```

### 2.3 Key modules
| Module | Responsibility |
|---|---|
| `auth` | Owner login (JWT). Member auth is lightweight — phone-based, no password required initially |
| `members` | CRUD, status transitions, pending queue |
| `plans` | CRUD for membership plans (name, duration, price) |
| `payments` | Manual income log; auto-created when owner confirms a pending member |
| `expenses` | Manual expense log |
| `reports` | Monthly income/expense summary aggregation |
| `services` | CRUD for services shown in the app |
| `content` | CRUD for workout manuals + quotes |
| `notifications` | CRUD for scheduled messages + the job that actually sends them via Firebase Cloud Messaging |

### 2.4 Business rule ownership (important for AI-agent builds)
These rules must live in the backend `services/` layer, not in the frontend or mobile app, so both clients stay consistent automatically:
- New self-registration → status = `pending`
- Confirming payment → status = `active`, `end_date` calculated from selected plan's `duration_days`, and a `payments` row is inserted — all as one transaction
- A daily/scheduled job flips `active` → `expired` when `end_date` has passed

### 2.5 Auth approach
- **Owner:** single-user login (email/password or fixed credentials), JWT issued, required on all dashboard-only endpoints
- **Member:** phone-number-based identification (no password needed for a v1 pilot); optionally add OTP via SMS later if abuse becomes a concern

### 2.6 Notifications
- Firebase Cloud Messaging (FCM) for push
- A scheduled job (node-cron, or a hosted cron hitting an endpoint) checks `notifications_schedule` and sends due messages
- Expiry alerts are computed directly from `members.end_date`, not manually scheduled

---

## 3. Dashboard Architecture (React + Vite)

### 3.1 Responsibilities
- Owner-only interface (single user, no roles/permissions system needed)
- All data operations go through the backend REST API — no direct DB access
- Present member list, pending queue, income/expense tracking, monthly reports, and content/services management

### 3.2 Suggested structure
```
dashboard/
├── src/
│   ├── pages/
│   │   ├── Members/           # list, detail, register, edit
│   │   ├── PendingQueue/      # confirm payment flow
│   │   ├── Income/            # payment log + entry
│   │   ├── Expenses/          # expense log + entry
│   │   ├── Reports/           # monthly summary + charts
│   │   ├── Plans/             # manage plans
│   │   ├── Services/          # manage services
│   │   ├── Content/           # manage manuals + quotes
│   │   └── Notifications/     # manage scheduled messages
│   ├── components/            # shared UI (tables, modals, forms)
│   ├── api/                   # one file per resource, wraps fetch calls to backend
│   ├── auth/                   # login page + token storage
│   └── App.jsx
└── package.json
```

### 3.3 Key flows
- **Confirm Payment modal** — single form (amount, method label, confirm plan) that calls one backend endpoint; dashboard does not compute `end_date` itself, backend does
- **Monthly Reports page** — calls a single aggregation endpoint (e.g. `GET /api/reports/monthly?month=2026-07`) rather than pulling raw rows and computing totals client-side, keeping logic centralized in the backend

### 3.4 Libraries
- Routing: React Router
- Data fetching: fetch/axios + React Query (recommended, handles caching/refetch after mutations like "confirm payment" cleanly)
- Charts: Recharts
- Forms: simple controlled components or React Hook Form

---

## 4. Mobile App Architecture (Flutter)

### 4.1 Responsibilities
- Member-facing interface: registration, status, services, workout manuals, quotes, notifications
- Talks only to the backend REST API — same as dashboard, no direct DB access
- Receives push notifications via Firebase Cloud Messaging

### 4.2 Suggested structure
```
mobile/
├── lib/
│   ├── screens/
│   │   ├── onboarding/          # registration form
│   │   ├── pending_status/      # "awaiting confirmation" screen
│   │   ├── home/                # membership status + daily quote
│   │   ├── services/            # service list
│   │   ├── manuals/             # workout manuals list + detail
│   │   └── profile/             # basic profile view/edit
│   ├── services/                # API client (one class per resource)
│   ├── models/                  # data models mirroring backend response shapes
│   ├── notifications/           # FCM setup + handling
│   └── main.dart
└── pubspec.yaml
```

### 4.3 Key flows
- **Registration** → `POST /api/members` → app shows pending screen → app polls or subscribes for status change (simplest v1: poll every time app opens or on pull-to-refresh; realtime sync can be added later if needed)
- **Home screen** → membership status, days remaining, daily quote — all read-only calls to the backend
- **Push notifications** → FCM token registered on login, sent to backend, stored against the member record so the notification job knows where to deliver

### 4.4 Libraries
- HTTP: `dio` or `http` package
- State management: Provider or Riverpod (keep it simple, avoid heavy architecture for a single-gym pilot)
- Push notifications: `firebase_messaging`
- Local storage (auth token/session): `shared_preferences`

---

## 5. Data Flow Summary (cross-cutting)

| Action | Origin | Backend logic | Result visible in |
|---|---|---|---|
| Member self-registers | Mobile app | Create member, status = pending | Dashboard (Pending Queue), Mobile (pending screen) |
| Owner confirms payment | Dashboard | Update status = active, set end_date, insert payment row | Both — mobile reflects active status on next check |
| Owner logs expense | Dashboard | Insert expense row | Dashboard reports only |
| Owner adds workout manual | Dashboard | Insert content row | Mobile app manuals list |
| Scheduled job runs | Backend (cron) | Send due notifications via FCM; flip expired memberships | Mobile (push notification), Dashboard (status updates) |

---

## 6. What's explicitly out of scope (v1)

- No payment gateway integration (Telebirr/CBE Birr APIs) — all payments are manual records
- No multi-gym / multi-tenant support
- No role-based permissions (single owner user)
- No offline-first sync for the mobile app in v1 (can be added later if connectivity issues prove significant)

---

## 7. Next artifacts to produce

1. `schema.sql` — full database schema
2. `api-spec.md` — full endpoint list with request/response shapes
3. `decisions.md` — running log of scope decisions (to keep AI-agent sessions consistent)

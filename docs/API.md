# GymPro API Reference

Base URL: `http://localhost:4000` (development)

**OpenAPI spec:** `/api-docs.json`  
**Swagger UI:** `/api-docs`

---

## Response Envelope

Every endpoint returns:

```typescript
type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T;
  errors?: unknown;
};
```

---

## Authentication

### Owner login (dashboard)

```http
POST /api/auth/owner/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

**Response `data`:**

```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

Use on all protected requests:

```http
Authorization: Bearer <token>
```

### Member login (mobile)

```http
POST /api/auth/member/login
{ "phone": "0912345678" }
```

**Response `data`:**

```json
{
  "token": "...",
  "member": { "id": 1, "name": "...", "phone": "...", "status": "active" }
}
```

Expired members receive `403`.

---

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/owner/login` | No | Owner JWT |
| POST | `/api/auth/member/login` | No | Member JWT |

### Plans

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/plans` | No | List plans |
| GET | `/api/plans/:id` | No | Get plan |
| POST | `/api/plans` | Yes | Create plan |
| PUT | `/api/plans/:id` | Yes | Update plan |
| DELETE | `/api/plans/:id` | Yes | Delete plan (409 if members assigned) |

**Create body:**

```json
{ "name": "Monthly Plan", "durationDays": 30, "price": "500.00" }
```

### Members

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/members` | Yes | List members (`?status=pending\|active\|expired`) |
| GET | `/api/members/pending` | Yes | Pending queue |
| GET | `/api/members/:id` | Yes | Get member |
| POST | `/api/members` | No | Register (status=pending) |
| PUT | `/api/members/:id` | Yes | Update member |
| PATCH | `/api/members/:id/confirm` | Yes | Confirm payment → activate |
| DELETE | `/api/members/:id` | Yes | Delete member + payments |

**Register body:**

```json
{ "name": "John Doe", "phone": "0912345678", "planId": 1, "fcmToken": "" }
```

**Confirm body:**

```json
{ "amount": "500.00", "methodLabel": "Cash" }
```

**Confirm response `data`:**

```json
{
  "member": { "id": 1, "status": "active", "startDate": "...", "endDate": "..." },
  "payment": { "id": 1, "memberId": 1, "amount": "500.00", "methodLabel": "Cash" }
}
```

### Payments

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/payments` | Yes | List (`?memberId=`) |
| GET | `/api/payments/:id` | Yes | Get payment |
| POST | `/api/payments` | Yes | Manual payment (active members only) |

### Expenses

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/expenses` | Yes | List expenses |
| GET | `/api/expenses/:id` | Yes | Get expense |
| POST | `/api/expenses` | Yes | Create expense |
| PUT | `/api/expenses/:id` | Yes | Update expense |
| DELETE | `/api/expenses/:id` | Yes | Delete expense |

**Create body:**

```json
{
  "amount": "250.00",
  "description": "Equipment maintenance",
  "category": "Maintenance",
  "date": "2026-07-17T00:00:00.000Z"
}
```

### Services

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/services` | No | List (`?activeOnly=true`) |
| GET | `/api/services/:id` | No | Get service |
| POST | `/api/services` | Yes | Create |
| PUT | `/api/services/:id` | Yes | Update |
| DELETE | `/api/services/:id` | Yes | Delete |

### Content

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/content` | No | List (`?type=manual\|quote`) |
| GET | `/api/content/daily-quote` | No | Today's quote |
| GET | `/api/content/:id` | No | Get content |
| POST | `/api/content` | Yes | Create |
| PUT | `/api/content/:id` | Yes | Update |
| DELETE | `/api/content/:id` | Yes | Delete |

### Notifications

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/notifications` | Yes | List scheduled |
| GET | `/api/notifications/:id` | Yes | Get |
| POST | `/api/notifications` | Yes | Schedule |
| PUT | `/api/notifications/:id` | Yes | Update |
| DELETE | `/api/notifications/:id` | Yes | Delete |

### Reports

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/reports/monthly?month=YYYY-MM` | Yes | Monthly summary |

**Response `data`:**

```json
{
  "month": "2026-07",
  "totalIncome": "5000.00",
  "totalExpenses": "1200.00",
  "netProfit": "3800.00",
  "paymentCount": 10,
  "expenseCount": 4
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Missing/invalid JWT |
| 403 | Forbidden (e.g. expired member login) |
| 404 | Not found |
| 409 | Conflict (duplicate phone, plan in use) |
| 500 | Internal server error |

---

## Entity Shapes

See `docs/frontend-handoff/entity-schemas.json` for sample JSON of every entity.

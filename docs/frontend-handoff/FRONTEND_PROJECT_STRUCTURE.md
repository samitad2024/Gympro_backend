# GymPro Admin Dashboard — React + Vite Structure

```
gympro-admin/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx              # React Router v6
│   │   └── providers.tsx           # QueryClient, AuthProvider, Theme
│   ├── api/
│   │   ├── client.ts               # axios/fetch + interceptors (Bearer token)
│   │   ├── types.ts                # ApiResponse<T>, entities from backend
│   │   └── endpoints/
│   │       ├── auth.api.ts
│   │       ├── plans.api.ts
│   │       ├── members.api.ts
│   │       ├── payments.api.ts
│   │       ├── expenses.api.ts
│   │       ├── services.api.ts
│   │       ├── content.api.ts
│   │       ├── notifications.api.ts
│   │       └── reports.api.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── useAuth.ts
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx   # KPI cards + monthly report chart
│   │   ├── members/
│   │   │   ├── MembersPage.tsx
│   │   │   ├── PendingMembersPage.tsx
│   │   │   ├── ConfirmPaymentModal.tsx
│   │   │   └── MemberForm.tsx
│   │   ├── plans/
│   │   │   ├── PlansPage.tsx
│   │   │   └── PlanForm.tsx
│   │   ├── payments/
│   │   │   └── PaymentsPage.tsx
│   │   ├── expenses/
│   │   │   ├── ExpensesPage.tsx
│   │   │   └── ExpenseForm.tsx
│   │   ├── services/
│   │   │   └── ServicesPage.tsx
│   │   ├── content/
│   │   │   └── ContentPage.tsx
│   │   └── notifications/
│   │       └── NotificationsPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Sidebar + header
│   │   │   ├── Sidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── ui/                     # Button, Table, Modal, Input, Badge
│   ├── hooks/
│   │   └── useApiError.ts
│   ├── lib/
│   │   ├── format.ts               # currency, dates
│   │   └── storage.ts              # token localStorage
│   ├── styles/
│   │   └── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Sidebar navigation

| Route | Page | Primary API |
|-------|------|-------------|
| `/login` | Login | POST /api/auth/owner/login |
| `/` | Dashboard | GET /api/reports/monthly, GET /api/members |
| `/members` | All members | GET /api/members |
| `/members/pending` | Pending queue | GET /api/members/pending, PATCH confirm |
| `/plans` | Plans CRUD | /api/plans |
| `/payments` | Payments | GET /api/payments |
| `/expenses` | Expenses CRUD | /api/expenses |
| `/services` | Services CRUD | /api/services |
| `/content` | Manuals & quotes | /api/content |
| `/notifications` | Push schedule | /api/notifications |

## Tech stack (recommended)

- React 18 + TypeScript + Vite
- React Router v6
- TanStack Query (React Query) for server state
- Axios or fetch with interceptors
- Tailwind CSS + shadcn/ui (or MUI)
- React Hook Form + Zod (mirror backend validation)
- Recharts for dashboard charts

## API client pattern

```typescript
// All responses: { success, message?, data?, errors? }
export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data?: T;
  errors?: unknown;
};

// Interceptor: attach Authorization: Bearer <token>
// On 401: clear token, redirect /login
```

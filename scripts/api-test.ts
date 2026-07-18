/**
 * End-to-end API smoke test — run against a live server.
 * Usage: npm run test:api
 * Requires: server running on BASE_URL (default http://localhost:4000)
 */
import "dotenv/config";

const BASE = process.env.API_BASE_URL ?? "http://localhost:4000";
const ts = Date.now();
const phone = `09${String(ts).slice(-8)}`;

type Result = { name: string; ok: boolean; detail?: string };

const results: Result[] = [];
const ids: Record<string, number> = {};
let ownerToken = "";

async function req(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<{ status: number; json: Record<string, unknown> }> {
  const headers: Record<string, string> = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (auth && ownerToken) {
    headers.Authorization = `Bearer ${ownerToken}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    json = {};
  }
  return { status: res.status, json };
}

function assert(name: string, condition: boolean, detail?: string) {
  results.push({ name, ok: condition, detail });
  const icon = condition ? "PASS" : "FAIL";
  console.log(`  [${icon}] ${name}${detail ? ` — ${detail}` : ""}`);
}

async function run() {
  console.log(`\nGymPro API smoke test → ${BASE}\n`);

  // ── Health & OpenAPI ───────────────────────────────────
  console.log("── Infrastructure ──");
  let r = await req("GET", "/health");
  assert("GET /health", r.status === 200 && r.json.success === true);

  r = await req("GET", "/api-docs.json");
  assert(
    "GET /api-docs.json",
    r.status === 200 && typeof (r.json as { openapi?: string }).openapi === "string"
  );

  // ── Auth (owner token required for dashboard routes) ───
  console.log("── Auth ──");
  r = await req("POST", "/api/auth/owner/login", {
    email: process.env.OWNER_EMAIL ?? "admin@gmail.com",
    password: process.env.OWNER_PASSWORD ?? "admin123",
  });
  assert(
    "POST /api/auth/owner/login",
    r.status === 200 && !!(r.json.data as { token?: string })?.token
  );
  ownerToken = (r.json.data as { token: string }).token;

  // ── Plans ──────────────────────────────────────────────
  console.log("── Plans ──");
  r = await req(
    "POST",
    "/api/plans",
    {
      name: `Test Plan ${ts}`,
      durationDays: 30,
      price: "750.00",
    },
    true
  );
  assert("POST /api/plans", r.status === 201 && r.json.success === true);
  ids.plan = (r.json.data as { id: number }).id;

  r = await req("GET", "/api/plans");
  assert("GET /api/plans (public)", r.status === 200 && Array.isArray(r.json.data));

  r = await req("GET", `/api/plans/${ids.plan}`);
  assert("GET /api/plans/:id (public)", r.status === 200);

  r = await req("PUT", `/api/plans/${ids.plan}`, { price: "800.00" }, true);
  assert("PUT /api/plans/:id", r.status === 200);

  // ── Members ────────────────────────────────────────────
  console.log("── Members ──");
  r = await req("POST", "/api/members", {
    name: "Auto Test User",
    phone,
    planId: ids.plan,
  });
  assert("POST /api/members (public)", r.status === 201);
  ids.member = (r.json.data as { id: number; status: string }).id;
  assert(
    "POST /api/members → pending",
    (r.json.data as { status: string }).status === "pending"
  );

  r = await req("GET", "/api/members", undefined, true);
  assert("GET /api/members", r.status === 200);

  r = await req("GET", "/api/members?status=pending", undefined, true);
  assert("GET /api/members?status=pending", r.status === 200);

  r = await req("GET", "/api/members/pending", undefined, true);
  assert("GET /api/members/pending", r.status === 200);

  r = await req("GET", `/api/members/${ids.member}`, undefined, true);
  assert("GET /api/members/:id", r.status === 200);

  r = await req(
    "PATCH",
    `/api/members/${ids.member}/confirm`,
    {
      amount: "800.00",
      methodLabel: "Cash",
    },
    true
  );
  assert("PATCH /api/members/:id/confirm", r.status === 200);
  const confirmed = r.json.data as {
    member: { status: string; endDate: string | null };
    payment: { id: number };
  };
  assert(
    "confirm → active + payment",
    confirmed?.member?.status === "active" && confirmed?.member?.endDate != null
  );
  ids.payment = confirmed?.payment?.id;

  r = await req("GET", "/api/members?status=active", undefined, true);
  assert("GET /api/members?status=active", r.status === 200);

  // ── Payments ───────────────────────────────────────────
  console.log("── Payments ──");
  r = await req("GET", "/api/payments", undefined, true);
  assert("GET /api/payments", r.status === 200);

  r = await req("GET", `/api/payments?memberId=${ids.member}`, undefined, true);
  assert("GET /api/payments?memberId=", r.status === 200);

  r = await req("GET", `/api/payments/${ids.payment}`, undefined, true);
  assert("GET /api/payments/:id", r.status === 200);

  r = await req(
    "POST",
    "/api/payments",
    {
      memberId: ids.member,
      amount: "100.00",
      methodLabel: "Bank Transfer",
    },
    true
  );
  assert("POST /api/payments (manual)", r.status === 201);

  // ── Expenses ───────────────────────────────────────────
  console.log("── Expenses ──");
  r = await req(
    "POST",
    "/api/expenses",
    {
      amount: "250.00",
      description: "Equipment maintenance",
      category: "Maintenance",
      date: new Date().toISOString(),
    },
    true
  );
  assert("POST /api/expenses", r.status === 201);
  ids.expense = (r.json.data as { id: number }).id;

  r = await req("GET", "/api/expenses", undefined, true);
  assert("GET /api/expenses", r.status === 200);

  r = await req("GET", `/api/expenses/${ids.expense}`, undefined, true);
  assert("GET /api/expenses/:id", r.status === 200);

  r = await req("PUT", `/api/expenses/${ids.expense}`, { amount: "275.00" }, true);
  assert("PUT /api/expenses/:id", r.status === 200);

  // ── Services ───────────────────────────────────────────
  console.log("── Services ──");
  r = await req(
    "POST",
    "/api/services",
    {
      name: "Personal Training",
      description: "1-on-1 coaching",
      isActive: true,
    },
    true
  );
  assert("POST /api/services", r.status === 201);
  ids.service = (r.json.data as { id: number }).id;

  r = await req("GET", "/api/services");
  assert("GET /api/services (public)", r.status === 200);

  r = await req("GET", "/api/services?activeOnly=true");
  assert("GET /api/services?activeOnly=true (public)", r.status === 200);

  r = await req("GET", `/api/services/${ids.service}`);
  assert("GET /api/services/:id (public)", r.status === 200);

  r = await req(
    "PUT",
    `/api/services/${ids.service}`,
    { description: "Updated coaching" },
    true
  );
  assert("PUT /api/services/:id", r.status === 200);

  // ── Content ───────────────────────────────────────────
  console.log("── Content ──");
  r = await req(
    "POST",
    "/api/content",
    {
      type: "manual",
      title: "Chest Workout",
      body: "Bench press 3x10, push-ups 3x15",
    },
    true
  );
  assert("POST /api/content (manual)", r.status === 201);
  ids.manual = (r.json.data as { id: number }).id;

  r = await req(
    "POST",
    "/api/content",
    {
      type: "quote",
      title: "Daily Motivation",
      body: "No pain, no gain.",
    },
    true
  );
  assert("POST /api/content (quote)", r.status === 201);
  ids.quote = (r.json.data as { id: number }).id;

  r = await req("GET", "/api/content");
  assert("GET /api/content (public)", r.status === 200);

  r = await req("GET", "/api/content?type=manual");
  assert("GET /api/content?type=manual (public)", r.status === 200);

  r = await req("GET", "/api/content/daily-quote");
  assert("GET /api/content/daily-quote (public)", r.status === 200);

  r = await req("GET", `/api/content/${ids.manual}`);
  assert("GET /api/content/:id (public)", r.status === 200);

  // ── Notifications ──────────────────────────────────────
  console.log("── Notifications ──");
  const scheduledAt = new Date(Date.now() + 86400000).toISOString();
  r = await req(
    "POST",
    "/api/notifications",
    {
      title: "Weekly Reminder",
      body: "Don't skip leg day!",
      scheduledAt,
      isActive: true,
    },
    true
  );
  assert("POST /api/notifications", r.status === 201);
  ids.notification = (r.json.data as { id: number }).id;

  r = await req("GET", "/api/notifications", undefined, true);
  assert("GET /api/notifications", r.status === 200);

  r = await req("GET", `/api/notifications/${ids.notification}`, undefined, true);
  assert("GET /api/notifications/:id", r.status === 200);

  r = await req(
    "PUT",
    `/api/notifications/${ids.notification}`,
    { title: "Updated Reminder" },
    true
  );
  assert("PUT /api/notifications/:id", r.status === 200);

  // ── Reports ────────────────────────────────────────────
  console.log("── Reports ──");
  const month = new Date().toISOString().slice(0, 7);
  r = await req("GET", `/api/reports/monthly?month=${month}`, undefined, true);
  assert("GET /api/reports/monthly", r.status === 200);
  const report = r.json.data as { totalIncome: string; totalExpenses: string };
  assert(
    "reports → has income data",
    parseFloat(report?.totalIncome ?? "0") > 0,
    `income=${report?.totalIncome}`
  );

  r = await req("POST", "/api/auth/member/login", { phone });
  assert(
    "POST /api/auth/member/login",
    r.status === 200 && !!(r.json.data as { token?: string })?.token
  );

  // ── Auth guard ─────────────────────────────────────────
  r = await req("GET", "/api/payments");
  assert("GET /api/payments without token → 401", r.status === 401);

  // ── Cleanup (DELETE tests) ─────────────────────────────
  console.log("── Cleanup ──");
  r = await req("DELETE", `/api/notifications/${ids.notification}`, undefined, true);
  assert("DELETE /api/notifications/:id", r.status === 200);

  r = await req("DELETE", `/api/content/${ids.manual}`, undefined, true);
  assert("DELETE /api/content/:id (manual)", r.status === 200);

  r = await req("DELETE", `/api/content/${ids.quote}`, undefined, true);
  assert("DELETE /api/content/:id (quote)", r.status === 200);

  r = await req("DELETE", `/api/services/${ids.service}`, undefined, true);
  assert("DELETE /api/services/:id", r.status === 200);

  r = await req("DELETE", `/api/expenses/${ids.expense}`, undefined, true);
  assert("DELETE /api/expenses/:id", r.status === 200);

  // ── Summary ────────────────────────────────────────────
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${"═".repeat(50)}`);
  console.log(`Results: ${passed}/${results.length} passed`);
  if (failed.length) {
    console.log("\nFailed:");
    failed.forEach((f) => console.log(`  ✗ ${f.name}${f.detail ? ` — ${f.detail}` : ""}`));
    process.exit(1);
  }
  console.log("All API endpoints passed.\n");
}

run().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});

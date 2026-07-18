# Deployment Guide

Deploy GymPro Backend to **Render** (recommended) or any Node.js host with PostgreSQL.

---

## Prerequisites

- GitHub repo pushed to `main`
- Render account (https://render.com)

---

## Step 1 — PostgreSQL Database

1. Render Dashboard → **New** → **PostgreSQL**
2. Name: `gympro-db`
3. Copy the **Internal Database URL** (for web service on Render)

Alternatives: Neon, Supabase, Railway.

---

## Step 2 — Web Service

1. **New** → **Web Service**
2. Connect repo: `Gympro_backend`
3. Configure:

| Setting | Value |
|---------|-------|
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Release Command | `npm run db:migrate` |

---

## Step 3 — Environment Variables

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-random-secret-at-least-32-characters-long
OWNER_EMAIL=admin@gmail.com
OWNER_PASSWORD=your-strong-production-password
CORS_ORIGIN=https://your-dashboard.onrender.com
API_PUBLIC_URL=https://gympro-backend.onrender.com
```

> Do **not** set `PORT` — Render assigns it automatically.

---

## Step 4 — Deploy & Verify

After deploy completes:

| Check | URL |
|-------|-----|
| Health | `https://<app>.onrender.com/health` |
| Swagger | `https://<app>.onrender.com/api-docs` |
| OpenAPI | `https://<app>.onrender.com/api-docs.json` |

Test login in Swagger, then authorize with the token.

---

## Step 5 — Connect Frontend

```env
VITE_API_BASE_URL=https://gympro-backend.onrender.com
```

Update `CORS_ORIGIN` to include your frontend URL.

---

## Manual Migration

If release command fails:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate
```

Or use Render **Shell** → `npm run db:migrate`.

---

## Production Checklist

- [ ] `JWT_SECRET` is 32+ random characters
- [ ] `OWNER_PASSWORD` changed from default
- [ ] `CORS_ORIGIN` set to frontend URL(s)
- [ ] `API_PUBLIC_URL` matches public API URL
- [ ] Migrations applied successfully
- [ ] `/health` returns 200
- [ ] Swagger login + authorized API calls work
- [ ] `npm run test:api` passes against production URL:

```bash
API_BASE_URL=https://your-app.onrender.com npm run test:api
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally, check logs |
| 500 on startup | Verify `DATABASE_URL`, run migrations |
| CORS errors | Add frontend URL to `CORS_ORIGIN` |
| Empty Swagger spec | Set `NODE_ENV=production`, ensure `dist/` routes exist |
| Free tier cold start | First request after idle may take ~30s |

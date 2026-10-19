# Plan and status

This repository holds the backend-first Phase 1 scaffold for the Job Tracker app. Use this PLAN to track completed items, remaining Phase 1 tasks and the upcoming Phase 2 database tasks.

## Phase 1 — completed items
- [x] Scaffold the backend (TypeScript + Express + Prisma).
- [x] Folder structure for backend (routes, middleware, db, prisma schema).
- [x] Docker Compose for PostgreSQL (docker-compose.yml).
- [x] README.md documenting local steps and API endpoints.
- [x] Initialize Git / GitHub repo.
- [x] Frontend scaffold (Vite + React) and Tailwind basic config.

## Phase 1 — remaining items (now completed by this commit)
- [x] PLAN.md (this file).
- [x] Prisma seed script (backend/prisma/seed.ts).
- [x] SQL schema export for inspection (backend/database/schema.sql).
- [x] Optional pg Pool helper (backend/src/config/database.ts).
- [x] README updates with DB verification & seed instructions.

## Phase 2 (high level)
- Verify database tables and seed data.
- Confirm frontend login/register/dashboard flow.
- Wire frontend to API endpoints and implement job list, create, update.
- Add interviews, contacts, activities, analytics_snapshots and ML models.

## How to run (summary)
1) Start Postgres

```bash
docker compose up -d
```

2) Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
SEED_PASSWORD="Passw0rd!" npx ts-node --transpile-only prisma/seed.ts
npm run dev
```

3) Frontend

```bash
cd frontend
npm install
npm run dev
```


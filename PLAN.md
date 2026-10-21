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

## Phase 2 — roadmap for the next product milestones

### 1) MVP UI flow
- [ ] Verify login/register flow works end-to-end with the backend.
- [ ] Add redirect logic and successful auth onboarding.
- [ ] Add logout action and session cleanup.
- [ ] Add dashboard header, nav, and user context.
- [ ] Add consistent loading, empty, and error states.
- [ ] Add a simple Add Job flow from the dashboard.
- [ ] Add basic job editing and deletion UX.

### 2) Backend integration
- [ ] Centralize auth and job API calls in service modules.
- [ ] Add typed request/response models for frontend consumption.
- [ ] Implement consistent API error handling for 400/401/500 responses.
- [ ] Use React Query invalidation after create/update/delete actions.
- [ ] Confirm cookie-based auth works across frontend/backend origins.

### 3) Data model expansion
- [ ] Expand Job model with status, source, url, notes, and timestamps.
- [ ] Add Contact model for recruiters and hiring managers.
- [ ] Add Interview model with scheduling and outcome tracking.
- [ ] Add Activity/Timeline model for application updates.
- [ ] Add JobStatusHistory to capture workflow transitions.

### 4) Job management UX
- [ ] Add search and filtering by title/company/status.
- [ ] Add sorting for recency, company, and priority.
- [ ] Add status chips: Applied, Interviewing, Offer, Rejected, Archived.
- [ ] Add job cards with status, updated date, and next action.
- [ ] Add job detail pane or modal for editing.
- [ ] Add quick notes and follow-up reminders.

### 5) Interviews, contacts, and workflow features beyond the core job tracker
- [ ] Add interview scheduling and preparation notes.
- [ ] Add recruiter/hiring manager contact management.
- [ ] Add activity timeline for each job.
- [ ] Add pipeline analytics: response rate, time-to-interview, source effectiveness.
- [ ] Add a future ML layer for role-fit scoring and resume recommendations.

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

## Recommended product sequence
The highest-value order for this app is:
1. Auth + job CRUD
2. Job states + filters
3. Interview tracking
4. Contact management
5. Activity timeline
6. Analytics
7. ML recommendations last

This keeps the app useful while avoiding premature complexity.

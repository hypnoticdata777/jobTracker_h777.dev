# Job Tracker (h777.dev)

This is the backend-first Phase 1 scaffold for the Job Tracker app.

## Stack
- TypeScript + Express + Prisma + PostgreSQL
- JWT auth with httpOnly cookies
- Argon2id password hashing
- Zod request validation

## Purpose
This repository currently contains the backend foundation for an authenticated job tracker. The frontend will be added in a later phase. The database is PostgreSQL running locally via Docker Compose, while Node runs natively on the machine for fast local development.

## Local development

### 1) Start Postgres

```bash
docker compose up -d
```

### 2) Install backend dependencies

```bash
cd backend
cp .env.example .env
npm install
```

### 3) Run the Prisma migration

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4) Start backend dev server

```bash
cd backend
npm run dev
```

The API listens on `http://localhost:4000` by default.

## Environment variables

Copy the backend `.env.example` and adjust as needed.

```env
DATABASE_URL="postgresql://jobtracker:password@localhost:5432/jobtracker_dev"
JWT_SECRET="replace_with_a_strong_secret"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_ORIGIN="http://localhost:5173"
```

## API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Jobs
- `GET /api/jobs`
- `POST /api/jobs`

## Verification

### Register

```bash
curl -i -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Passw0rd!","name":"Alice"}'
```

### Login

```bash
curl -i -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"alice@example.com","password":"Passw0rd!"}'
```

### Current user (protected)

```bash
curl -i -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

### Create a job (protected)

```bash
curl -i -X POST http://localhost:4000/api/jobs \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Frontend Engineer","company":"Acme","location":"Remote","description":"Build product UI","url":"https://example.com/jobs/123"}'
```

## Notes
- Password hashing uses `argon2id` via the `argon2` package.
- If `argon2` fails to install, the fallback is bcrypt with a note in the README and a code comment.
- Frontend and Python ML service are intentionally separate. The backend exposes HTTP endpoints for both and will be extended later.

## Phase workflow

Each feature branch follows this workflow:
1. Write docs/features/<feature-name>.md before code.
2. Implement code.
3. Run migration and verify flow locally.
4. Open a draft PR, link the feature doc, and include the mandatory checklist item in the PR template.

## PR checklist

The repo PR template includes the required item:
- [ ] Story, pseudocode, flowchart and hand trace written before code.

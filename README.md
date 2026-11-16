# Job Tracker (h777.dev)

A personal job-search tracker: record every role I apply to, move it through a
pipeline (Saved → Applied → Interviewing → Offer / Rejected), and see at a
glance where everything stands.

## Status

Milestone M0 (green baseline) is complete: a fresh clone installs, builds,
migrates, seeds and runs. The app can register, log in, list jobs and add a
job. It does not track status yet; that is M1. See [PLAN.md](PLAN.md).

## MVP 1 is done when

- [x] A fresh clone installs, builds, migrates and seeds with the commands below.
- [x] A user can register, log in, log out, add a job and see their own jobs.
- [ ] A job has a status, and the user can change it.
- [ ] A user can edit and delete a job.
- [ ] The list can be grouped or filtered by status.
- [ ] API tests cover auth, validation and isolation between users, and run in CI.
- [ ] The app is deployed at a public URL.

## Stack

- Backend: TypeScript, Express 4, Prisma 5, PostgreSQL 15
- Frontend: Vite, React 18, React Query 4, Tailwind
- Auth: JWT in an httpOnly cookie, Argon2 password hashing
- Validation: Zod

## Local setup

Requires Node 24 (`nvm use`), npm, and Docker for the database.

```bash
npm ci
```

```bash
cp backend/.env.example backend/.env
```

```bash
npm run db:up
```

```bash
npm run db:deploy
```

```bash
npm run db:seed
```

```bash
npm run dev
```

The frontend runs on http://localhost:5173 and the API on
http://localhost:4000. Log in with the seeded account `demo@example.com` /
`Passw0rd!` (override the password with `SEED_PASSWORD` when seeding).

## Commands

Run all of these from the repository root.

| Command | What it does |
|---|---|
| `npm run dev` | Start the API and the frontend together |
| `npm run build` | Production build of both workspaces |
| `npm run typecheck` | Typecheck both workspaces without emitting files |
| `npm run db:up` | Start PostgreSQL in Docker |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:migrate` | Create a new migration after editing `schema.prisma` |
| `npm run db:seed` | Reset the demo user and its sample jobs |

## Environment variables

Set in `backend/.env` (see `backend/.env.example`).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign session tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `PORT` | API port, default `4000` |
| `FRONTEND_ORIGIN` | Origin allowed by CORS, default `http://localhost:5173` |

## API routes

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | no | Liveness check |
| POST | `/api/auth/register` | no | Create an account |
| POST | `/api/auth/login` | no | Log in and set the session cookie |
| POST | `/api/auth/logout` | no | Clear the session cookie |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/jobs` | yes | List the current user's jobs |
| POST | `/api/jobs` | yes | Create a job |

## Project docs

- [PLAN.md](PLAN.md): milestones and what is deliberately not built yet
- [docs/features](docs/features): per-feature stories and flowcharts
- [docs/setup](docs/setup) and [docs/sessions](docs/sessions): record of the installation stabilization work

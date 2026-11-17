# Job Tracker (h777.dev)

A personal job-search tracker: record every role I apply to, move it through a
pipeline (Saved → Applied → Interviewing → Offer / Rejected), and see at a
glance where everything stands.

## Status

M0 (green baseline), M0.5 (deployed on Vercel with Neon) and M1 (status, edit
and delete) are complete. Next is M2: tests, CI and error handling. See
[PLAN.md](PLAN.md).

## MVP 1 is done when

- [x] A fresh clone installs, builds, migrates and seeds with the commands below.
- [x] A user can register, log in, log out, add a job and see their own jobs.
- [x] A job has a status, and the user can change it.
- [x] A user can edit and delete a job.
- [ ] The list can be grouped or filtered by status.
- [ ] API tests cover auth, validation and isolation between users, and run in CI.
- [x] The app is deployed at a public URL.

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

Open http://localhost:5173. Log in with the seeded account `demo@example.com` /
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
| `npm run vercel-build` | What Vercel runs: apply migrations (production deployments only), then build |

## Environment variables

Set in `backend/.env` (see `backend/.env.example`).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by the running app (pooled in production) |
| `DATABASE_URL_UNPOOLED` | Direct PostgreSQL connection used by migrations; same as `DATABASE_URL` locally |
| `JWT_SECRET` | Secret used to sign session tokens, at least 16 characters. The API refuses to start without it |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d` |
| `PORT` | Local API port, default `4000` |

## How requests are routed

The browser only ever calls relative `/api/...` paths, so the page and the API
share one origin and the session cookie needs no cross-site configuration.

- **Local:** Vite serves the frontend on port 5173 and proxies `/api` to the
  API on port 4000 (`frontend/vite.config.ts`).
- **Vercel:** the built frontend is served as static files and `/api/*` is
  rewritten to one function, `api/index.ts`, which runs the same Express app
  (`vercel.json`).

## Deployment (Vercel + Neon)

One Vercel project, with a Neon PostgreSQL database attached through the
Vercel Marketplace. The Neon integration provides `DATABASE_URL` and
`DATABASE_URL_UNPOOLED`; add `JWT_SECRET` by hand. Each deployment runs
`npm run vercel-build`. Production deployments apply pending migrations and
then build; preview deployments only build, because the database is connected
to Production alone.

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
| PATCH | `/api/jobs/:id` | yes | Update any fields of one of the current user's jobs |
| DELETE | `/api/jobs/:id` | yes | Delete one of the current user's jobs |

A job's `status` is one of `SAVED`, `APPLIED`, `INTERVIEWING`, `OFFER`,
`REJECTED` or `ARCHIVED`. A job that belongs to another user answers 404.

## Project docs

- [PLAN.md](PLAN.md): milestones and what is deliberately not built yet
- [docs/features](docs/features): per-feature stories and flowcharts
- [docs/setup](docs/setup) and [docs/sessions](docs/sessions): record of the installation stabilization work

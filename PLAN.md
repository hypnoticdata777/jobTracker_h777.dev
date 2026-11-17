# Plan

Goal and the MVP 1 checklist live in [README.md](README.md). This file tracks
the order of work. Each milestone has a "works when" test; it is not done
until that test passes.

## M0 — Green baseline (done)

- [x] Both production builds pass.
- [x] Initial migration and repeatable seed committed.
- [x] Unused code and dependencies removed.
- [x] Root `dev`, `build`, `typecheck` and database scripts.

Works when: on a fresh clone, `npm ci && npm run build` passes, and
`npm run db:deploy && npm run db:seed` gives a demo user who can log in.

## M0.5 — Deployed skeleton (done)

- [x] Split `backend/src/index.ts` into `app.ts` (exports the app) and `server.ts` (listens).
- [x] Frontend calls relative `/api`; Vite dev proxy forwards it to the API.
- [x] Hosted PostgreSQL with a pooled connection string.
- [x] Vercel configuration for one project serving the frontend and the API on the same origin.
- [x] First deployment succeeds.
- [x] Fail at startup when `JWT_SECRET` is missing.

Works when: register and login succeed on the public URL.

## M1 — It is a tracker (done)

- [x] One `Job` model with a `status` enum, `notes`, `appliedAt`, `updatedAt`
      and `statusChangedAt`; the unused `Application` table is dropped.
- [x] `PATCH` and `DELETE` routes that always filter by the owner.
- [x] Status control on each card, edit form, delete.
- [x] Form and action errors are shown to the user.
- [x] URLs limited to `http(s)`, text fields have length limits.

Works when: a job can be moved from Saved to Offer and deleted, and a second
user cannot read or change it.

## M2 — Trust

- [ ] API integration tests (auth, validation, isolation between users).
- [ ] CI: install, typecheck, build, test.
- [ ] Error handling: 4xx for bad input, generic 500 body, request logging.
- [ ] Input hardening: lowercase emails.
- [ ] UI: link login and register, fix blank-name register.

Works when: a pull request with a broken build or a failing test goes red.

## M3 — Demo polish

- [ ] Group or filter by status, with counts.
- [ ] Realistic seed data and a demo login.
- [ ] README screenshot.

Works when: a stranger completes the MVP flow with no help.

## Not yet

| Item | Revisit when |
|---|---|
| Contacts, interviews, activity timeline, full status history | After two weeks of daily use show the need |
| Analytics and ML recommendations | There are 50+ real rows |
| Shared frontend/backend schema package | The frontend validates with Zod |
| OAuth, password reset, refresh tokens | There are real users besides the author |
| Drag-and-drop board | After the expo |

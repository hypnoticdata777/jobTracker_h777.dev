# Installation stabilization plan

## Goal
Make a fresh checkout installable, buildable, and runnable before expanding product features. Complete phases in order; an installation passing does not establish that the app works end to end.

## Phase 1 — reproducible dependency installation (completed)
- Repair the backend package manifest (currently YAML inside a JSON file).
- Resolve dependency declarations against imports and existing API usage.
- Keep React Query v4 and use its supported mutation loading property.
- Add a root npm lockfile and declare the validated Node/npm baseline.
- Verify a fresh `npm ci` and Prisma client generation without a running database.
- Record findings, commands, and remaining risks in a session log.

Exit criteria met: all workspace manifests parse, clean installation succeeds using the lockfile, and Prisma client generation succeeds. See the [session record](../sessions/2026-11-12-installation-phase-1.md) for evidence.

## Phase 2 — build and developer commands
- Run backend and frontend production builds and repair compiler/configuration failures.
- Add clear root development/build/typecheck commands and prevent generated output entering Git.
- Verify the shared package exports and remove or repair unused scaffolding.

Exit criteria: both production builds pass from the documented setup.

## Phase 3 — database and runtime setup
- Add an initial committed migration and a repeatable seed script.
- Align environment examples and documentation with the actual files and commands.
- Start PostgreSQL and the API; verify migrations, seed data, and health endpoint.

Exit criteria: a fresh database can be initialized and the API starts using documented commands.

## Phase 4 — end-to-end MVP verification
- Start the frontend and verify registration, login, session restoration, add/list jobs, and logout.
- Check invalid input, unauthenticated access, and isolation between users.
- Repair blocking auth/cache/error handling issues and document verified behavior.

Exit criteria: the core user journey passes in a browser with meaningful API checks.

## Phase 1 implementation notes (written before code)

User story: As a contributor, I can install every workspace from a clean checkout using a single lockfile.

Pseudocode:
1. Parse workspace manifests and compare dependencies to imports.
2. Repair malformed manifests and missing/incompatible declarations.
3. Install from the root to resolve a single workspace dependency graph.
4. Generate the Prisma client; retry installation with `npm ci`.
5. Record actual results and defer build/runtime work to its phase.

Flow: inspect → repair declarations → install → generate client → clean install → document.

Hand trace:
- Before: backend manifest starts with `name:` → JSON parsing fails → workspace install cannot proceed.
- After: backend manifest is a JSON object → npm resolves all three workspaces → lockfile records versions → `npm ci` installs that graph.
- Failure path: unavailable package version → npm reports resolution failure → correct only the incompatible declaration and repeat validation.

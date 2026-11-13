# Session: installation stabilization, phase 1

Date: 2026-11-12 (America/Mexico_City)

## Request and scope
Explore the repository, plan installation fixes before implementation, and complete phase one. Plan: `../setup/installation-plan.md`.

Baseline: commit c62c2aa on main; clean working tree. Environment: Node 24.22.1, npm 11.9.0.

## Initial findings
- Backend package.json is YAML-style text and fails JSON parsing.
- Vite config imports @vitejs/plugin-react without declaring it.
- Dashboard uses React Query v5's isPending with a v4 dependency.
- pg helper imports an undeclared pg dependency.
- No root lockfile exists.
- README and PLAN reference missing seed/SQL files; database and runtime repairs belong to later phases.

## Execution record
Phase one completed.

Changes:
- Converted backend manifest to JSON, preserving dev/build/start and Prisma scripts.
- Corrected unavailable ranges: cookie-parser ^1.9.1 → ^1.4.7; @types/cookie-parser ^1.9.1 → ^1.4.8; ts-node-dev ^2.1.0 → ^2.0.0; Tailwind ^3.5.3 → ^3.4.17.
- Added @vitejs/plugin-react ^4.3.4, pg ^8.13.1, and @types/pg ^8.11.10.
- Aligned @types/express to ^4.17.21 for the Express 4 runtime.
- Replaced three dashboard mutation isPending references with React Query v4 isLoading.
- Added root package-lock.json, .nvmrc, Node/npm engine ranges, and packageManager metadata. Node 24 is the validated baseline, not a claim that all older versions fail.
- Linked the plan/session from README and marked historical PLAN checkboxes as unverified.

Verification:
- JSON parsing: all four package manifests pass.
- Initial install exposed ETARGET for cookie-parser types and then cookie-parser; corrected both declarations and retried.
- `npm install --no-audit --no-fund --cache /tmp/jobtracker-npm-cache`: passed.
- `npm ci --no-audit --no-fund --cache /tmp/jobtracker-npm-cache`: passed, installed 384 packages using the root lockfile.
- `npm run prisma:generate --workspace backend`: passed; Prisma Client 5.22.0 generated without a running database.
- `npm ls --depth=0`: passed with all three workspaces resolved and no dependency errors.
- `git diff --check`: passed.

The temporary cache path is environment-specific; contributors can use plain `npm ci`. No secrets or environment files were added. The user subsequently authorized committing and pushing phase one to origin/main. The commit includes this plan, session record, and installation fixes.

## Remaining work and limitations
- Production builds, database initialization, and browser journeys have not been verified; proceed with phase two next.
- Installation emits transitive deprecation warnings for inflight, glob 7, and rimraf 2. Dependency modernization remains future work; no security audit was performed in this phase.
- Shared package entrypoints reference missing src/index.ts/dist/index.js; resolve in phase two before consuming the package by name.
- Missing migrations/seed and stale legacy setup instructions remain phase three work.

## Handoff
From the repository root, run backend and frontend build commands, record actual compiler failures, and repair only those required for phase two. Do not interpret successful installation as a verified working MVP.

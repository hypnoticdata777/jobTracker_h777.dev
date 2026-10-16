# Job Tracker (h777.dev)

This repository is a 60-day build of a Job Tracker web app (React + Node + PostgreSQL). It uses TypeScript across frontend and backend, Prisma for DB modeling, and Docker Compose for a local Postgres service.

This initial commit includes a minimal backend scaffold, Prisma schema, a docker-compose for Postgres, and guidance to scaffold the frontend using Vite.

Quick start (developer machine):

1. Start Postgres via Docker Compose:

   docker compose up -d

2. Install backend dependencies and run the dev server (backend/):

   cd backend
   npm install
   cp .env.example .env
   # edit DATABASE_URL in .env if needed
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev

3. Scaffold the frontend (from repo root) using Vite's template:

   npm create vite@latest frontend -- --template react-ts
   cd frontend
   npm install
   npm run dev

If you want, I can push a full Vite scaffold into the repo as well. Say the word and I'll add the frontend files.

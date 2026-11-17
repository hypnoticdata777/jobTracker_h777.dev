import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

// Creates one demo user with a few sample jobs.
// Safe to run repeatedly: the user is upserted and their jobs are replaced.
const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'Passw0rd!';

const sampleJobs = [
  {
    title: 'Frontend Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    description: 'Build product UI in React and TypeScript.',
    url: 'https://example.com/jobs/frontend-engineer',
  },
  {
    title: 'Backend Developer',
    company: 'Globex',
    location: 'Mexico City',
    description: 'Node.js APIs backed by PostgreSQL.',
    url: 'https://example.com/jobs/backend-developer',
  },
  {
    title: 'Full Stack Engineer',
    company: 'Initech',
    location: 'Hybrid',
    description: null,
    url: null,
  },
];

async function main() {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash, name: 'Demo User' },
    create: { email: DEMO_EMAIL, passwordHash, name: 'Demo User' },
  });

  await prisma.job.deleteMany({ where: { createdBy: user.id } });
  await prisma.job.createMany({
    data: sampleJobs.map((job) => ({ ...job, createdBy: user.id })),
  });

  console.log(`Seeded ${DEMO_EMAIL} with ${sampleJobs.length} jobs`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

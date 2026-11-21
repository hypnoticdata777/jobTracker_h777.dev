import { PrismaClient, type Prisma } from '@prisma/client';
import argon2 from 'argon2';

// Crea o actualiza una cuenta de demostración y reemplaza sus vacantes de ejemplo.
const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = process.env.SEED_PASSWORD ?? 'Passw0rd!';

const sampleJobs: Omit<Prisma.JobCreateManyInput, 'createdBy'>[] = [
  {
    title: 'Desarrollador de interfaces',
    company: 'Acme Corp',
    location: 'Remoto',
    description: 'Desarrollar interfaces con React y TypeScript.',
    url: 'https://example.com/jobs/frontend-engineer',
    status: 'INTERVIEWING',
    appliedAt: new Date('2026-11-03T00:00:00.000Z'),
    notes: 'Entrevista técnica programada para la próxima semana.',
  },
  {
    title: 'Desarrollador de servidor',
    company: 'Globex',
    location: 'Ciudad de México',
    description: 'Desarrollar API con Node.js y PostgreSQL.',
    url: 'https://example.com/jobs/backend-developer',
    status: 'APPLIED',
    appliedAt: new Date('2026-11-10T00:00:00.000Z'),
  },
  {
    title: 'Desarrollador de aplicaciones web',
    company: 'Initech',
    location: 'Híbrido',
    status: 'SAVED',
  },
];

async function main() {
  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash, name: 'Usuario de demostración' },
    create: { email: DEMO_EMAIL, passwordHash, name: 'Usuario de demostración' },
  });

  await prisma.job.deleteMany({ where: { createdBy: user.id } });
  await prisma.job.createMany({
    data: sampleJobs.map((job) => ({ ...job, createdBy: user.id })),
  });

  console.log(`Cuenta ${DEMO_EMAIL} preparada con ${sampleJobs.length} vacantes de ejemplo`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

import { Router, type Request, type Response } from 'express';
import { createJobSchema } from '../lib/validation';
import { prisma } from '../db';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';

export const jobsRouter = Router();

jobsRouter.use(requireAuth);

jobsRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { createdBy: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch jobs' });
  }
});

jobsRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message) });
      return;
    }

    const { title, company, location, description, url } = parsed.data;

    const job = await prisma.job.create({
      data: {
        title,
        company,
        location: location ?? null,
        description: description ?? null,
        url: url || null,
        createdBy: req.user!.id,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create job' });
  }
});

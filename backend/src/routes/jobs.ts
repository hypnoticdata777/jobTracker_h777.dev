import { Router, type Response } from 'express';
import { createJobSchema, parseId, updateJobSchema } from '../lib/validation';
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

    const job = await prisma.job.create({
      data: { ...parsed.data, createdBy: req.user!.id },
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create job' });
  }
});

jobsRouter.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const parsed = updateJobSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message) });
      return;
    }

    // Ownership check: the row must match the id AND belong to the caller.
    // Someone else's job answers 404, so the API does not reveal that it exists.
    const existing = await prisma.job.findFirst({
      where: { id, createdBy: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const statusChanged = parsed.data.status !== undefined && parsed.data.status !== existing.status;

    const job = await prisma.job.update({
      where: { id, createdBy: req.user!.id },
      data: {
        ...parsed.data,
        ...(statusChanged ? { statusChangedAt: new Date() } : {}),
      },
    });

    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update job' });
  }
});

jobsRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // deleteMany lets the owner filter sit in the same query as the delete.
    const result = await prisma.job.deleteMany({
      where: { id, createdBy: req.user!.id },
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete job' });
  }
});

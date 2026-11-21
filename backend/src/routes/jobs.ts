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
    res.status(500).json({ error: 'No se pudieron cargar las vacantes' });
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
    res.status(500).json({ error: 'No se pudo crear la vacante' });
  }
});

jobsRouter.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(404).json({ error: 'Vacante no encontrada' });
      return;
    }

    const parsed = updateJobSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message) });
      return;
    }

    // Verificar identificador y propietario; responder 404 para no revelar registros ajenos.
    const existing = await prisma.job.findFirst({
      where: { id, createdBy: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ error: 'Vacante no encontrada' });
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
    res.status(500).json({ error: 'No se pudo actualizar la vacante' });
  }
});

jobsRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(404).json({ error: 'Vacante no encontrada' });
      return;
    }

    // Incluir el propietario en la misma consulta que elimina el registro.
    const result = await prisma.job.deleteMany({
      where: { id, createdBy: req.user!.id },
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Vacante no encontrada' });
      return;
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar la vacante' });
  }
});

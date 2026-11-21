import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string | null;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401).json({ error: 'Debes iniciar sesión' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number };

    prisma.user
      .findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ error: 'Usuario no encontrado' });
          return;
        }

        req.user = user;
        next();
      })
      .catch(() => {
        res.status(401).json({ error: 'Sesión inválida o vencida' });
      });
  } catch {
    res.status(401).json({ error: 'Sesión inválida o vencida' });
    return;
  }
}

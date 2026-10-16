import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET ?? 'development-secret';
    const payload = jwt.verify(token, secret) as { userId: number };

    prisma.user
      .findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, name: true },
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        req.user = user;
        next();
      })
      .catch(() => {
        res.status(401).json({ error: 'Invalid token' });
      });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

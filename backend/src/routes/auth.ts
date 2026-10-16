import { Router, type Request, type Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db';
import { loginSchema, registerSchema } from '../lib/validation';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

const userSafeSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
};

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message) });
      return;
    }

    const { email, password, name } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
      },
      select: userSafeSelect,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to register user' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues.map((issue) => issue.message) });
      return;
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const passwordMatches = await argon2.verify(user.passwordHash, password);

    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET ?? 'development-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn });

    res.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to log in' });
  }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Logged out' });
});

authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json(req.user);
});

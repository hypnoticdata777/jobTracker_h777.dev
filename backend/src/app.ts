import express from 'express';
import cookieParser from 'cookie-parser';
import './config/env';
import { authRouter } from './routes/auth';
import { jobsRouter } from './routes/jobs';

// Builds the Express app without starting a server, so the same app can be
// started locally (server.ts), mounted as a serverless function (api/index.ts)
// or driven directly by tests.
export const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Job Tracker API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);

  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
});

export default app;

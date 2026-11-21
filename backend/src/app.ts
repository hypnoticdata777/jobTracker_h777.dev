import express from 'express';
import cookieParser from 'cookie-parser';
import './config/env';
import { authRouter } from './routes/auth';
import { jobsRouter } from './routes/jobs';

// Construye la aplicación sin iniciar el servidor, para reutilizarla
// localmente, en funciones de Vercel o en pruebas.
export const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'La API de seguimiento de postulaciones está en funcionamiento' });
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

// Las rutas desconocidas de la API también responden en español.
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);

  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;

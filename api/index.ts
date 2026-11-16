// Vercel entry point: every /api/* request is rewritten to this function
// (see vercel.json) and handled by the same Express app used locally.
import app from '../backend/src/app';

export default app;

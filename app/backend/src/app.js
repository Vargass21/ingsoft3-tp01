import express from 'express'; import cors from 'cors';
import { roomsRouter } from './routes/rooms.js'; import { reservationsRouter } from './routes/reservations.js'; import { errorHandler } from './middleware/errorHandler.js';
import { asyncHandler } from './middleware/asyncHandler.js'; import { pool } from './db/pool.js';
import { apiRateLimiter, healthRateLimiter } from './middleware/rateLimit.js';
export const app = express(); app.use(cors()); app.use(express.json());
app.get('/api/health', healthRateLimiter, asyncHandler(async (_req, res) => { await pool.query('SELECT 1'); res.json({ status: 'ok' }); }));
app.use('/api', apiRateLimiter);
// Temporal para validar el TP9: retirar esta ruta después de comprobar el error en PROD.
if (process.env.TP9_DEMO_ERROR_ENABLED === 'true') {
  app.get('/api/falla', () => { throw new Error('Falla de prueba del TP9'); });
}
app.use('/api/rooms', roomsRouter); app.use('/api/reservations', reservationsRouter);
app.use(errorHandler);

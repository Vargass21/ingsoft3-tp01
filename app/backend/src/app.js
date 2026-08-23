import express from 'express'; import cors from 'cors';
import { roomsRouter } from './routes/rooms.js'; import { reservationsRouter } from './routes/reservations.js'; import { errorHandler } from './middleware/errorHandler.js';
import { asyncHandler } from './middleware/asyncHandler.js'; import { pool } from './db/pool.js';
export const app = express(); app.use(cors()); app.use(express.json());
app.get('/api/health', asyncHandler(async (_req, res) => { await pool.query('SELECT 1'); res.json({ status: 'ok' }); }));
app.use('/api/rooms', roomsRouter); app.use('/api/reservations', reservationsRouter); app.use(errorHandler);

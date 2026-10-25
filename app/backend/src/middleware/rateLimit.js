import { rateLimit } from 'express-rate-limit';

// Cupos globales por proceso: protegen la BD tanto por acceso directo como por nginx,
// sin confiar en cabeceras de IP enviadas por el cliente o en una cantidad de proxies.
export const healthRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  keyGenerator: () => 'health',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Demasiadas consultas de estado. Reintentá más tarde.' },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 300,
  keyGenerator: () => 'api',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMIT_EXCEEDED', message: 'Demasiadas solicitudes. Reintentá más tarde.' },
});

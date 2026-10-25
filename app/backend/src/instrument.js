import './config.js';
import * as Sentry from '@sentry/node';

// Se precarga con --import antes de Express y pg, también en modo ESM.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}

import * as Sentry from '@sentry/react';

// Es una dirección de envío, no un token de lectura ni de administración.
const dsn = 'https://f120524414bfc040e55641b20864ce7e@o4512314427965440.ingest.us.sentry.io/4512314445660160';

if (dsn) {
  Sentry.init({
    dsn,
    environment: window.location.hostname,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}

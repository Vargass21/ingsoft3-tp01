import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock('../src/db/pool.js', () => ({ pool: { query: vi.fn().mockResolvedValue({ rows: [] }) } }));

async function loadApp() {
  vi.resetModules();
  const { app } = await import('../src/app.js');
  const { pool } = await import('../src/db/pool.js');
  return { app, pool };
}

afterEach(() => vi.clearAllMocks());

describe('Protección de recursos de la API', () => {
  it('bloquea el health antes de consultar la BD y acepta HEAD', async () => {
    const { app, pool } = await loadApp();
    await request(app).head('/api/health').expect(200);
    for (let i = 1; i < 60; i++) await request(app).get('/api/health').expect(200);
    const blocked = await request(app).get('/api/health').expect(429);
    expect(blocked.body.error).toBe('RATE_LIMIT_EXCEEDED');
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
    expect(blocked.headers.ratelimit).toBeDefined();
    expect(pool.query).toHaveBeenCalledTimes(60);
  }, 15_000);

  it('comparte el cupo entre salas y reservas, sin permitir evadirlo cambiando X-Forwarded-For', async () => {
    const { app, pool } = await loadApp();
    for (let i = 0; i < 300; i++) {
      await request(app).get(i % 2 ? '/api/rooms' : '/api/reservations')
        .set('X-Forwarded-For', `198.51.100.${i % 250 + 1}`).expect(200);
    }
    await request(app).get('/api/rooms').set('X-Forwarded-For', '203.0.113.99').expect(429);
    expect(pool.query).toHaveBeenCalledTimes(300);
    // El monitor conserva su cupo aunque la API de negocio haya agotado el suyo.
    await request(app).get('/api/health').expect(200);
    expect(pool.query).toHaveBeenCalledTimes(301);
  }, 15_000);
});

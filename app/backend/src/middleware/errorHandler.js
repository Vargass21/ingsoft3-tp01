export function errorHandler(err, _req, res, _next) {
  console.error(err.message);
  if (err.status) return res.status(err.status).json({ error: err.error, message: err.message });
  if (err.code === 'ECONNREFUSED' || err.code === '3D000' || err.code === '28P01') {
    return res.status(503).json({ error: 'DATABASE_UNAVAILABLE', message: 'No se pudo conectar a PostgreSQL. Verificá que esté iniciado y que las variables DB_* sean correctas.' });
  }
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Ocurrió un error interno' });
}

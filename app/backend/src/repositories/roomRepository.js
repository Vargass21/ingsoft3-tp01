import { pool } from '../db/pool.js';

export const roomRepository = {
  list: async () => (await pool.query('SELECT * FROM rooms ORDER BY id')).rows,
  findById: async (id) => (await pool.query('SELECT * FROM rooms WHERE id = $1', [id])).rows[0],
  create: async ({ name, capacity, active = true }) => (await pool.query(
    'INSERT INTO rooms (name, capacity, active) VALUES ($1, $2, $3) RETURNING *', [name, capacity, active]
  )).rows[0],
  remove: async (id) => (await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id])).rows[0],
  hasFutureActiveReservations: async (id) => (await pool.query(
    "SELECT EXISTS(SELECT 1 FROM reservations WHERE room_id = $1 AND reservation_date >= CURRENT_DATE AND status <> 'CANCELADA') AS exists", [id]
  )).rows[0].exists
};

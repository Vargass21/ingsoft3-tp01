import { pool } from '../db/pool.js';

const select = `SELECT r.*, rooms.name AS room_name FROM reservations r JOIN rooms ON rooms.id = r.room_id`;
export const reservationRepository = {
  list: async () => (await pool.query(`${select} ORDER BY r.reservation_date DESC, r.start_time DESC`)).rows,
  findById: async (id) => (await pool.query(`${select} WHERE r.id = $1`, [id])).rows[0],
  hasOverlap: async ({ roomId, reservationDate, startTime, endTime }) => (await pool.query(
    `SELECT EXISTS(SELECT 1 FROM reservations WHERE room_id = $1 AND reservation_date = $2
      AND status <> 'CANCELADA' AND start_time < $4 AND end_time > $3) AS exists`,
    [roomId, reservationDate, startTime, endTime]
  )).rows[0].exists,
  create: async ({ roomId, reservedBy, reservationDate, startTime, endTime, peopleCount }) => (await pool.query(
    `INSERT INTO reservations (room_id, reserved_by, reservation_date, start_time, end_time, people_count)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [roomId, reservedBy, reservationDate, startTime, endTime, peopleCount]
  )).rows[0],
  updateStatus: async (id, status) => (await pool.query(
    'UPDATE reservations SET status = $2 WHERE id = $1 RETURNING *', [id, status]
  )).rows[0]
};

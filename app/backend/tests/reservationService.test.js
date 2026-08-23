import { describe, expect, it } from 'vitest';
import { createReservationService, canTransition } from '../src/services/reservationService.js';

const room = { id: 1, capacity: 10, active: true };
const makeService = (overrides = {}) => createReservationService({ rooms: { findById: async () => room, ...overrides.rooms }, reservations: { hasOverlap: async () => false, create: async (d) => d, findById: async () => ({ id: 1, status: 'PENDIENTE' }), updateStatus: async (_id, s) => ({ status: s }), ...overrides.reservations } });
const data = { roomId: 1, reservedBy: 'Ana', reservationDate: '2030-01-01', startTime: '10:00', endTime: '11:00', peopleCount: 5 };
describe('reglas de reservas', () => {
  it('rechaza horario inválido', async () => await expect(makeService().create({ ...data, endTime: '10:00' })).rejects.toMatchObject({ error: 'INVALID_SCHEDULE' }));
  it('rechaza capacidad excedida', async () => await expect(makeService().create({ ...data, peopleCount: 11 })).rejects.toMatchObject({ error: 'ROOM_CAPACITY_EXCEEDED' }));
  it('rechaza sala inactiva', async () => await expect(makeService({ rooms: { findById: async () => ({ ...room, active: false }) } }).create(data)).rejects.toMatchObject({ error: 'ROOM_INACTIVE' }));
  it('rechaza superposición', async () => await expect(makeService({ reservations: { hasOverlap: async () => true } }).create(data)).rejects.toMatchObject({ error: 'RESERVATION_OVERLAP' }));
  it('acepta PENDIENTE a CONFIRMADA', () => expect(canTransition('PENDIENTE', 'CONFIRMADA')).toBe(true));
  it('rechaza FINALIZADA a PENDIENTE', () => expect(canTransition('FINALIZADA', 'PENDIENTE')).toBe(false));
});

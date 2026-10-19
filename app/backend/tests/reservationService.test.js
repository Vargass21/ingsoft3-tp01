import { describe, expect, it, vi } from 'vitest';
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

  it.each([0, -1, -5])(
    'rechaza una cantidad de personas no positiva: %i',
    async (peopleCount) => {
      // Arrange: preparar una reserva con cantidad inválida.
      const service = makeService();
      const invalidData = { ...data, peopleCount };

      // Act: intentar crear la reserva.
      const result = service.create(invalidData);

      // Assert: comprobar el error de la regla.
      await expect(result).rejects.toMatchObject({
        status: 400,
        error: 'INVALID_PEOPLE_COUNT',
      });
    }
  );

  it('acepta una reserva que ocupa exactamente la capacidad de la sala', async () => {
    // Arrange: la sala tiene capacidad para 10 personas.
    const service = makeService();
    const reservation = { ...data, peopleCount: room.capacity };

    // Act: crear una reserva en el límite permitido.
    const result = await service.create(reservation);

    // Assert: comprobar que se acepta y conserva sus datos.
    expect(result).toEqual(reservation);
  });

  it('no guarda la reserva cuando existe una superposición', async () => {
    // Arrange: simular una superposición y observar el guardado.
    const create = vi.fn();
    const service = makeService({
      reservations: {
        hasOverlap: async () => true,
        create,
      },
    });

    // Act: intentar crear la reserva.
    const result = service.create(data);

    // Assert: comprobar el rechazo y que no se intentó guardar.
    await expect(result).rejects.toMatchObject({
      error: 'RESERVATION_OVERLAP',
    });
    expect(create).not.toHaveBeenCalled();
  });
});

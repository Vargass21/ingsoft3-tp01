import { AppError } from './errors.js';
export function createRoomService(rooms) {
  return {
    async create(data) {
      if (!data.name?.trim() || !Number.isInteger(data.capacity) || data.capacity <= 0)
        throw new AppError(400, 'VALIDATION_ERROR', 'Nombre y capacidad positiva son obligatorios');
      return rooms.create({ ...data, name: data.name.trim() });
    },
    async remove(id) {
      const room = await rooms.findById(id);
      if (!room) throw new AppError(404, 'ROOM_NOT_FOUND', 'La sala no existe');
      if (await rooms.hasFutureActiveReservations(id)) throw new AppError(409, 'ROOM_HAS_FUTURE_RESERVATIONS', 'La sala tiene reservas futuras activas');
      return rooms.remove(id);
    }
  };
}

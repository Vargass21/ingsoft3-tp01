import { AppError } from './errors.js';

const validTransitions = {
  PENDIENTE: ['CONFIRMADA', 'CANCELADA'],
  CONFIRMADA: ['CANCELADA', 'FINALIZADA'],
  CANCELADA: [], FINALIZADA: []
};

export function canTransition(from, to) { return validTransitions[from]?.includes(to) || false; }

export function createReservationService({ rooms, reservations }) {
  return {
    async create(data) {
      const { roomId, reservedBy, reservationDate, startTime, endTime, peopleCount } = data;
      if (!roomId || !reservedBy || !reservationDate || !startTime || !endTime || !Number.isInteger(peopleCount))
        throw new AppError(400, 'VALIDATION_ERROR', 'Todos los campos son obligatorios');
      if (endTime <= startTime) throw new AppError(400, 'INVALID_SCHEDULE', 'La hora de finalización debe ser posterior a la inicial');
      if (peopleCount <= 0) throw new AppError(400, 'INVALID_PEOPLE_COUNT', 'La cantidad de personas debe ser mayor que cero');
      const room = await rooms.findById(roomId);
      if (!room) throw new AppError(404, 'ROOM_NOT_FOUND', 'La sala no existe');
      if (!room.active) throw new AppError(409, 'ROOM_INACTIVE', 'La sala está inactiva');
      if (peopleCount > room.capacity) throw new AppError(400, 'ROOM_CAPACITY_EXCEEDED', 'La cantidad de personas supera la capacidad de la sala');
      if (await reservations.hasOverlap(data)) throw new AppError(409, 'RESERVATION_OVERLAP', 'La sala ya tiene una reserva activa en ese horario');
      return reservations.create(data);
    },
    async changeStatus(id, status) {
      const reservation = await reservations.findById(id);
      if (!reservation) throw new AppError(404, 'RESERVATION_NOT_FOUND', 'La reserva no existe');
      if (!canTransition(reservation.status, status)) throw new AppError(400, 'INVALID_STATUS_TRANSITION', 'La transición de estado no es válida');
      return reservations.updateStatus(id, status);
    }
  };
}

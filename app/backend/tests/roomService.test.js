import { describe, expect, it, vi } from 'vitest';
import { createRoomService } from '../src/services/roomService.js';

describe('eliminación de salas', () => {
  it('impide eliminar una sala con reservas futuras activas', async () => {
    // Arrange
    const rooms = {
      findById: vi.fn().mockResolvedValue({ id: 1 }),
      hasFutureActiveReservations: vi.fn().mockResolvedValue(true),
      remove: vi.fn(),
    };
    const service = createRoomService(rooms);

    // Act
    const result = service.remove(1);

    // Assert
    await expect(result).rejects.toMatchObject({
      error: 'ROOM_HAS_FUTURE_RESERVATIONS',
    });
    expect(rooms.hasFutureActiveReservations).toHaveBeenCalledWith(1);
    expect(rooms.remove).not.toHaveBeenCalled();
  });

  it('elimina una sala sin reservas futuras activas', async () => {
    // Arrange
    const room = { id: 1, name: 'Sala A' };
    const rooms = {
      findById: vi.fn().mockResolvedValue(room),
      hasFutureActiveReservations: vi.fn().mockResolvedValue(false),
      remove: vi.fn().mockResolvedValue(room),
    };
    const service = createRoomService(rooms);

    // Act
    const result = await service.remove(1);

    // Assert
    expect(rooms.remove).toHaveBeenCalledTimes(1);
    expect(rooms.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual(room);
  });

  it('rechaza eliminar una sala inexistente', async () => {
    // Arrange
    const rooms = {
      findById: vi.fn().mockResolvedValue(undefined),
      hasFutureActiveReservations: vi.fn(),
      remove: vi.fn(),
    };
    const service = createRoomService(rooms);

    // Act
    const result = service.remove(99);

    // Assert
    await expect(result).rejects.toMatchObject({
      error: 'ROOM_NOT_FOUND',
    });
    expect(rooms.hasFutureActiveReservations).not.toHaveBeenCalled();
    expect(rooms.remove).not.toHaveBeenCalled();
  });
});
// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { submitReservation } from './reservationForm.js';
import { validateReservationCapacity } from './reservationCapacity.js';

const validForm = {
  roomId: '1',
  reservedBy: 'Ana',
  reservationDate: '2030-01-01',
  startTime: '10:00',
  endTime: '11:00',
  peopleCount: '4',
};

const activeRoom = { id: 1, name: 'Sala A', capacity: 10, active: true };

describe('validateReservationCapacity', () => {
  it.each([
    ['no existe', []],
    ['está inactiva', [{ ...activeRoom, active: false }]],
  ])('rechaza la selección cuando la sala %s', (_, rooms) => {
    // Arrange
    const form = { ...validForm };

    // Act
    const result = validateReservationCapacity(form, rooms);

    // Assert
    expect(result).toBe('Seleccioná una sala válida antes de crear la reserva');
  });

  it('rechaza una cantidad superior a la capacidad disponible', () => {
    // Arrange
    const form = { ...validForm, peopleCount: '11' };
    const rooms = [activeRoom];

    // Act
    const result = validateReservationCapacity(form, rooms);

    // Assert
    expect(result).toBe('La cantidad de personas supera la capacidad de la sala (10)');
  });

  it.each([
    ['exactamente igual al límite', '10'],
    ['menor que el límite', '4'],
  ])('acepta una cantidad %s', (_, peopleCount) => {
    // Arrange
    const form = { ...validForm, peopleCount };
    const rooms = [activeRoom];

    // Act
    const result = validateReservationCapacity(form, rooms);

    // Assert
    expect(result).toBeNull();
  });
});

describe('submitReservation con validación de capacidad', () => {
  it('no llama al cliente si la cantidad supera la capacidad de la sala', async () => {
    // Arrange
    const form = { ...validForm, peopleCount: '11' };
    const client = { createReservation: vi.fn() };
    const rooms = [activeRoom];

    // Act
    const result = submitReservation(form, client, rooms);

    // Assert
    await expect(result).rejects.toThrow(
      'La cantidad de personas supera la capacidad de la sala (10)',
    );
    expect(client.createReservation).not.toHaveBeenCalled();
  });

  it('envía al cliente una reserva dentro de la capacidad', async () => {
    // Arrange
    const form = { ...validForm };
    const reservation = { id: 2, ...form };
    const client = { createReservation: vi.fn().mockResolvedValue(reservation) };
    const rooms = [activeRoom];

    // Act
    const result = await submitReservation(form, client, rooms);

    // Assert
    expect(client.createReservation).toHaveBeenCalledTimes(1);
    expect(client.createReservation).toHaveBeenCalledWith(form);
    expect(result).toBe(reservation);
  });
});

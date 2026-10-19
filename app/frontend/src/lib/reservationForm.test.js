// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { submitReservation, validateReservationForm } from './reservationForm.js';

const validForm = {
  roomId: '1',
  reservedBy: 'Ana',
  reservationDate: '2030-01-01',
  startTime: '10:00',
  endTime: '11:00',
  peopleCount: '2',
};

describe('validateReservationForm', () => {
  it('devuelve null para un formulario completo con horario válido', () => {
    // Arrange
    const form = { ...validForm };

    // Act
    const result = validateReservationForm(form);

    // Assert
    expect(result).toBeNull();
  });

  it.each([
    'roomId',
    'reservedBy',
    'reservationDate',
    'startTime',
    'endTime',
    'peopleCount',
  ])('devuelve el mensaje de campos faltantes cuando %s está vacío', (field) => {
    // Arrange
    const form = { ...validForm, [field]: '' };

    // Act
    const result = validateReservationForm(form);

    // Assert
    expect(result).toBe('Completá todos los campos obligatorios');
  });

  it.each([
    ['igual al inicio', '10:00'],
    ['anterior al inicio', '09:00'],
  ])('devuelve el mensaje de horario inválido si la hora final es %s', (_, endTime) => {
    // Arrange
    const form = { ...validForm, endTime };

    // Act
    const result = validateReservationForm(form);

    // Assert
    expect(result).toBe('La hora final debe ser posterior a la inicial');
  });
});

describe('submitReservation', () => {
  it('envía los datos originales una sola vez y devuelve el resultado del cliente', async () => {
    // Arrange
    const form = { ...validForm };
    const reservation = { id: 1, ...form };
    const client = { createReservation: vi.fn().mockResolvedValue(reservation) };

    // Act
    const result = await submitReservation(form, client);

    // Assert
    expect(client.createReservation).toHaveBeenCalledTimes(1);
    expect(client.createReservation).toHaveBeenCalledWith(validForm);
    expect(client.createReservation.mock.calls[0][0]).toBe(form);
    expect(result).toBe(reservation);
  });

  it('rechaza un formulario inválido con el mensaje esperado sin llamar al cliente', async () => {
    // Arrange
    const form = { ...validForm, reservedBy: '' };
    const client = { createReservation: vi.fn() };

    // Act
    const result = submitReservation(form, client);

    // Assert
    await expect(result).rejects.toThrow('Completá todos los campos obligatorios');
    expect(client.createReservation).not.toHaveBeenCalled();
  });

  it('propaga el mismo error cuando el cliente rechaza la reserva', async () => {
    // Arrange
    const form = { ...validForm };
    const error = new Error('No se pudo crear la reserva');
    const client = { createReservation: vi.fn().mockRejectedValue(error) };

    // Act
    const result = submitReservation(form, client);

    // Assert
    await expect(result).rejects.toBe(error);
  });
});

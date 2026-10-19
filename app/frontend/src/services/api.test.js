// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api.js';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('cliente API', () => {
  it('rooms devuelve los datos JSON de una respuesta exitosa', async () => {
    // Arrange
    const rooms = [{ id: 1, name: 'Sala A' }];
    const json = vi.fn().mockResolvedValue(rooms);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json });
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const result = await api.rooms();

    // Assert
    expect(result).toEqual(rooms);
    expect(json).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/rooms`, {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('createReservation envía POST con encabezado JSON y los datos serializados', async () => {
    // Arrange
    const data = {
      roomId: '1', reservedBy: 'Ana', reservationDate: '2030-01-01',
      startTime: '10:00', endTime: '11:00', peopleCount: '2',
    };
    const reservation = { id: 42, ...data };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 201, json: vi.fn().mockResolvedValue(reservation),
    });
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const result = await api.createReservation(data);

    // Assert
    expect(result).toEqual(reservation);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  });

  it('status usa el identificador recibido y envía PATCH con el estado serializado', async () => {
    // Arrange
    const id = 73;
    const status = 'CONFIRMADA';
    const reservation = { id, status };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, status: 200, json: vi.fn().mockResolvedValue(reservation),
    });
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const result = await api.status(id, status);

    // Assert
    expect(result).toEqual(reservation);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  });

  it('devuelve null ante una respuesta 204 sin intentar leer JSON', async () => {
    // Arrange
    const json = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204, json }));

    // Act
    const result = await api.status(73, 'CANCELADA');

    // Assert
    expect(result).toBeNull();
    expect(json).not.toHaveBeenCalled();
  });

  it('rechaza con el message del cuerpo ante un error HTTP', async () => {
    // Arrange
    const json = vi.fn().mockResolvedValue({ message: 'La sala está inactiva' });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 409, json }));

    // Act
    const result = api.rooms();

    // Assert
    await expect(result).rejects.toThrow('La sala está inactiva');
    expect(json).toHaveBeenCalledTimes(1);
  });

  it('rechaza con el mensaje alternativo si el cuerpo del error HTTP no es JSON', async () => {
    // Arrange
    const json = vi.fn().mockRejectedValue(new SyntaxError('Unexpected token'));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json }));

    // Act
    const result = api.rooms();

    // Assert
    await expect(result).rejects.toThrow('La API no pudo procesar la solicitud');
    expect(json).toHaveBeenCalledTimes(1);
  });

  it('rechaza con el mensaje de conexión cuando fetch falla con TypeError', async () => {
    // Arrange
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    // Act
    const result = api.rooms();

    // Assert
    await expect(result).rejects.toThrow(
      'No se pudo conectar con el backend. Verificá que esté iniciado en el puerto 3000.',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

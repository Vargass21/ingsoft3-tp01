import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';

const API = (process.env.API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const uniqueName = () => `api ${Date.now()} ${randomUUID()}`;

async function rooms(request) {
  const response = await request.get(`${API}/api/rooms`);
  expect(response.status()).toBe(200);
  return response.json();
}

async function remove(request, id) {
  const response = await request.delete(`${API}/api/rooms/${id}`);
  expect(response.status()).toBe(204);
  expect((await rooms(request)).some(room => room.id === id)).toBe(false);
}

test('alta, lectura y borrado de una sala en la base real', async ({ request }) => {
  const name = uniqueName();
  const response = await request.post(`${API}/api/rooms`, { data: { name, capacity: 7 } });
  expect(response.status()).toBe(201);
  const created = await response.json();
  try {
    expect(await rooms(request)).toContainEqual(expect.objectContaining({ id: created.id, name, capacity: 7 }));
  } finally {
    await remove(request, created.id);
  }
});

test('nombre vacio devuelve 400 y no crea una sala', async ({ request }) => {
  const before = await rooms(request);
  const response = await request.post(`${API}/api/rooms`, { data: { name: '', capacity: 5 } });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ error: 'VALIDATION_ERROR' });
  const after = await rooms(request);
  expect(after.map(room => room.id).sort((a, b) => a - b)).toEqual(before.map(room => room.id).sort((a, b) => a - b));
});

test('una nueva consulta conserva nombre, capacidad y estado de la sala', async ({ request }) => {
  const name = uniqueName();
  const response = await request.post(`${API}/api/rooms`, { data: { name, capacity: 13, active: false } });
  expect(response.status()).toBe(201);
  const created = await response.json();
  try {
    for (let read = 0; read < 2; read++) {
      expect(await rooms(request)).toContainEqual(expect.objectContaining({ id: created.id, name, capacity: 13, active: false }));
    }
  } finally {
    await remove(request, created.id);
  }
});

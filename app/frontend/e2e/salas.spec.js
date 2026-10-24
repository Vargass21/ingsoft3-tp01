import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';

const uniqueName = () => `e2e ${Date.now()} ${randomUUID()}`;
const rowFor = (page, name) => page.getByRole('row').filter({ has: page.getByRole('cell', { name, exact: true }) });

async function openRooms(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Salas', exact: true }).click();
  await expect(page.getByRole('table')).toBeVisible();
}

async function create(page, name) {
  await page.getByLabel('Nombre de sala').fill(name);
  await page.getByLabel('Capacidad', { exact: true }).fill('7');
  await page.getByRole('button', { name: 'Crear sala', exact: true }).click();
  await expect(rowFor(page, name)).toBeVisible();
}

async function remove(page, name) {
  await page.getByRole('button', { name: `Borrar ${name}`, exact: true }).click();
  await expect(page.getByText('Cargando salas...')).toHaveCount(0);
  await expect(rowFor(page, name)).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: 'Salas', exact: true }).click();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(rowFor(page, name)).toHaveCount(0);
}

test('crear una sala la muestra y borrarla la elimina', async ({ page }) => {
  const name = uniqueName();
  await openRooms(page);
  try {
    await create(page, name);
    // La tercera columna es Capacidad; el ID puede coincidir con ese numero.
    await expect(rowFor(page, name).getByRole('cell').nth(2)).toHaveText('7');
  } finally {
    // Si el alta alcanzo a guardarse antes de fallar una asercion, tambien se limpia.
    await openRooms(page);
    if (await rowFor(page, name).count()) await remove(page, name);
  }
});

test('nombre vacio muestra el error y no crea una sala', async ({ page }) => {
  await openRooms(page);
  const before = await page.getByRole('row').count();
  await page.getByLabel('Nombre de sala').fill('');
  await page.getByLabel('Capacidad', { exact: true }).fill('7');
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/rooms') && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Crear sala', exact: true }).click();
  expect((await responsePromise).status()).toBe(400);
  await expect(page.getByRole('alert')).toHaveText('Nombre y capacidad positiva son obligatorios');
  await openRooms(page);
  await expect(page.getByRole('row')).toHaveCount(before);
  await expect(page.getByRole('cell', { name: '', exact: true })).toHaveCount(0);
});

test('la sala y su capacidad persisten al recargar la pagina', async ({ page }) => {
  const name = uniqueName();
  await openRooms(page);
  try {
    await create(page, name);
    await openRooms(page);
    await expect(rowFor(page, name)).toBeVisible();
    // La tercera columna es Capacidad; el ID puede coincidir con ese numero.
    await expect(rowFor(page, name).getByRole('cell').nth(2)).toHaveText('7');
  } finally {
    await openRooms(page);
    if (await rowFor(page, name).count()) await remove(page, name);
  }
});

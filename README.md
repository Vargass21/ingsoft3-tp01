# MiniReservas

Aplicación académica para administrar salas y sus reservas. Arquitectura: **React (Vite) → API REST (Express) → PostgreSQL**.

## Requisitos

Node.js 22+ y Docker Desktop. Docker se utiliza únicamente para PostgreSQL; el frontend y el backend se ejecutan localmente.

## Instalación local

1. Copiá `.env.example` como `.env`.
2. Iniciá PostgreSQL con `docker compose up -d db`.
3. Inicializá la base con `cd backend`, `npm install` y `npm run db:init`.
4. En otra terminal: `npm run dev` dentro de `backend`.
5. En otra terminal: `cd frontend`, `npm install` y `npm run dev`.

Abrí la URL que muestra Vite (normalmente `http://localhost:5173`).

## Backend

Dentro de `backend`:

- Instalar: `npm install`
- Desarrollo: `npm run dev`
- Ejecución normal: `npm start`
- Tests: `npm test`
- Crear estructura y datos iniciales: `npm run db:init`

## Frontend

Dentro de `frontend`:

- Instalar: `npm install`
- Desarrollo: `npm run dev`
- Build: `npm run build`
- Tests: `npm test`

## Base de datos

La conexión está centralizada en `backend/src/config.js` y se configura con `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`. No hay secretos en el código. El SQL reproducible está en `backend/migrations/001_init.sql`; incluye Sala A, B y C.

Antes de ejecutar `npm run db:init`, iniciá la base con `docker compose up -d db`. La configuración de `.env.example` ya apunta a esa base en `localhost:5434`; se usa ese puerto para evitar conflictos con instalaciones locales de PostgreSQL. El endpoint `GET /api/health` comprueba también la conexión a la base y devuelve `503` si PostgreSQL no está disponible.

## Docker

Docker Compose levanta solo PostgreSQL. Desde la raíz ejecutá:

`docker compose up -d db`

Luego ejecutá el backend local con `cd backend; npm run dev` y el frontend local con `cd frontend; npm run dev`. Frontend: `http://localhost:5173`; backend: `http://localhost:3000/api/health`. Para reiniciar la base desde cero: `docker compose down -v` y luego el comando anterior.

## Reglas de negocio

1. La finalización debe ser posterior al inicio.
2. Las personas deben ser más de cero y no exceder la capacidad.
3. No hay superposición en una misma sala; las canceladas no bloquean.
4. No se reserva una sala inactiva.
5. Solo se permiten las transiciones de estado indicadas.
6. No se elimina una sala con reservas futuras activas.

## Estructura

- `backend/src/controllers`: adapta HTTP a servicios.
- `backend/src/services`: concentra las reglas de negocio testeables.
- `backend/src/repositories`: consultas parametrizadas a PostgreSQL.
- `backend/migrations`: definición y datos iniciales de la base.
- `frontend/src/pages`: las tres pantallas; `components`: componentes pequeños; `services`: cliente API.

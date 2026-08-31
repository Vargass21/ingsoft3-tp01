# MiniReservas

Aplicación académica para administrar salas y reservas. La arquitectura en contenedores es **React/Vite → nginx → API REST Express → PostgreSQL**.

## Requisitos

- Git
- Docker Desktop, con Docker Compose disponible

No se requiere instalar Node.js ni PostgreSQL para el arranque completo con Docker.

## Arranque completo desde código

En una máquina limpia:

```bash
git clone https://github.com/Vargass21/ingsoft3-tp01.git
cd ingsoft3-tp01
cp .env.example .env
docker compose up -d --build
```

En Windows PowerShell, la copia del archivo puede realizarse así:

```powershell
Copy-Item .env.example .env
```

Antes de levantar el sistema, revisá y completá los valores locales de `.env`. No versionar ese archivo ni usar credenciales reales.

Verificá los servicios con `docker compose ps`.

URLs disponibles:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Health directo: http://localhost:3000/api/health
- Health mediante nginx: http://localhost:8080/api/health

El frontend se compila y nginx sirve los archivos estáticos. PostgreSQL se inicializa con `app/backend/migrations/001_init.sql` al crear un volumen nuevo.

## Detener el sistema

```bash
docker compose down
```

El comando elimina contenedores y red, pero conserva el volumen nombrado de PostgreSQL y sus datos.

> **Advertencia:** este comando elimina el volumen y todos los datos almacenados en PostgreSQL.

```bash
docker compose down -v
```

Al levantar nuevamente después de `down -v`, se crea una base vacía y se ejecuta de nuevo `001_init.sql`, con las salas iniciales.

## Imágenes publicadas

Para usar las imágenes publicadas en GHCR, sin construir backend ni frontend localmente:

```bash
docker compose -f docker-compose.registry.yml up -d
```

Las imágenes públicas son:

- `ghcr.io/vargass21/ingsoft3-tp02-backend:v0.1.0`
- `ghcr.io/vargass21/ingsoft3-tp02-frontend:v0.1.0`

No se requiere autenticación para descargarlas porque ambos paquetes son públicos.

## Desarrollo local y pruebas

El modo Docker anterior es el flujo reproducible recomendado. Para desarrollo local también se conservan estos comandos:

- Backend, desde `app/backend`: `npm install`, `npm run dev`, `npm start`, `npm test` y `npm run db:init`.
- Frontend, desde `app/frontend`: `npm install`, `npm run dev`, `npm run build` y `npm test`.

Para ejecutar el backend local contra PostgreSQL, iniciá solo la base con `docker compose up -d db`. `.env.example` apunta a `localhost:5434`, puerto que se publica para evitar conflictos con instalaciones locales de PostgreSQL. La conexión se configura mediante `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`; el endpoint `GET /api/health` verifica también la base de datos.

En desarrollo local, Vite informa la URL del frontend, normalmente http://localhost:5173. El SQL reproducible está en `app/backend/migrations/001_init.sql` e incluye Sala A, Sala B y Sala C.

## Reglas de negocio

1. La finalización debe ser posterior al inicio.
2. La cantidad de personas debe ser positiva y no exceder la capacidad de la sala.
3. No puede haber superposición en una misma sala; las reservas canceladas no bloquean.
4. No se reserva una sala inactiva.
5. Solo se permiten las transiciones de estado definidas.
6. No se elimina una sala con reservas futuras activas.

## Estructura

```text
app/
  backend/
  frontend/
docker-compose.yml
docker-compose.registry.yml
README.md
decisiones.md
evidencias.md
images/
```

- `app/backend/src/controllers`: adapta HTTP a servicios.
- `app/backend/src/services`: concentra las reglas de negocio testeables.
- `app/backend/src/repositories`: consultas parametrizadas a PostgreSQL.
- `app/backend/migrations`: definición y datos iniciales de la base.
- `app/frontend/src/pages`: pantallas; `components`: componentes pequeños; `services`: cliente API.


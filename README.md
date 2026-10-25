[![CI](https://github.com/Vargass21/ingsoft3-tp01/actions/workflows/ci.yml/badge.svg)](https://github.com/Vargass21/ingsoft3-tp01/actions/workflows/ci.yml)

--
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

## Límites de solicitudes (TP9)

La API usa `express-rate-limit` antes de las operaciones de base de datos. El endpoint
`/api/health` (GET y HEAD) admite 60 solicitudes por minuto. Salas y reservas comparten
otro cupo de 300 solicitudes por minuto. Al superarlo se responde `429`, con un error JSON
`RATE_LIMIT_EXCEEDED` y el encabezado `Retry-After` para indicar cuánto esperar.

Los cupos son globales por proceso, compartidos entre usuarios, para proteger los recursos
de esta aplicación académica de una instancia. No se usan cabeceras de IP para decidir el
cupo: funciona igual con acceso directo, nginx o Render. El health tiene un cupo independiente
del tráfico de negocio. El almacenamiento es en memoria y se reinicia con el backend.
Esto no reemplaza protección contra DDoS en la infraestructura. Para varias instancias o
límites por usuario se necesita un almacenamiento compartido y una identidad o cadena de
proxies verificada. Un abuso del propio health puede agotar su cupo y generar una alerta del monitor.

## Observabilidad con Sentry (TP9)

El backend usa `@sentry/node`. `npm start` y `npm run dev` precargan
`src/instrument.js` antes de Express y PostgreSQL para instrumentar las solicitudes
y las consultas. Configurar `SENTRY_DSN` y `SENTRY_ENVIRONMENT=production` en el
backend de PROD en Render. Sin DSN, no se inicializa el SDK. La integración Express
del SDK captura errores antes de que el manejador JSON de la aplicación responda.

El frontend usa `@sentry/react`, Browser Tracing y los manejadores de errores de
React 19. Su DSN público está en `app/frontend/src/sentry.js`.
El hostname identifica el entorno, de modo que la
misma imagen puede usarse en QA y PROD. El DSN no permite leer ni administrar Sentry.

Se muestrea el 100 % de las trazas para el ejercicio (`tracesSampleRate: 1.0`).
No se habilitan Session Replay ni el envío predeterminado de datos personales.
La validación final requiere datos reales: un error en Issues, uso y P95 por operación
en producción. La instalación o un build exitoso no demuestran recepción de telemetría.

Para la demostración temporal, configurar `TP9_DEMO_ERROR_ENABLED=true` en el backend
de producción y visitar `/api/falla`: devuelve 500 con un mensaje genérico y envía la
excepción a Sentry. La ruta no se registra sin esa variable. Después de verificarla,
desactivar la variable y retirar la ruta mediante otro PR antes de cerrar el TP9.

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


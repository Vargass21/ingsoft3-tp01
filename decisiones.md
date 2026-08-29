# Decisiones técnicas

- **React con Vite:** permite una interfaz por componentes, rápida de ejecutar y con pocos archivos de configuración.
- **Node.js con Express:** ambos usan JavaScript y Express hace muy explícitos los endpoints REST.
- **PostgreSQL:** es una base relacional confiable; la clave foránea expresa naturalmente que una reserva pertenece a una sala.
- **Monolito:** el problema es pequeño y una sola aplicación es más fácil de explicar, probar y desplegar.
- **Variables de entorno:** permiten mover la base entre la computadora, Docker y otro servidor sin cambiar código; `.env` no se versiona.
- **Sin microservicios:** agregarían red, despliegues y fallos distribuidos sin aportar valor al alcance actual.
- **Pocas dependencias:** se usan solo Express, pg, React/Vite y herramientas de pruebas. La lógica se escribe en funciones claras para facilitar la defensa y el mantenimiento.

## TP2 — Contenedores

### Aplicación elegida

La aplicación del semestre es **MiniReservas**, una solución local con React 19 y Vite 6 en el frontend, Node.js y Express 4 en el backend, PostgreSQL 16 como base de datos y `pg` como cliente de conexión. Es adecuada para los siguientes TPs porque contiene frontend, backend y base de datos, reglas de negocio reales, pruebas existentes y puede ejecutarse completamente en forma local.

### Backend en Docker

`app/backend/Dockerfile` usa dos etapas con Node 22 Alpine. La etapa `dependencies` ejecuta `npm ci --omit=dev`; la etapa final copia solo las dependencias de producción, `package.json` y `src`, expone el puerto 3000 y ejecuta `npm start`. La configuración se recibe mediante `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.

Node no tiene una separación SDK/runtime equivalente a .NET, por lo que no se afirma que la imagen final sea necesariamente menor que `node:22-alpine`. El beneficio real del multi-stage es separar preparación y runtime, excluir devDependencies, tests, secretos y `node_modules` locales, y lograr una imagen limpia y reproducible.

### Frontend y nginx

El frontend se construye con `node:22-alpine`, `npm ci` y `npm run build`; el resultado es `dist/`. El runtime es `nginx:1.27-alpine`: Vite se utiliza solo para construir y Node/Vite no quedan en la imagen final.

nginx sirve la SPA mediante `try_files $uri $uri/ /index.html`, que devuelve `index.html` para rutas que deben resolver del lado cliente. Durante el build se usa `VITE_API_URL=/api`. El navegador solicita `/api` en el mismo origin (`http://localhost:8080`) y nginx actúa como reverse proxy hacia `backend:3000`; así el uso normal no requiere comunicación cross-origin ni CORS entre frontend y backend. `backend` es resoluble porque ambos servicios comparten la red interna de Docker Compose.

### Docker Compose, DNS y puertos

La arquitectura es `frontend → backend → db`, con los servicios `frontend`, `backend` y `db`. PostgreSQL usa `postgres:16-alpine`. El volumen nombrado `postgres_data` persiste en `/var/lib/postgresql/data`.

El archivo `app/backend/migrations/001_init.sql` se monta de solo lectura en `/docker-entrypoint-initdb.d/001_init.sql`. Son conceptos diferentes: `postgres_data` es el almacenamiento persistente; `001_init.sql` es el script que inicializa una base nueva.

En el Compose definitivo, el backend usa `DB_HOST=db` y `DB_PORT=5432`: `db` es el nombre del servicio Docker y el DNS interno lo resuelve. No se usan `localhost`, `host.docker.internal` ni el puerto 5434. Dentro de un contenedor, `localhost` significa ese mismo contenedor.

PostgreSQL se verifica con `pg_isready`. El backend declara `depends_on` con `condition: service_healthy`, porque un contenedor iniciado no implica que PostgreSQL ya acepte conexiones.

### Variables y secretos

`.env` es local y no está versionado. `.env.example` se versiona e indica las variables necesarias. `DB_PASSWORD` se inyecta desde `.env`; no se guardan secretos reales, tokens ni credenciales en Git.

### Persistencia validada

En la prueba A, luego de crear la reserva **Reserva Evidencia TP2**, se ejecutaron `docker compose down` y `docker compose up -d`. Los contenedores se recrearon, pero el volumen sobrevivió y la reserva siguió existiendo.

En la prueba B, `docker compose down -v` eliminó `appreservas_postgres_data`. Al ejecutar nuevamente `docker compose up -d`, PostgreSQL creó un volumen nuevo y ejecutó `001_init.sql`: Sala A, Sala B y Sala C reaparecieron, mientras que **Reserva Evidencia TP2** desapareció.

### Registry

El registry elegido es GitHub Container Registry. Las imágenes públicas son:

- `ghcr.io/vargass21/ingsoft3-tp02-backend:v0.1.0`
- `ghcr.io/vargass21/ingsoft3-tp02-frontend:v0.1.0`

`v0.1.0` es un tag SemVer. `docker-compose.registry.yml` usa `image:` para backend y frontend en vez de `build:`, lo que permite ejecutar las imágenes publicadas sin construirlas localmente.

### Problemas encontrados y resoluciones

1. **Backend aislado y PostgreSQL:** durante la prueba aislada el backend usó `host.docker.internal` porque PostgreSQL estaba publicado en el host. En Compose se corrigió a `DB_HOST=db` y `DB_PORT=5432`.
2. **Contenedores aislados ocupando puertos:** antes de levantar Compose se eliminaron únicamente `reservas-backend` y `reservas-frontend`.
3. **Bug `reservationDate/date`:** `reservationRepository.hasOverlap` esperaba una propiedad distinta a la enviada por el servicio. Se corrigió para usar `reservationDate`; luego los 6 tests backend pasaron y se creó una reserva real.
4. **502 transitorio de nginx:** tras recrear servicios, nginx recibió temporalmente un 502 mientras backend terminaba de iniciar. El `depends_on` del frontend establece orden, pero no readiness del backend; luego del arranque la API funcionó correctamente.
5. **Registry TP01/TP02:** inicialmente se publicaron imágenes con el sufijo TP01 por el nombre histórico del remoto. Luego se publicaron correctamente `ingsoft3-tp02-backend` e `ingsoft3-tp02-frontend`.
6. **Node y comparación de tamaños:** la comparación SDK/runtime del ejemplo .NET no aplica de forma equivalente a Node. La evidencia se adaptó honestamente al stack real.

### Uso de Inteligencia Artificial

La práctica inicial del TP2 proporcionada por la cátedra se realizó manualmente utilizando el proyecto de ejemplo del profesor. Esa práctica permitió comprender imágenes, contenedores, Dockerfiles multi-stage, redes, volúmenes, Docker Compose, nginx, healthchecks y registry.

Después, al aplicar esos conceptos a la aplicación individual MiniReservas, se utilizaron herramientas de inteligencia artificial como asistencia para inspeccionar el proyecto, adaptar los ejemplos al stack React/Vite + Node/Express + PostgreSQL, proponer y revisar Dockerfiles, nginx.conf y Compose, detectar problemas, explicar errores, preparar comandos de prueba y organizar la documentación.

La IA no reemplazó la ejecución ni la verificación práctica. Cada parte se validó manualmente mediante `docker build`, `docker compose config`, `docker compose up`, `docker compose ps`, `curl`, healthchecks, navegador, pruebas end-to-end, pruebas de persistencia con `down` y `down -v`, recreación del volumen, publicación en GHCR y ejecución desde `docker-compose.registry.yml`. Las capturas de `evidencias.md` corresponden a ejecuciones reales. El contenido generado fue revisado para comprenderlo y poder defenderlo oralmente.

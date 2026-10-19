# Decisiones técnicas

- **React con Vite:** permite una interfaz por componentes, rápida de ejecutar y con pocos archivos de configuración.
- **Node.js con Express:** ambos usan JavaScript y Express hace muy explícitos los endpoints REST.
- **PostgreSQL:** es una base relacional confiable; la clave foránea expresa naturalmente que una reserva pertenece a una sala.
- **Monolito:** el problema es pequeño y una sola aplicación es más fácil de explicar, probar y desplegar.
- **Variables de entorno:** permiten mover la base entre la computadora, Docker y otro servidor sin cambiar código; `.env` no se versiona.
- **Sin microservicios:** agregarían red, despliegues y fallos distribuidos sin aportar valor al alcance actual.
- **Pocas dependencias:** se usan solo Express, pg, React/Vite y herramientas de pruebas. La lógica se escribe en funciones claras para facilitar la defensa y el mantenimiento.



## TP1

1. Git no pudo resolver el conflicto solo, ya que el no tiene la capacidad de decidir que cambios aceptar, ya que si tiene 2 pull request que modifican 
el mismo archivo debe intervenir un humano para decidir que cambios dejar.

2. Qué problemas encontraste: La verdad en este trabajo no tuve ningun problema para realizarlo, las consignas estaban bastante claras al igual q los pasos a seguir.

3. Declaración de uso de IA: No utilice la inteligencia Artificial en este trabajo, ya que no fue necesario.

## TP2 — Contenedores

Decisiones técnicas — TP2

Elegí MiniReservas porque tiene frontend, backend y base de datos, además de reglas de negocio y pruebas. Por eso sirve bien para aplicar Docker y Docker Compose sobre una aplicación completa.

Para el backend usé Node 22 Alpine con un Dockerfile multi-stage: primero instala las dependencias y luego genera una imagen final más limpia, solo con lo necesario para ejecutar la API. Para el frontend también uso Node para compilar React/Vite y nginx para servir la versión final.

Compose levanta tres servicios: frontend, backend y PostgreSQL. La base usa un volumen llamado postgres_data, así las reservas se mantienen aunque se bajen los contenedores con docker compose down. Solo se borran al ejecutar docker compose down -v.

Durante el trabajo encontré un error en el control de superposición de reservas: el backend esperaba date pero recibía reservationDate. Lo corregí y las pruebas volvieron a pasar. También hubo un error temporal de nginx mientras iniciaba el backend, que se resolvió una vez que todos los servicios terminaron de levantar.
    
## TP3

1. La historia esta mal escrita debido a que es una tarea tecnica disfrazada de historia, una historia de usuario debe expresar una necesidad o valor observable para el usuario y evitar definir directamente la implementación técnica. La reescribiria “Como usuario quiero que la información de mi perfil se almacene de forma persistente para que mis datos se conserven cuando vuelva a abrir la aplicación.”

2. Duracion del Sprint: Se definio una duracion de 2 semanas, ya que permite trabajar con una iteracion corta, obtener feedback frecuente y mantener un objetivo acotado, alineandose ademas con el calendario de entregas de la materia.

3. Límite WIP: Se configuró un límite de 2 elementos en In Progress, siguiendo la regla de cantidad de integrantes del equipo + 1. Al trabajar individualmente, esto permite mantener una tarea principal y disponer de un segundo espacio si la primera queda bloqueada, evitando acumular demasiado trabajo iniciado sin terminar.

4. Uno de los problemas encontrados fue que al empezar el tp no tenia instalado Github CLI entonces no me reconocia el comando gh. Los resolvi instalandolo y autenticandome de la forma correspondiente.

5. Uso de IA: Se utilizó ChatGPT como asistencia para interpretar la consigna, comprender los conceptos de planificación y trazabilidad, revisar la redacción de las decisiones y guiar algunos pasos de configuración. 

## TP4

1. Hice un job para el backend y otro para el frontend porque cada uno tiene su propio Dockerfile y se construyen por separado. Como ninguno depende del otro, pueden correr en paralelo y así el pipeline verifica las dos partes al mismo tiempo.

2. El pipeline guarda en la cache las capas de las imagenes Docker para no tener que reconstruir todo desde cero en cada ejecucion. Si una capa no cambio, se reutiliza y aparece como CACHED, esto para nuestro trabajo no hace una gran diferencia, pero para imagenes mucho mas grandes esto puede ahorrar muchos minutos. Si la cache desaparece el pipeline sigue funcionando, solo que tardaria mas porque tiene que volver a construir todas las capas. 

3. El pipeline usa los Dockerfiles que ya hicimos en el TP2 para mantener una sola forma de construir la aplicacion. Si el pipeline compilara por su cuenta, habria dos procesos distintos de build que con el tiempo podrian quedar diferentes. 

4. Uno de los problemas fue que las rutas de ejemplo del TP no coincidían con la estructura real de mi proyecto, porque el backend y el frontend están dentro de app/. Por eso tuve que usar ./app/backend y ./app/frontend como contexto de build.

5. Utilicé inteligencia artificial como apoyo para interpretar la consigna, revisar la configuración del workflow y resolver dudas durante el TP. Todo lo generado fue revisado y probado manualmente mediante los builds locales, los logs de GitHub Actions y el comportamiento real de los Pull Requests y los checks obligatorios.

## TP5 — Testing y cobertura

En TP5 probé reglas observables de reservas y salas: horarios, capacidad, transiciones y eliminación. Extraje la lógica del formulario a `validateReservationForm` y `submitReservation`; esta recibe el cliente API como dependencia. Así se prueba la lógica con strings sin DOM, red ni base de datos.

El backend tiene **14 casos unitarios** en Node. El frontend suma **23**: **19 sin DOM** (12 de formulario y 7 del cliente API, en Node) y **4 de componentes** en jsdom. Vitest aporta `it.each` para variar campos y horarios, `vi.fn()` para observar dependencias y `vi.stubGlobal` para simular `fetch` sin red. El error asíncrono del formulario requirió `findByRole` en las pruebas de componentes.

Uso cobertura V8 de Vitest, informes de texto, HTML y JSON, `coverage.include`/`coverage.exclude` para definir el alcance y `thresholds.lines` como gate. En Docker, Vitest escribe en `/out/coverage`; montar allí el padre `/out` resolvió el `EBUSY` que ocurría al limpiar directamente el punto de montaje `/app/coverage`.

El backend incluye `src/services/**/*.js`: `reservationService`, `roomService` y `errors`, donde viven reglas de negocio. Rutas, controladores, repositorios, middleware, configuración y arranque quedan fuera del alcance elegido; contienen lógica e interacciones con infraestructura, pero esta medición se centra en servicios. Los tests se excluyen con `**/*.{test,spec}.{js,jsx}` y `**/__tests__/**`. El frontend incluye `src/lib/**/*.js`, `src/services/**/*.js`, `src/pages/**/*.jsx` y `src/components/**/*.jsx`, también las pantallas de salas y reservas sin tests directos. Excluye los mismos patrones de tests; `App.jsx`, `main.jsx`, estilos y setup no coinciden con los patrones de inclusión.

Los mínimos iniciales son **80 % de líneas** en backend y **60 %** en frontend. Docker midió backend **84,61 % de líneas / 91,30 % de ramas** y frontend **64,28 % / 92,50 %**. Son mínimos iniciales; elevarlos requiere cubrir más caminos. Cobertura alta tampoco asegura aserciones suficientes: aceptar una reserva de 10 personas para una sala de capacidad 10 verifica el borde permitido, pero no el rechazo de 11 (cubierto por otra prueba). El reporte backend confirma pendiente `!reservation` en `changeStatus`, [reservationService.js, línea 28](app/backend/src/services/reservationService.js#L28). La entrada `id=999` con `findById` devolviendo `null` comprobaría el 404; se deja pendiente por ahora.

Frontend local y Docker cubren **63 líneas**, pero cuentan **104 y 98 líneas**, respectivamente; difieren los totales de `RoomsPage.jsx` y `ReservationsPage.jsx`. Los archivos tienen el mismo contenido; la causa no está determinada. El pipeline medirá dentro de Docker.

Usé ChatGPT como asistencia para diseñar pruebas y configurar cobertura y workflow. Revisé cambios, pruebas, builds e imágenes Docker e informes; `actionlint` no estaba disponible. CI y el bloqueo de merges aún no están comprobados: falta una corrida real en GitHub. Quedan los dos PR de demostración y el tag/release `v5.0.0`; añadiré sus enlaces cuando existan.

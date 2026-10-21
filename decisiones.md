## Enlaces de este TP

- **TP6 — PR con tests verdes y login al registry salteado:** [job backend del PR #28](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39658685810/job/119425669436). El [job frontend](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39658685810/job/119425668804) muestra el mismo comportamiento.
- **TP6 — Corrida de main que publica al final:** [job backend de main, intento exitoso](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39659895341/job/119434626083). La publicación es el último paso propio, después de tests y reportes.
- **TP6 — Paquetes públicos etiquetados por commit:** [backend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-backend) y [frontend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-frontend), ambos con etiqueta `sha-7c3351128749130ad1973d2dc6d681031d8a698e`. Se consultaron sus manifiestos sin credenciales personales y se comprobó manualmente la descarga con docker pull después de docker logout ghcr.io.
- **TP6 — URLs de QA y PROD:** [frontend QA](https://minireservas-front-qa.onrender.com) y [frontend PROD](https://minireservas-front-prod.onrender.com). APIs: [QA](https://minireservas-api-qa.onrender.com/api/health) y [PROD](https://minireservas-api-prod.onrender.com/api/health). Servicios inicializados en Render; promoción desde Actions todavía en implementación.

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

Elegí probar horarios, capacidad, superposición, transiciones de reservas y eliminación de salas porque un error puede aceptar reservas incompatibles o permitir operaciones inválidas. La aplicación ya tenía estas reglas de negocio. La versión integrada tiene 14 casos de backend y 30 de frontend: 26 sin DOM y 4 de componentes.

Usé Vitest en backend y frontend: it.each para parametrizados, vi.fn para dobles y vi.stubGlobal para simular fetch. V8 mide la cobertura, thresholds.lines aplica el umbral y coverage.include/exclude define qué código entra en la cuenta.

Elegí mínimos de líneas del 80 % en backend y 60 % en frontend, por debajo de las mediciones iniciales, para detectar caídas al agregar lógica sin suficientes pruebas. En la [corrida verde final](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39301775512), el frontend alcanzó 68,75 % de líneas y 93,87 % de ramas; el backend reportó 91,30 % de ramas. Las ramas se informan, pero no tienen umbral. Esa corrida también publica el resumen y los reportes descargables de ambos proyectos.

En backend mido los servicios. Dejo fuera rutas, controladores y middleware para concentrar esta suite en reglas de negocio; los repositorios y la base de datos requieren además verificar su integración con PostgreSQL. Configuración y arranque quedan fuera por preparar la aplicación. En frontend incluyo lógica, cliente API, páginas y componentes, incluso los que no tienen tests directos. App.jsx y main.jsx quedan fuera por composición y arranque; estilos y setup quedan fuera por presentación y preparación de pruebas. Excluyo los propios tests para medir código de producción.

Cobertura alta no garantiza buenas pruebas. Por ejemplo, probar solamente que una sala de capacidad 10 acepta 5 personas no comprueba el límite: por eso también verifico que acepte 10 y rechace 11.

Extraje la validación y el envío del formulario a funciones; submitReservation recibe el cliente API como dependencia. Antes esa lógica estaba dentro del componente y probarla exigía renderizarlo. Así puedo comprobarla sin DOM ni red. En backend ya existía la inyección de repositorios y la aproveché para los mocks.

En el [PR #25](https://github.com/Vargass21/ingsoft3-tp01/pull/25), agregué la validación de capacidad sin sus tests. Los 23 tests existentes pasaban, pero build-frontend falló por cobertura de líneas, como muestra la [corrida roja por umbral](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39300100829). Agregué siete casos para salas inválidas, límites y llamadas al cliente; los checks quedaron verdes y después integré el PR.

El [PR #26](https://github.com/Vargass21/ingsoft3-tp01/pull/26) agrega validaciones al confirmar reservas sin sus tests y queda abierto hasta la defensa. En su [corrida roja](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39512875437), los 14 tests pasan, pero build-backend falla por 69,84 % de líneas frente al mínimo del 80 %. Reporta 91,30 % de ramas y el merge está bloqueado.

En el reporte de main identifiqué sin cubrir la línea 28 de reservationService.js: if (!reservation). Una llamada changeStatus(999, 'CONFIRMADA'), con findById devolviendo null, recorrería el error 404 RESERVATION_NOT_FOUND. Decidí no agregar ese test en esta entrega y dejarlo identificado como mejora pendiente.

Después de integrar el primer PR, git pull --ff-only falló porque mi main local y origin/main tenían historiales diferentes. Para continuar sin descartar commits, creé la rama de la segunda demostración directamente desde origin/main, que ya contenía el PR integrado.

Usé ChatGPT y Codex para interpretar la consigna, preparar pruebas y revisar código, configuraciones y documentación. Comprobé los resultados con tests, reportes, builds Docker y Actions. Los commits y pushes los hice personalmente.

## TP6 — Entrega continua (en desarrollo)

### Publicación de imágenes verificadas

El backend y el frontend tienen Dockerfiles propios, por lo que el pipeline publica dos imágenes en GHCR: `ghcr.io/vargass21/ingsoft3-tp01-backend` y `ghcr.io/vargass21/ingsoft3-tp01-frontend`. Cada imagen lleva la etiqueta `sha-<commit>` para identificar el código que la produjo. La publicación y el acceso público de los paquetes todavía deben comprobarse en GitHub; esta configuración local no demuestra que ya estén publicados.

En cada job, primero se ejecutan los tests y el control de cobertura del TP5, después se generan los reportes y finalmente se construye la imagen de ejecución. Ese último paso publica solamente cuando el evento es un push a main. En un PR se verifica y construye, pero no se inicia sesión en GHCR ni se publica. Los pasos de publicación mantienen la condición de éxito predeterminada: no usan always(), !cancelled() ni continue-on-error para saltarse una falla previa.

La confianza en lo publicado depende de tres controles: la protección de main exige los checks verdes, solo main publica y la publicación queda al final del mismo job que verifica. La protección de rama debe mantenerse activa. Si se publicara aun con verificaciones fallidas, encontrar una imagen en el registry dejaría de indicar que superó los controles del pipeline. Esta cadena no impide una publicación manual por alguien con permisos, y cada job garantiza sus propias verificaciones: si falla frontend, backend puede haber publicado su imagen, aunque la promoción de la aplicación deberá exigir ambos jobs verdes.

Los permisos contents: read y packages: write se declaran en cada job que publica. El primero permite leer el repositorio; el segundo, publicar paquetes mediante GITHUB_TOKEN, sin guardar una credencial adicional. Los nombres de las imágenes se escriben en minúsculas porque el usuario de GitHub contiene una mayúscula. Una etiqueta por commit aporta trazabilidad, pero puede reemplazarse; un digest identifica el contenido de la imagen.

### Uso de IA y verificación hasta este punto

Usé Codex para interpretar la consigna, revisar el pipeline existente y preparar los cambios de publicación y esta explicación. Se revisó el diff y se comprobó que los pasos finales quedan después de los tests y reportes. Quedan pendientes la corrida del PR, la corrida de main y la descarga anónima de ambos paquetes. Los commits y pushes los realizo personalmente.


### Bases de datos y conexión con Neon

Creé app_qa y app_prod en el mismo proyecto y rama de Neon, usando PostgreSQL 16 como en Compose. Ejecuté el script existente app/backend/migrations/001_init.sql desde SQL Editor, una vez en cada base. El script crea rooms y reservations y agrega tres salas iniciales. Comprobé current_database() y los conteos: tres salas y cero reservas en cada base. Crear el esquema manualmente es suficiente para este TP; futuras modificaciones requerirán gestionar migraciones. Las bases comparten el rol propietario: los datos están separados, pero las credenciales no limitan el acceso a una sola base.

El backend acepta DATABASE_URL para recibir la conexión completa del entorno de Render. Si existe, tiene prioridad sobre las variables DB_*; si no existe, conserva la configuración local anterior. node-postgres recibe la URI con sus parámetros TLS, sin agregar una configuración SSL contradictoria ni incluir contraseñas en el código. La conexión real desde Render queda pendiente de comprobar.

La primera publicación desde main falló con permission_denied: read_package porque los paquetes existentes no tenían habilitado el acceso del repositorio desde Actions. Se otorgó Write a ingsoft3-tp01 en Manage Actions access de ambos paquetes y se reejecutaron los jobs del mismo commit: finalizaron verdes. Los paquetes quedaron públicos y se comprobó su descarga sin credenciales.

Codex asistió en la adaptación de la configuración para Neon y en la documentación. Las credenciales se guardan fuera del repositorio. Los commits y pushes continúan siendo manuales.


### Configuración del frontend al arrancar e independencia de datos

Los backends de QA y PROD se crearon como Web Services Docker en Render, con el plan Free, raíz app/backend, puerto 3000, health check /api/health y Auto-Deploy desactivado. Cada servicio recibe su DATABASE_URL de Neon. Estas construcciones iniciales preparan los servicios; todavía no constituyen la evidencia de promoción disparada por Actions.

Se comprobó HTTP 200 en /api/health y /api/rooms de ambos servicios. Para verificar el aislamiento, se insertó la sala SOLO PROD TP6 directamente en app_prod mediante SQL Editor. La API de producción la devolvió y la de QA no: esto comprueba que no están utilizando la misma base. URLs de API: https://minireservas-api-qa.onrender.com y https://minireservas-api-prod.onrender.com. Los frontends y la automatización de despliegue siguen pendientes.

El frontend conserva /api como ruta relativa en su build Docker. La dirección concreta del backend deja de estar fijada en nginx.conf: default.conf.template se procesa al arrancar el contenedor con BACKEND_URL y DNS_RESOLVER. Por defecto utiliza http://backend:3000 y el DNS de Docker para mantener Compose. En Render se configurará la URL HTTPS de la API del entorno y un resolver público. proxy_ssl_server_name habilita SNI para la conexión HTTPS al backend. La imagen contiene los archivos del frontend y la plantilla; la dirección del backend y el resolver se pueden reemplazar sin reconstruirla. BACKEND_URL debe contener solo el origen, sin barra final ni /api.

Codex asistió con esta adaptación y su documentación. Se construyó minireservas-front-tp6:local una sola vez y se ejecutó con valores por defecto y con las URLs de QA y PROD. Se inspeccionaron las configuraciones generadas y nginx -t fue exitoso. Dos contenedores con el mismo identificador de imagen sirvieron /api/rooms a través de nginx: QA devolvió tres salas y PROD cuatro, incluyendo SOLO PROD TP6. La raíz del frontend también respondió. Se eliminaron los contenedores de prueba; falta desplegar los frontends en Render.


### Promoción automática a QA

El job deploy-qa depende de build-backend y build-frontend mediante needs: si falla cualquiera, no despliega. Su if exige push a main, por lo que los PRs verifican sin desplegar. environment: qa conecta el job a los dos environment secrets RENDER_HOOK_API_QA y RENDER_HOOK_FRONT_QA y al historial de deployments. QA no tiene required reviewers. Se comprobó que ambos nombres existen en ese environment; GitHub no permite recuperar sus valores.

Los hooks reciben &ref=$GITHUB_SHA para solicitar el commit de esta corrida en vez de la punta cambiante de main. Las respuestas del hook se descartan para evitar imprimir información innecesaria. Antes de llamar al proveedor se comprueba que ambos secrets tengan valor. Auto-Deploy permanece Off en los cuatro servicios según su configuración de creación, para que los próximos despliegues dependan del pipeline.

Después de solicitar ambos despliegues, el smoke prueba /api/health (incluye SELECT 1), /api/rooms (requiere el esquema), la raíz del frontend y /api/rooms a través de nginx. Reintenta hasta 30 veces, espera 20 segundos entre intentos y limita cada petición a 10 segundos. El tiempo total no es exactamente diez minutos: también incluye lo que tarde cada petición. Agotados los intentos, termina con exit 1 y falla el job. Los reintentos toleran arranques lentos y servicios dormidos.

Limitación: el hook acepta la solicitud antes de terminar la construcción de Render; mientras tanto puede responder la versión anterior, incluso si la construcción nueva falla. El smoke comprueba disponibilidad y conectividad, no la identidad del commit que corre. En la primera promoción se deben abrir Deploys de ambos servicios de QA y comprobar commit y estado Live. Render reconstruye desde el repositorio: coincide el commit solicitado, pero no se garantiza identidad con la imagen de GHCR. La verificación automática de versión y el despliegue del artefacto publicado quedan como evolución del TP7.

Los cuatro servicios iniciales ya respondieron por HTTP; el frontend de PROD devolvió SOLO PROD TP6 y el de QA no. Las pruebas manuales de escritura desde la interfaz siguen pendientes. Codex asistió con el job y la documentación; la corrida del PR y la primera promoción real se verificarán después de los commits y pushes manuales.


### Gate humano de producción

La primera promoción automática a QA terminó verde en la corrida https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39680368274 del commit cd1530b. Se comprobó en Deploys de ambos servicios de QA que el disparador fue Deploy Hook y que el commit cd1530b quedó Live. El backend mostró 24,7 segundos y el frontend 23,7 segundos de duración de despliegue; estos tiempos corresponden a QA, no a la prueba de rollback pendiente de producción.

El environment production exige a Vargass21 como reviewer, permite self-review para trabajar individualmente y no permite bypass de administradores. Se verificaron las reglas guardadas mediante la API de GitHub y la existencia de los secrets RENDER_HOOK_API_PROD y RENDER_HOOK_FRONT_PROD dentro del environment. Sus valores deben corresponder a los servicios de producción y se comprobarán en Render sin publicarlos.

El job deploy-prod depende de deploy-qa: solo continúa después de su éxito y, en PRs, queda salteado porque QA también se saltea. environment: production hace que GitHub espere la aprobación antes de ejecutar los pasos y permitir el acceso a los secrets de ese entorno. Se implementa Continuous Delivery: la entrega está automatizada, pero la decisión de llegar a producción es humana. Continuous Deployment quitaría esa aprobación; no es lo implementado.

Antes de aprobar reviso la corrida y su commit, los checks de ambas aplicaciones, el resultado y los reintentos del smoke de QA, el estado Live y commit de ambos servicios de QA, el alcance del cambio, la separación de las bases y la disponibilidad de una versión anterior para recuperar el servicio. También reviso que no haya una corrida más nueva ya desplegada. La aprobación agrega una decisión informada de oportunidad y riesgo; no reemplaza tests ni monitoreo. Con el smoke actual no se verifica automáticamente la versión ejecutada ni todas las reglas de negocio.

La concurrencia deploy-prod con cancel-in-progress: false evita que se ejecuten simultáneamente jobs de despliegue de producción dentro del grupo. No se utiliza como garantía de orden de las aprobaciones ni de finalización del build remoto: los hooks son asíncronos. Si hay una aprobación obsoleta, debo rechazarla antes de aprobar una más nueva. Ambos hooks reciben el SHA del commit aprobado, aunque main haya avanzado durante la espera.

El smoke de PROD prueba las mismas cuatro rutas que QA, con reintentos y límites por petición. Conserva la limitación de poder responder contra la versión anterior: también se comprobarán commit y estado Live en Render. Se requieren dos corridas: la primera será rechazada con un motivo propio basado en lo observado; una segunda, con un cambio visible en el frontend, permitirá comprobar la aprobación y llegada del cambio. Ambas evidencias siguen pendientes y no se declaran realizadas.

Codex asistió con el job de producción y estas explicaciones; los commits, pushes y decisiones de aprobación o rechazo los realizo personalmente.


### Rechazo y comprobación funcional de QA

La corrida https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39682036907 del commit 5232df9 dejó PROD esperando revisión después de QA verde. Rechacé la promoción porque faltaba probar la creación de una reserva desde la interfaz de QA; el motivo quedó escrito en Review deployments. La corrida terminó fallida por la decisión humana y no ejecutó el despliegue de producción.

Después creé desde la interfaz de QA la reserva de Vargas, Sala A, para el 22 de octubre de 2026 de 18:00 a 20:00, con dos personas. La consulta posterior a la API de QA confirmó la reserva persistida como PENDIENTE; la API de PROD devolvió una lista vacía. Esto resolvió la comprobación funcional pendiente y volvió a confirmar la separación de datos.

También se observó el límite del smoke: el job de QA de esa corrida duró tres segundos, mientras Render mostró despliegues de 23,8 segundos en frontend y 23,9 segundos en backend. El smoke no esperó la finalización de las nuevas construcciones. Se verificó después en ambos servicios que el commit 5232df9 estaba Live.

Para la siguiente corrida se agregó debajo del título el texto visible: Organizá tus reuniones: consultá salas y reservá tu horario. Este cambio permitirá comprobar en QA y, tras aprobar, en PROD que la interfaz nueva llegó. La aprobación y la llegada efectiva a PROD siguen pendientes. Codex asistió en el cambio y la documentación; no realizó la aprobación, el rechazo, commits ni pushes.

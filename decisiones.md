## Enlaces del TP7

- **Imágenes públicas:** [backend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-backend) y [frontend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-frontend). Ambas tienen la etiqueta `sha-7c449be95a116d30080a792eb851e9449923d3fc` de la corrección desplegada.
- **Demostración del bloqueo:** [commit que rompió el frontend](https://github.com/Vargass21/ingsoft3-tp01/commit/52f26606be25bb8e258473116a5470522b417085), [corrida roja](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385), [reporte de integración verde](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385/artifacts/12569431490) y [reporte e2e rojo](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385/artifacts/12569991659).
- **Corrección y promoción a PROD:** [corrida completa verde](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40118029340), commit `7c449be95a116d30080a792eb851e9449923d3fc`.
- **QA:** [aplicación](https://minireservas-front-qa.onrender.com) y [API](https://minireservas-api-qa.onrender.com/api/health). **PROD:** [aplicación](https://minireservas-front-prod.onrender.com) y [API](https://minireservas-api-prod.onrender.com/api/health). Deben seguir disponibles hasta la defensa.
- **Release:** pendiente crear `v7.0.0` después de integrar y desplegar este cierre documental.

## Enlaces de este TP

- **TP6 — PR con tests verdes y login al registry salteado:** [job backend del PR #28](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39658685810/job/119425669436). El [job frontend](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39658685810/job/119425668804) muestra el mismo comportamiento.
- **TP6 — Corrida de main que publica al final:** [job backend de main, intento exitoso](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39659895341/job/119434626083). La publicación es el último paso propio, después de tests y reportes.
- **TP6 — Paquetes públicos etiquetados por commit:** [backend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-backend) y [frontend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-frontend), ambos con etiqueta `sha-7c3351128749130ad1973d2dc6d681031d8a698e`. Se consultaron sus manifiestos sin credenciales personales y se comprobó manualmente la descarga con docker pull después de docker logout ghcr.io.
- **TP6 — URLs de QA y PROD:** [frontend QA](https://minireservas-front-qa.onrender.com) y [frontend PROD](https://minireservas-front-prod.onrender.com). APIs: [QA](https://minireservas-api-qa.onrender.com/api/health) y [PROD](https://minireservas-api-prod.onrender.com/api/health). Promoción por Actions comprobada en QA y PROD, con aprobación humana para producción.

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

## TP6 — Entrega continua

### Pipeline y entornos

Implementé Continuous Delivery: QA se actualiza automáticamente y PROD necesita mi aprobación. Continuous Deployment no tendría ese paso humano. Lo mantuve porque necesito revisar la aplicación antes de publicarla.

Las dos imágenes se publican en GHCR con la etiqueta sha-<commit>. La garantía tiene tres partes: main exige los checks verdes, solo main publica y publicar es el último paso del job que ejecuta los tests. Si publicara con tests fallidos, el registry dejaría de representar versiones verificadas. Esto no impide una publicación manual con permisos. Comprobé la descarga de ambos paquetes sin credenciales.

Usé cuatro servicios Docker en Render, todos con Auto-Deploy Off, y dos bases en Neon: app_qa y app_prod. Creé las tablas ejecutando el SQL del proyecto en cada base. La sala SOLO PROD TP6 aparece únicamente en PROD; una reserva creada desde QA persistió al recargar y no apareció en PROD. Así comprobé la separación de datos.

La imagen del frontend contiene la aplicación y una plantilla de nginx. BACKEND_URL y DNS_RESOLVER se reciben al arrancar; DATABASE_URL se configura en cada backend. Probé la misma imagen local apuntando a ambas APIs. Las bases comparten propietario, aunque sus datos están separados.

### Promoción y aprobación

needs hace que QA espere los dos builds y que PROD espere a QA. El if permite desplegar solo desde un push a main. Cada job usa su environment: qa guarda los hooks de QA y production los de PROD. Los secrets de producción quedan disponibles para su job después de aprobar. GITHUB_TOKEN publica las imágenes con permisos por job.

Los hooks reciben &ref=$GITHUB_SHA para desplegar el commit verificado, aunque main avance. concurrency evita jobs de PROD simultáneos, pero debo rechazar aprobaciones viejas para no retroceder de versión.

Antes de aprobar reviso checks, smoke, commit Live en ambos servicios QA y funcionamiento de la interfaz. [Rechacé una corrida](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39682036907) porque faltaba probar la creación de una reserva. Después hice esa prueba y [aprobé la siguiente](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/39683365010): el subtítulo nuevo apareció en PROD y ambos servicios quedaron Live con 7ccef78.

### Smoke y límites

El smoke comprueba /api/health, /api/rooms, la página y el acceso a la API desde nginx. Hace hasta 30 intentos, con espera de 20 segundos y timeout de 10 por petición; si no responde, falla. Esto tolera el arranque lento, pero no prueba todas las reglas de reservas ni identifica la versión.

Lo vi en una corrida: QA dio verde en tres segundos y Render tardó unos 24 en desplegar. Estaba respondiendo la versión anterior. Por eso también revisé el commit Live en Render. Además, Render reconstruye el código: es el mismo commit, pero no garantiza la misma imagen de GHCR. Una dependencia podría cambiar entre construcciones; desplegar esa imagen queda para TP7.

Render comparte 750 horas mensuales entre los cuatro servicios y ofrece 500 minutos de construcción en Hobby. Los servicios duermen y pueden tardar unos 50 segundos o más en despertar; por eso uso reintentos y no pings permanentes. Presupuesté 240 horas para dos horas diarias por servicio y 200 minutos para diez promociones de cuatro builds de cinco minutos. Son estimaciones: debo revisar Billing y mantener las URLs hasta la defensa. Sin cuota pueden suspenderse servicios o builds, aunque la versión vieja siga respondiendo. [Límites](https://render.com/docs/free) y [builds](https://render.com/docs/build-pipeline).

Neon también pausa el cómputo y ambas bases comparten recursos. La consola mostró 1 GB gratuito por proyecto, según la [actualización de octubre](https://neon.com/blog/neon-free-plan-1-gb-per-project).

### Estrategia y rollback

Para usuarios reales elegiría blue-green: preparar otra instalación y cambiar el tráfico después de probarla permite volver rápido. Cuesta mantener ambas y hoy faltan enrutamiento, métricas de errores, tiempos de respuesta y alertas. Las migraciones de base deben ser compatibles con las dos versiones. No implementé ese patrón en este TP.

Ante un fallo, identifico el servicio afectado, busco la última versión buena en Render Deploys, selecciono Rollback, espero Live y verifico interfaz y API. Si afecta al backend, también debo recuperar una versión compatible.

Probé volver el frontend de 7ccef78 a a17b2fd: desapareció el subtítulo. Render midió **10,8 segundos** en el [rollback](https://dashboard.render.com/web/srv-dbciq0vavr4c73d13gc0/deploys/dep-dbcjfi59fdbs73a2pbrg). Luego [restauré 7ccef78](https://dashboard.render.com/web/srv-dbciq0vavr4c73d13gc0/deploys/dep-dbcjh04s728c73f875fg) y el texto volvió. Medí solo el frontend usando un despliegue guardado; no diagnóstico, backend ni reconstrucción. El rollback manual de Render no pasa por el gate de GitHub. Los datos no cambian: recuperarlos requeriría backups y otro procedimiento.

### Problemas y uso de IA

La publicación falló con permission_denied: read_package. Lo resolví dando acceso Write al repositorio en Manage Actions access de ambos paquetes y repitiendo los jobs. También adapté las rutas app/backend y app/frontend, agregué DATABASE_URL para Neon y reemplacé la dirección fija de nginx por la plantilla.

Usé ChatGPT y Codex para entender la consigna, preparar configuración y workflows y redactar la documentación. Lo comprobé con tests, Docker, consultas HTTP, la reserva en QA, Actions y el rollback real. Hice personalmente los commits, pushes y las operaciones en las plataformas. El PR #26 del TP5 sigue abierto sin cambios.

El TP6 quedo cerrado: esta documentacion se integro mediante el PR #34, la corrida 39686145820 llego a PROD y el tag y la release v6.0.0 apuntan al commit 64e8e8b20d72de273cfc32358fb1e93c3600d3d2.

## TP7 — Contenedores, integración y e2e

### Imágenes y despliegue

En TP6 Render reconstruía la app para cada entorno. Aunque fuera el mismo código, una dependencia podía cambiar entre builds. Ahora el pipeline construye y publica las imágenes una vez y usa `imgURL` para indicar cuáles ejecutar en QA y PROD. Eso es build once, deploy many.

Cambié la fuente de los cuatro servicios existentes a Existing Image. Conservé sus URLs, variables e historial. Configuré como punto de partida las imágenes `sha-64e8e8b20d72de273cfc32358fb1e93c3600d3d2`; después cada corrida indica su propia etiqueta mediante el hook. Por eso la imagen configurada inicialmente puede ser distinta de la que está corriendo. En Events compruebo que el despliegue diga Triggered via Deploy Hook, nombre la etiqueta de la corrida y quede Live. El smoke solo comprueba que responde: podría responder la versión anterior si el deploy falló.

Uso `sha-<commit completo>` para relacionar las imágenes con su código. No publico `latest` porque cambia de destino y no identifica una versión concreta. También se puede sobrescribir una etiqueta `sha-`; el digest es el que identifica el contenido exacto. `v7.0.0` será el nombre de la entrega en Git y debe apuntar al commit activo en PROD, no necesariamente al último de main. Con `git rev-list -n1 v7.0.0` obtengo el commit y de ahí la etiqueta de ambas imágenes.

El frontend usa `/api` y nginx recibe `BACKEND_URL` y `DNS_RESOLVER` al arrancar. Cada backend tiene su `DATABASE_URL`. Así la misma imagen sirve en QA y PROD cambiando la configuración del entorno.

### Pruebas elegidas

Elegí salas porque son el catálogo necesario para reservar. En integración pruebo alta, consulta y borrado; nombre vacío rechazado con 400 sin crear nada; y conservación del nombre, capacidad y estado al consultar nuevamente. En e2e pruebo creación y borrado desde la pantalla, error por nombre vacío y persistencia de la sala y su capacidad al recargar. La tercera de cada suite protege los datos que el usuario necesita para elegir una sala disponible y con capacidad suficiente. Agregué el botón de borrado usando el endpoint que ya existía.

Integración usa `request` de Playwright contra la API pública de QA y PostgreSQL real, sin navegador ni dobles. Es integración amplia: aprovecha QA y comprueba también el sistema desplegado, pero depende de la red y de un entorno compartido. La estrecha levantaría una API y una base descartables para cada corrida; aislaría mejor los datos, con más configuración.

Las e2e usan un navegador contra el frontend de QA. No repito todas las combinaciones de horarios o transiciones de reservas en ninguna de estas suites: esas reglas ya tienen unitarios. Estos casos tampoco cubren todo el proceso de reservas. Cada alta usa hora y UUID para evitar choques; después borro lo creado y compruebo su ausencia.

### Bloqueo de producción y problemas encontrados

La cadena quedó `deploy-qa → integracion → e2e → aprobación → deploy-prod`. Si integración falla, e2e no corre. Si e2e falla, PROD no pide aprobación. Cada suite publica su reporte incluso cuando falla.

Para demostrarlo cambié solo el formulario: enviaba `title` en vez de `name`. Los unitarios y el smoke pasaron. Integración tuvo 3 passed; e2e, 2 failed y 1 passed; PROD quedó salteado. Revisé ambos reportes: la traza mostraba el POST con `title` y la respuesta 400. La API funcionaba con el dato correcto, pero el frontend lo enviaba mal. Restauré `name` sin modificar los tests. La siguiente corrida tuvo 3 passed en cada suite y llegó a PROD después de mi aprobación.

En una prueba local, el selector confundió el ID 7 con la capacidad 7. Pasó al reintentar: era un flaky, un test que pasa y falla sin cambiar el comportamiento probado. Lo corregí buscando la columna de capacidad dentro de la fila correspondiente y repetí las pruebas sin reintentos. Para el arranque lento uso el smoke previo, 60 segundos por test, 15 por aserción y un retry, sin sleeps fijos. Reintentar no reemplaza investigar un flaky.

GitHub también demoró una corrida y devolvió 502/504 al consultar sus logs. Esperé a que terminara y después descargué los reportes. Ese problema fue distinto del error del formulario.

QA es compartido: otro merge puede cambiar la imagen mientras corren las pruebas. Por eso hago un merge por vez hasta que terminen ambas suites. Si se solapan, rechazo la promoción anterior con motivo y uso la posterior; no repito los tests viejos contra otra imagen. La concurrencia de PROD no evita ese problema. Los reportes se guardan 30 días; debo conservarlos disponibles hasta la defensa.

### Uso de IA y cierre

Usé Codex para entender la consigna y ayudar con configuración, pruebas, botón de borrado y documentación. Lo verifiqué con los unitarios, el build, las seis pruebas locales con PostgreSQL, los reportes y las corridas reales en QA. Hice personalmente los commits, pushes y las operaciones en GitHub y Render. El PR #26 sigue abierto sin cambios.

Falta integrar y desplegar este cierre documental y crear el tag y la release `v7.0.0` sobre el commit que quede activo en PROD, comprobándolo en Deployments y Events.

## TP8 — Infraestructura como Código

Elegí Terraform con los providers Neon (`kislerdm/neon` 0.18.0) y Render (`render-oss/render` 1.9.1). Creé preprod con las imágenes del TP7 y recursos separados de QA y producción. La conexión a la base y la dirección de la API se obtienen de los recursos creados. El estado queda en mi máquina y no se sube porque contiene contraseñas.

El problema fue que la base nueva no tenía tablas: la imagen del backend del TP7 no incluía las migraciones ni las creaba al arrancar. Lo resolvimos agregando un paso en Terraform que ejecuta el SQL existente con un contenedor temporal de PostgreSQL antes de crear la API. Comprobamos la solución consultando las salas y creando una reserva desde el frontend.

Usé Codex para entender la consigna, preparar Terraform y corregir los problemas. Codex ejecutó las verificaciones: pasaron las seis pruebas del TP7 y una reserva creada desde el frontend persistió al recargar. También comprobó que el segundo plan no propusiera cambios, que Terraform reparara la base borrada a mano y que preprod pudiera destruirse y recrearse. QA y producción siguieron funcionando. Dejamos preprod destruido para liberar cuota. Los commits y push los hice yo; el PR #26 sigue abierto sin cambios.

## TP9 — DevSecOps y observabilidad

Integré el [PR #43 de Dependabot](https://github.com/Vargass21/ingsoft3-tp01/pull/43), que actualiza `actions/checkout` de v6 a v7. Lo acepté después de revisar los cambios y comprobar que el pipeline estaba en verde. Las restricciones nuevas no afectaban los eventos que usa mi workflow.

El monitor tardó 5 minutos en avisarme: suspendí el backend a las 22:52 y recibí DOWN a las 22:57. Lo reanudé y recibí UP a las 23:02; después pausé el monitor. En Sentry, crear reservas fue lo más lento (`POST /api/reservations`, P95 de 195,17 ms). Consultarlas y cambiar su estado empataron como las operaciones de negocio más usadas, con 0,0333 solicitudes por minuto cada una. Como había pocos datos, creé la [tarjeta #61](https://github.com/Vargass21/ingsoft3-tp01/issues/61) para investigar con una muestra mayor.

CodeQL detectó que el health consultaba la base sin limitar las solicitudes. Lo resolvimos agregando límites y comprobamos que CodeQL marcara la alerta como corregida. En Sentry al principio solo aparecía QA: verificamos que producción enviara datos y, al actualizar el panel, apareció también PROD. Registramos el error de prueba y luego retiramos la ruta que lo provocaba.

Usé Codex para entender la consigna y ayudar con el código, la configuración y esta documentación. Lo verificamos con pruebas, builds y los resultados reales en GitHub, UptimeRobot y Sentry. Los commits y push los hago yo. El PR #26 sigue abierto y sin cambios.

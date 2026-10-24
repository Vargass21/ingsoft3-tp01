## Enlaces del TP7

- Rotura del front: [commit 52f26606be25bb8e258473116a5470522b417085](https://github.com/Vargass21/ingsoft3-tp01/commit/52f26606be25bb8e258473116a5470522b417085), [corrida roja](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385), [reporte integracion verde](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385/artifacts/12569431490) y [reporte e2e rojo](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40115531385/artifacts/12569991659).
- Primera cadena con ambas suites verdes y promocion aprobada: [corrida 40112818719](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40112818719), commit `8bfb1833b7f42ee4dae451d3e390f71fcdbcf5f2`.

- Cadena de imagenes QA → aprobacion → PROD: [corrida del PR #35 integrado](https://github.com/Vargass21/ingsoft3-tp01/actions/runs/40033629059), commit `4de25af6974c84eb09ba97f92652c5eff3fb7d33`.
- Paquetes publicos: [backend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-backend) y [frontend](https://github.com/users/Vargass21/packages/container/package/ingsoft3-tp01-frontend), etiqueta `sha-4de25af6974c84eb09ba97f92652c5eff3fb7d33` en ambos.
- Entornos: [frontend QA](https://minireservas-front-qa.onrender.com), [API QA](https://minireservas-api-qa.onrender.com/api/health), [frontend PROD](https://minireservas-front-prod.onrender.com), [API PROD](https://minireservas-api-prod.onrender.com/api/health).
- Pendientes para cerrar TP7: corrida completa posterior a la correccion, verificaciones de las imagenes en PROD y release `v7.0.0`.

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

## TP7 — Contenedores, integracion y e2e (en desarrollo)

### Imagenes y configuracion

El proveedor ya no reconstruye el codigo del commit como en TP6: el pipeline envia imgURL con las imagenes publicadas en GHCR. Una dependencia resuelta de nuevo podia hacer distintos los builds de QA y PROD; ahora ambos reciben el mismo par de imagenes. Los cuatro servicios existentes cambiaron su fuente a Existing Image, conservando sus URLs y variables. No se crearon servicios adicionales.

Las etiquetas sha-<commit completo> permiten relacionar ambas imagenes con el codigo que las produjo. No publico latest. Una etiqueta puede sobrescribirse: volver a construir una corrida vieja podria cambiar su contenido; el digest sha256 identifica el contenido exacto. Este TP promueve por etiqueta, como permite la consigna. La futura release v7.0.0 debe nombrar el commit efectivamente desplegado en PROD; git rev-list -n1 v7.0.0 permite obtener el commit y formar la etiqueta de sus imagenes.

La imagen inicial configurada en Render es sha-64e8e8b20d72de273cfc32358fb1e93c3600d3d2. Cada hook indica despues la etiqueta de su corrida sin actualizar esa configuracion inicial. En Events de los cuatro servicios se verifico Triggered via Deploy Hook y Live para sha-4de25af6974c84eb09ba97f92652c5eff3fb7d33. El smoke puede responder con la version anterior mientras se despliega: no identifica la imagen. Comparar automaticamente un commit incorporado a la imagen queda como concepto, sin implementarlo en este TP.

La misma imagen de frontend usa /api; nginx recibe BACKEND_URL y DNS_RESOLVER al iniciar. Cada API conserva DATABASE_URL de su entorno. Los destinos y los secretos no se incorporan a la imagen.

### Casos y verificacion local

Adapte los ejemplos de tareas a salas, que forman el catalogo necesario para reservar. La integracion usa request de Playwright: alta, consulta y borrado; nombre vacio rechazado con 400 sin alta; y conservacion del nombre, capacidad y estado en consultas posteriores. La tercera protege los datos que determinan que salas se pueden reservar y para cuantas personas. Usa la API con PostgreSQL real, sin dobles ni navegador. Al incorporarla a CI sera integracion amplia contra la API publica de QA: incluye el despliegue y evita preparar otra base en el job, pero depende de la red, la disponibilidad y el estado compartido del entorno.

Las e2e crean una sala y la borran; envian nombre vacio y comprueban el error sin nueva fila; y crean una sala, recargan y verifican que conserve su capacidad antes de borrarla. Agregue un boton accesible de borrado que utiliza el endpoint existente. Cada alta usa hora y UUID, y se limpia en finally. Se verifica la ausencia despues de borrar y de recargar. No se modifican salas preexistentes. Los casos invalidos comparan el estado anterior y posterior, por lo que requieren no ejecutar escrituras ajenas a la vez.

No repito todas las combinaciones de horarios, capacidad o transiciones de reservas en estas suites: las reglas aisladas ya tienen unitarios. Estos seis casos tampoco demuestran que todo el flujo de reservas este sano; esa es una limitacion de la cobertura elegida. Una integracion verde con e2e roja orienta a la interfaz o su conexion con la API para los casos cubiertos; una integracion roja deja las e2e sin ejecutar cuando se configure needs.

Playwright tiene timeout de 60 s por test, 15 s por asercion y un retry. No uso sleeps ni mocks de red. En CI el smoke previo despertara QA. Un flaky pasa y falla sin un cambio relevante: un retry no lo resuelve. En la primera prueba local un selector buscaba el texto 7 y confundia ID con capacidad; lo corregi seleccionando la columna Capacidad dentro de la fila de nombre unico. Luego las tres e2e pasaron sin retries. Tambien pasaron las tres integraciones, los 30 unitarios del frontend (65,44 % de lineas, sobre el minimo 60 %) y el build. Se inspeccionaron las trazas: POST 201, GET 200 y DELETE 204 en los flujos validos; POST 400 en el invalido. Los reportes y trazas generados se excluyen de Git y del contexto Docker.

QA es compartido: otro merge puede cambiar la imagen mientras una suite corre. Se debe trabajar con un merge por vez hasta que terminen ambas suites. Una corrida solapada no vale como evidencia de su imagen: se rechaza su promocion con motivo y se usa la posterior. No se reejecutan sus tests contra un QA que ya cambio. concurrency de PROD no protege esa ventana; entornos por corrida quedan fuera del TP.

### Uso de IA y pendientes

Use Codex para interpretar la consigna, adaptar los casos, preparar la configuracion, el boton de borrado y esta documentacion. Se verifico con unitarios, build, PostgreSQL en Compose, las seis pruebas locales y las trazas HTTP reales. Los commits, pushes y las operaciones en GitHub y Render los realizo personalmente. El PR #26 permanece abierto sin modificaciones.

Las suites ya estan configuradas en el mismo workflow: integracion necesita deploy-qa, e2e necesita integracion y deploy-prod necesita e2e. Cada suite publica su propio reporte incluso si falla; solo esos pasos usan !cancelled(), sin ignorar fallos de tests ni forzar el deploy. Los reportes se retienen 30 dias y se deben conservar vigentes hasta la defensa. Falta ejecutar esta configuracion en Actions contra QA desplegado, demostrar la rotura real del front y su correccion, publicar ambos reportes y cerrar con v7.0.0 sobre el commit de PROD. Las verificaciones locales son preparacion y no reemplazan esa evidencia.


### Demostracion del gate y diagnostico de los reportes

El PR #37 cambio solo RoomsPage.jsx: el formulario envio title en lugar de name. No se editaron specs ni el workflow. La corrida 40115531385 termino con builds y deploy-qa verdes, integracion con 3 passed, e2e con 2 failed y 1 passed, y deploy-prod skipped sin solicitar aprobacion. El smoke estaba verde aunque no se podia crear una sala desde la pantalla.

Se descargaron los dos reportes y se inspeccionaron las trazas del retry. Network muestra POST /api/rooms con {"title":"e2e ...","capacity":7,"active":true} y respuesta 400. Las e2e de alta y persistencia no encontraron su fila; la validacion de nombre vacio siguio pasando. El reporte verde de integracion confirma que la API aceptaba altas correctas y guardaba y borraba en su base real. Juntos orientan al contrato entre frontend y API: el navegador envio un campo incorrecto. No significa que toda la API carezca de bugs, sino que los casos directos cubiertos funcionaban.

GitHub tuvo errores 502/504 al consultar esa corrida y no cargaba pasos ni logs durante parte de la espera. Se dejo terminar sin cancelarla ni reconstruir otra vez el mismo commit; luego se recuperaron los reportes. La demora no se utilizo como evidencia de un fallo de la aplicacion: la evidencia es la traza HTTP y la cadena final.

La correccion restaura name en el formulario, sin modificar tests. Las seis pruebas pasaron localmente sin reintentos contra Compose. Todavia falta que su nueva corrida complete QA, ambas suites y la promocion aprobada a PROD para cerrar la secuencia rojo → fix → verde.

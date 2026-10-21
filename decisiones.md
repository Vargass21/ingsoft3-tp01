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

# TP8: preprod con Terraform

Este directorio administra únicamente recursos nuevos de preprod. No importa ni
modifica QA o producción y no cambia el pipeline del TP7.

## Requisitos

- Terraform >= 1.5 y < 2.0 (verificado localmente con 1.17.0).
- Docker Desktop funcionando con contenedores Linux, para inicializar el esquema.
- Windows PowerShell (`PowerShell.exe`), utilizado por el provisioner local.
- Variables de entorno `NEON_API_KEY`, `RENDER_API_KEY` y `RENDER_OWNER_ID`.
  No guardar sus valores en Git ni pegarlos en el chat.
- Acceso a Neon, Render, Docker Hub y las imágenes públicas de GHCR del TP7.

En esta máquina se instaló Terraform sin modificar el PATH global. Desde la raíz,
en PowerShell se puede habilitar para la sesión actual:

```powershell
$env:Path = "$env:LOCALAPPDATA\CodexTools\terraform\1.17.0;$env:Path"
```

En esta máquina las claves se guardaron cifradas con el usuario de Windows,
fuera del repositorio. Para cargarlas junto con Terraform en una sesión nueva:

```powershell
. "$env:LOCALAPPDATA\CodexTools\tp8\Load-Environment.ps1"
```

Ese archivo local carga `credentials.clixml` mediante DPAPI; no se sube a Git
y no es portable a otra cuenta o máquina. En otra máquina se deben cargar las
variables con sus propias credenciales. `neon_org_id` identifica la organización,
no es un secreto. La región de Neon se fija en Ohio para no depender del valor
por defecto del proveedor.

## Creación

Con las credenciales cargadas en la terminal:

```powershell
Set-Location infra
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

Revisar el plan antes de confirmar. En la creación inicial se esperan tres
recursos de Neon, dos servicios de Render y un `terraform_data` local que ejecuta
el SQL. Ninguno debe corresponder a QA o producción.

El proyecto, rol y base de Neon son propios de preprod. `terraform_data.schema`
ejecuta `app/backend/migrations/001_init.sql` con un contenedor temporal de
PostgreSQL. La contraseña se transmite mediante variables de entorno, sin
incluirla en la línea del comando. Si la inicialización falla, el apply debe
fallar; resolver la causa y repetirlo antes de continuar.

Este paso es necesario porque el backend del TP7 no incluye el SQL ni crea tablas
al arrancar. Es una adaptación explícita para este proyecto: el provisioner usa
un comando imperativo para inicializar el esquema, no convierte a Terraform en
un gestor general de migraciones. El SQL actual admite repetición mediante
`IF NOT EXISTS` y `ON CONFLICT`. Para futuros cambios de esquema se necesitará
un sistema de migraciones, no basta con editar este SQL.

La API espera esa inicialización. Su `DATABASE_URL` se deriva de Neon; el
`BACKEND_URL` de nginx se deriva de la API nueva. Las dos imágenes se fijan al
commit `a43fa532713f4ca36b3eb6687913ed745b12a762`, correspondiente a `v7.0.0`.

## Comprobación

```powershell
$preprodApi = terraform output -raw api_url
$preprodFront = terraform output -raw front_url
Invoke-RestMethod "$preprodApi/api/health"
Invoke-RestMethod "$preprodApi/api/rooms"
Invoke-RestMethod "$preprodFront/api/rooms"
Start-Process $preprodFront
terraform plan
```

Los servicios gratuitos pueden tardar en despertar. Reintentar las consultas
cuando terminen de arrancar. `/api/health` ejecuta `SELECT 1`: en esta app también
comprueba la conexión. `/api/rooms` comprueba además las tablas y los datos.
Verificar en el navegador el catálogo y la creación de una reserva en preprod.
El segundo plan debe mostrar `No changes`.

## Destrucción y recreación

```powershell
terraform plan -destroy
terraform destroy
terraform apply
```

Comprobar que desaparecieron exclusivamente los recursos de preprod. Después de
recrearlo, volver a obtener las URLs con `terraform output` y repetir las pruebas.
Se recrea la configuración; los IDs, contraseñas y URLs pueden variar. Los datos
de la base destruida no se recuperan: se vuelve a ejecutar el SQL inicial.

Al terminar la sesión destruir preprod para liberar cuota. Llegar a la defensa
con preprod destruido y las credenciales disponibles para crearlo en vivo.

## Estado y entrega

El estado queda en `infra/terraform.tfstate`. Contiene secretos: conservarlo
protegido localmente y no subirlo. No borrar el estado mientras existan recursos.
Si se pierde, hay que recuperar la asociación mediante importación.

Se versionan los `.tf`, este README y `.terraform.lock.hcl`. No se versionan
`.terraform/`, `*.tfstate*`, `*.tfvars*` ni planes binarios `*.tfplan`.

La práctica incluyó creación real, idempotencia, drift sobre la base, recurso
ajeno al HCL, protección temporal y destrucción/recreación. Se probaron las seis
pruebas del TP7 contra preprod y una reserva desde el navegador. QA y PROD
respondieron sin cambiar sus recursos. No se agrega un workflow opcional de IaC.

La configuración final volvió a dar `No changes`, health y consultas 200 y
catálogo visible en navegador. Se ensayaron dos ciclos destroy/apply y se dejó
preprod destruido al cerrar la sesión. Render tardó en activar el frontend;
hubo 502 y timeouts transitorios antes de comprobar su funcionamiento.

Falta integrar mediante un PR nuevo y cerrar con tag y Release `v8.0.0`. Los commits y push los
realiza el alumno manualmente. El PR #26 debe permanecer abierto y sin cambios.

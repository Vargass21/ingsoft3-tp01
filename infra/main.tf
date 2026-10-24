terraform {
  required_version = ">= 1.5, < 2.0"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.18.0"
    }
    render = {
      source  = "render-oss/render"
      version = "1.9.1"
    }
  }
}

# Las credenciales se leen del entorno; no se escriben en estos archivos.
provider "neon" {}
provider "render" {}

resource "neon_project" "preprod" {
  name                      = "minireservas-preprod"
  org_id                    = var.neon_org_id
  region_id                 = "aws-us-east-2"
  history_retention_seconds = 21600
}

resource "neon_role" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "minireservas_preprod_owner"
}

resource "neon_database" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "minireservas_preprod"
  owner_name = neon_role.preprod.name
}

locals {
  database_url = "postgresql://${urlencode(neon_role.preprod.name)}:${urlencode(neon_role.preprod.password)}@${neon_project.preprod.database_host}/${neon_database.preprod.name}?sslmode=require"
}

# La imagen del TP7 no incluye migrations/. Se usa el SQL existente sin
# reconstruirla. El contenedor temporal se elimina al terminar, incluso si falla.
resource "terraform_data" "schema" {
  triggers_replace = [
    neon_project.preprod.id,
    neon_database.preprod.id,
    neon_role.preprod.id,
    filesha256("${path.module}/../app/backend/migrations/001_init.sql"),
  ]

  provisioner "local-exec" {
    interpreter = ["PowerShell.exe", "-NoProfile", "-NonInteractive", "-Command"]
    command     = "docker run --rm --env PGHOST --env PGPORT --env PGDATABASE --env PGUSER --env PGPASSWORD --env PGSSLMODE --env PGCONNECT_TIMEOUT --mount 'type=bind,source=${abspath("${path.module}/../app/backend/migrations/001_init.sql")},target=/schema.sql,readonly' postgres:16-alpine psql --set ON_ERROR_STOP=1 --file /schema.sql; exit $LASTEXITCODE"

    environment = {
      PGHOST            = neon_project.preprod.database_host
      PGPORT            = "5432"
      PGDATABASE        = neon_database.preprod.name
      PGUSER            = neon_role.preprod.name
      PGPASSWORD        = neon_role.preprod.password
      PGSSLMODE         = "require"
      PGCONNECT_TIMEOUT = "30"
    }
  }
}

resource "render_web_service" "api" {
  name   = "minireservas-api-preprod"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = "ghcr.io/vargass21/ingsoft3-tp01-backend"
      tag       = var.image_tag
    }
  }

  env_vars = {
    DATABASE_URL = { value = local.database_url }
    PORT         = { value = "3000" }
  }

  depends_on = [terraform_data.schema]
}

resource "render_web_service" "front" {
  name   = "minireservas-front-preprod"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = "ghcr.io/vargass21/ingsoft3-tp01-frontend"
      tag       = var.image_tag
    }
  }

  env_vars = {
    BACKEND_URL  = { value = trimsuffix(render_web_service.api.url, "/") }
    DNS_RESOLVER = { value = "8.8.8.8" }
  }
}

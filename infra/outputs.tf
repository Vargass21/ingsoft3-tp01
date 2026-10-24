output "api_url" {
  description = "API de preprod: comprobar /api/health y /api/rooms."
  value       = trimsuffix(render_web_service.api.url, "/")
}

output "front_url" {
  description = "Frontend de preprod conectado a su propia API."
  value       = render_web_service.front.url
}

output "db_host" {
  description = "Host de la base exclusiva de preprod, sin credenciales."
  value       = neon_project.preprod.database_host
}

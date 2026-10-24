variable "neon_org_id" {
  description = "Organización de Neon donde se crea el proyecto nuevo de preprod; no es una credencial."
  type        = string
  default     = "org-young-boat-74509272"
}

variable "image_tag" {
  description = "Imágenes publicadas para el commit de cierre del TP7 (v7.0.0)."
  type        = string
  default     = "sha-a43fa532713f4ca36b3eb6687913ed745b12a762"

  validation {
    condition     = can(regex("^sha-[0-9a-f]{40}$", var.image_tag))
    error_message = "Usar sha- seguido de los 40 caracteres del commit publicado."
  }
}

variable "region" {
  description = "Región de los nuevos servicios de preprod."
  type        = string
  default     = "oregon"

  validation {
    condition     = contains(["frankfurt", "ohio", "oregon", "singapore", "virginia"], var.region)
    error_message = "Elegir una región admitida por el provider de Render."
  }
}

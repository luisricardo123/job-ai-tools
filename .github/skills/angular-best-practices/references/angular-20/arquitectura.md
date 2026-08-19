# Angular 20 — Arquitectura

Proyecto **standalone-first** con signals estables como modelo de reactividad principal.

- No uses NgModules para código nuevo. Componentes, directivas y pipes son standalone por defecto (no hace falta `standalone: true`, ya es el default).
- Bootstrap vía `bootstrapApplication()` con `provideRouter()`, `provideHttpClient()`, etc. en `app.config.ts`.

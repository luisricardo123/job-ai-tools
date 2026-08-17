# Instrucciones

> Lectura obligatoria antes de generar o modificar código.
> - Si una regla aquí choca con lo que te piden, **detente y pregunta**.
> - Si necesitas un patrón no cubierto, **propónlo y espera confirmación**. No inventes convenciones.
> - Antes de darte por terminado, recorre el **Checklist de salida** del final.

<!-- HUECO: todo lo marcado con {{ }} lo rellena la entrevista o templates/profiles/hexagonal.md -->
<!-- ARQ: los {{ARQ_*}} los rellena la skill con las secciones de templates/profiles/hexagonal.md; ver SKILL.md -->

## Descripción del proyecto

**{{MF_NOMBRE}}** es un micro-frontend Angular (remote) que se integra con una shell (host)
usando {{FEDERATION}}. Parte del ecosistema del Framework Web del BCP.

- **Dominio funcional**: {{DOMINIO}}
- **Nombre del elemento**: `{{ELEMENT_NAME}}`
- **Path de rutas**: `{{RUTA_BASE}}`
- **Perfil de arquitectura**: {{ARQ_PERFIL_DESC}}

## Comandos esenciales

```bash
npm start              # servidor de desarrollo
npm run build:dev      # build desarrollo
npm run build:cert     # build certificación
npm run build:prod     # build producción
npm test               # pruebas unitarias con cobertura
npm run mock           # servidor mock
```

## Stack

- **Angular {{ANGULAR_VERSION}}**
- **{{FEDERATION}}** · **TypeScript {{TS_VERSION}}** · **RxJS {{RXJS_VERSION}}**
- `@bcp/ng-micro-frontends` — Core de micro-frontends
- `@bcp/stl-ui-components` — Web Components UI del BCP
- `@bcp/ng-forms` — Directivas y validadores de formularios
- `@bcp/ng-builder` — Builder personalizado

No subas versiones mayores de Angular, BCP ni federation por iniciativa propia. La versión
instalada es la fuente de verdad: si un componente no existe en esa versión, no lo uses.

---


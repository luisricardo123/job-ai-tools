# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este repo

`job-ai-tools` es una colección de **skills para agentes** (Claude Code / agentes FEM) orientadas al
desarrollo de micro-frontends Angular del ecosistema **BCP Framework Web**. Los artefactos son
instrucciones en markdown (`SKILL.md` + `references/` + `templates/`), no código de aplicación. No
hay `package.json`, build, lint ni suite de tests — no inventes esos comandos.

## Layout

Todas las skills viven en `.github/skills/<skill>/`, con `SKILL.md` en la raíz de su carpeta y el
detalle extenso en `references/` (y `templates/` en `init-frontend-conventions`). Las rutas
`references/...` / `templates/...` que aparecen dentro de un `SKILL.md` son siempre relativas a la
carpeta de ese mismo archivo.

Skills actuales: `angular-best-practices`, `bcp-design-system`, `evaluar-agente-fem`,
`frontend-id-standard`, `init-frontend-conventions`, `mock-serve`, `process-openapi`,
`spec-prototype`, `spec`.

## Comandos

El único ejecutable del repo es el extractor de contratos OpenAPI de la skill `process-openapi`:

```bash
node ".github/skills/process-openapi/scripts/extraer-openapi.mjs" \
  <spec.yaml|.json> --out .api-contracts/<nombre-api> [--nombre "<Título>"] [--tag <t>] [--path <patrón>] [--json]
```

Si el script sale con código distinto de cero (típicamente por no encontrar `js-yaml`/`yaml` y sin
acceso de red para `npx`), aplica el **modo fallback** documentado en
`references/casos-borde.md` de esa misma skill — nunca "arregles" a mano el `.md` generado dejando
el script desactualizado.

## Convenciones de autoría de skills

- Frontmatter YAML: `name`, `description` (en español, con disparadores explícitos de *cuándo usar*
  y a menudo *cuándo NO usar*), y opcionalmente `user-invocable: true` / `disable-model-invocation:
  true` cuando la skill solo debe invocarse explícitamente (`init-frontend-conventions` declara
  ambas; `spec-prototype` y `spec` solo `disable-model-invocation: true`). `bcp-design-system` es
  la excepción deliberada: no declara ninguna de las dos porque también debe poder auto-invocarse
  cuando la petición del usuario coincide con su `description` (el caso diario de crear/revisar una
  vista de BCP), además de invocarse explícitamente o leerse como archivo desde otra skill.
- Cada `SKILL.md` es un **enrutador delgado**: la decisión de qué hacer y lo compartido entre casos;
  el detalle extenso vive en `references/*.md`, con la instrucción explícita de cargar el archivo
  completo antes de usarlo y **no resumirlo de memoria** — son la fuente única. Contenido nuevo
  detallado va a `references/`, no a engordar el `SKILL.md`.
- **IDs estables como vocabulario compartido entre skills**: varias skills se citan por ID en vez de
  repetir el texto de la regla.
  - `C1-C16` (convenciones de layout/estilo), `A1-A7` (anatomía de página), `V-<COMPONENTE>#`
    (catálogo de variantes) y `M1-M4` (meta-reglas de uso del catálogo) viven en
    `.github/skills/bcp-design-system/references/`.
  - `R6-R10` (reglas de proceso propias de esa skill) viven en
    `.github/skills/spec-prototype/references/reglas-obligatorias.md`.
  - Al agregar una regla se añade un ID nuevo; **no se renumeran los existentes** porque otras
    skills los citan por ese número exacto (única excepción: una renumeración deliberada de
    `bcp-design-system` para dejarlos consecutivos, hecha a propósito y propagada a todas las citas).
- Reglas duras que se repiten en casi todas las skills y hay que preservar al editar cualquiera de
  ellas: no inventar (ante un vacío del catálogo o de lo que dijo el usuario, se pregunta, nunca se
  asume en silencio), no dejar placeholders sin resolver en el artefacto final, terminar el trabajo
  en el artefacto generado y **no ofrecer implementarlo/conectarlo** como paso siguiente, y agrupar
  los puntos de parada en una **única** llamada a `AskUserQuestion` en vez de preguntar de a uno.

## Cómo se relacionan las skills

- `spec-prototype` carga `bcp-design-system` (meta-reglas M1-M4 más C/A/V) y sus propias R6-R10
  antes de preguntar o escribir. Produce `.prototype-specs/<kebab>.md` y es agnóstica de stack:
  nunca menciona Angular, HTML ni nombres de librería.
- `bcp-design-system` es una skill de **referencia** pura y agnóstica de librería: nunca nombra
  paquete, componente, prop, evento ni token real (regla rectora M4) — eso lo resuelve el sistema de
  diseño instalado en cada proyecto destino.
- `angular-best-practices` primero determina la versión del proyecto (16 vs 20) y luego abre
  **solo** el archivo de área que toca (`arquitectura.md`, `componentes.md`, etc.) dentro de
  `references/angular-<versión>/`; lo común a ambas versiones vive en el `SKILL.md` raíz y no se
  repite en cada carpeta de versión.
- `init-frontend-conventions` genera el `AGENTS.md` de un micro-frontend nuevo concatenando
  `templates/sections/01-...` a `10-...` **en orden numérico** y rellenando los 5 placeholders
  `{{ARQ_*}}` con las secciones `## ARQ_*` de `templates/profiles/hexagonal.md` (único perfil de
  arquitectura soportado). Su tabla "Configuración fija del banco" fija además, por `name`, las
  demás skills que consumirá el micro-frontend generado (`spec`, `frontend-id-standard`,
  `angular-best-practices`, `process-openapi`, `mock-serve`, `bcp-design-system`, entre otras).
- `process-openapi` produce `.api-contracts/<nombre-api>/`, `evaluar-agente-fem` produce
  `.test-results/<nombre>.md`, `mock-serve` opera sobre una carpeta `mock-db/` en la raíz del
  proyecto destino (nombre y ubicación exactos son obligatorios para que el servidor la encuentre).
- `spec` es genérica (no exclusiva de BCP/Angular): guía una entrevista spec-driven en 4 fases y
  guarda el resultado en `specs/` del proyecto destino, apoyándose en `template.md` (mismo
  directorio) para la estructura.

## Invariantes de edición

- Los archivos de `.github/skills/init-frontend-conventions/templates/sections/*.md` se concatenan
  **tal cual**: el prefijo numérico define el orden final y las líneas en blanco de los bordes ya
  son parte del formato — no agregar ni quitar separación al editar uno.
- Los encabezados `## ARQ_*` de `templates/profiles/hexagonal.md` deben coincidir **exacto** (mismo
  nombre) con los placeholders `{{ARQ_*}}` que aparecen dentro de `templates/sections/` — hoy son
  `ARQ_PERFIL_DESC`, `ARQ_ESTRUCTURA_FEATURE`, `ARQ_DATA_ACCESS_SECCION`, `ARQ_NOMENCLATURA_FILAS` y
  `ARQ_CHECKLIST_ITEM`.
- La tabla "Configuración fija del banco" en `init-frontend-conventions/SKILL.md` nombra por su
  `name` a las demás skills del repo; renombrar una skill obliga a actualizar esa tabla.
- En `process-openapi`, si la salida generada se ve mal, se corrige el script
  (`scripts/extraer-openapi.mjs`), nunca el `.md` generado a mano — dejaría el script desactualizado
  respecto al artefacto.

## Estilo

Todo el contenido existente está en español (encabezados, tablas, ejemplos, mensajes de reporte).
Escribe contenido nuevo en español y con el mismo formato ya establecido: tablas para catálogos y
disparadores de "cuándo usar esta skill", bloques de ejemplo antes/después, y secciones explícitas
de "Reglas estrictas" / "Qué NO hacer" al cierre de cada `SKILL.md`.

## Commits

Todos los commits deben ser en español.

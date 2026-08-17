# Plantilla del contrato

Formato exacto de los archivos que produce `scripts/extraer-openapi.mjs` en
`.api-contracts/<nombre-api>/`. Es la fuente de verdad del formato: úsala tal cual en modo
fallback (lectura manual, sin script), y consúltala para saber qué escribir a mano en la Fase 2
(enriquecimiento) sobre el `README.md` ya generado.

## `README.md`

```markdown
# <Título del API>

Versión: <info.version>

## Servers
- `<url>` — <descripción, si la hay>
  (una línea por entorno declarado en "servers")

## Seguridad
- **<nombre del esquema>**: <type> (<scheme>)[, en <in> "<name>"]
  (una línea por esquema en components.securitySchemes; si no hay ninguno: "No se declaran
  esquemas de seguridad en la spec.")

## Índice de endpoints

| Método | Ruta | operationId | Resumen | Dominio |
|---|---|---|---|---|
| GET | `/financiamientos` | `listarFinanciamientos` | Lista financiamientos del cliente | [financiamientos](dominios/financiamientos.md#listarFinanciamientos) |
(una fila por endpoint, ordenadas por ruta y luego método — TODOS los endpoints del alcance, sin
excepción; el enlace de "Dominio" apunta al ancla del endpoint en su archivo de dominio)

## Huecos del contrato

- <cada hueco detectado automáticamente, uno por línea>
  (si no hay ninguno: "Ninguno detectado automáticamente.")

## Convenciones transversales

<Esta sección la completa el agente en la Fase 2 (enriquecimiento) del SKILL.md — no la deja
como placeholder. Cubre, cuando aplique: convención de paginación, envelope de respuesta común,
modelo de error real (más allá del genérico 4xx), formatos de fecha/moneda/código repetidos,
cabeceras obligatorias transversales, y qué esquema de seguridad se usa en la práctica.>
```

## `dominios/<dominio>.md` (uno por tag)

```markdown
# Dominio: <tag>

<a id="<operationId>"></a>
### <MÉTODO> <ruta>

**operationId:** `<operationId>`[ _(derivado, no venía en la spec)_ ]

[> ⚠️ **Deprecado.**]

<resumen/descripción, si la hay>

[**Seguridad:** <esquema1>, <esquema2>]

[**Parámetros de path**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `string` | sí | — |]

[**Parámetros de query** — misma tabla que "de path"]

[**Cabeceras** — misma tabla que "de path"]

[**Cuerpo de la petición** (`<content-type>`, requerido|opcional)

​```ts
<tipo TS del schema>
​```]

**Respuestas**

- **<código>** — <descripción>
  ​```ts
  <tipo TS del schema, si lo hay>
  ​```
(una entrada por código de respuesta declarado)

---
(separador entre endpoints del mismo archivo)
```

## `modelos.md`

```markdown
# Modelos

<a id="<PascalName>"></a>
### <PascalName>

<descripción, si la hay>

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `<nombre>` | `<tipo TS>` | sí\|no | <enum, format, minLength, maxLength, min, max, pattern — los
que apliquen, separados por coma, o "—"> | <descripción o "—"> |
(una fila por propiedad del schema ya aplanado — allOf resuelto, ver mapeo-tipos.md)

​```ts
export interface <PascalName> {
  "<campo>"[?]: <tipo TS>;
  ...
}
​```

---
```

Para un schema que es una unión (`oneOf`/`anyOf`) o un alias de tipo primitivo/array, en vez de
`interface` se genera un `type`:

```markdown
​```ts
export type <PascalName> = <MiembroA> | <MiembroB>;
​```

[Discriminador: `<propertyName>`.]
```

## `_meta.json`

```json
{
  "generadoEn": "<ISO timestamp>",
  "specOrigen": "<ruta absoluta al spec de entrada>",
  "swagger2Normalizado": true | false,
  "modo": "script" | "fallback",
  "contadores": { "endpoints": N, "dominios": N, "modelos": N, "huecos": N },
  "huecos": ["..."]
}
```

En modo fallback (sin script), escribe este archivo a mano con `"modo": "fallback"` y los mismos
campos — permite que una ejecución futura de la skill (o el propio usuario) sepa cómo se generó el
contrato y con qué limitaciones.

## Nombres de archivo

- Carpeta de salida: `.api-contracts/<nombre-api-en-kebab-case>/`. En la raíz solo van los tres
  archivos fijos y conocidos: `README.md`, `modelos.md`, `_meta.json`.
- Archivo de dominio: `dominios/<tag-en-kebab-case>.md` (p. ej. tag `financiamientos` →
  `dominios/financiamientos.md`; tag `Gestión de Pagos` → `dominios/gestion-de-pagos.md`). Todos
  los archivos por tag —cantidad y nombres variables según la spec— van en esta subcarpeta,
  separados de los archivos fijos de la raíz.
- El ancla de cada endpoint es literalmente su `operationId` (o el derivado/desambiguado), sin
  convertir a kebab-case — así el enlace desde el índice del `README.md` es directo
  (`dominios/<tag>.md#<operationId>`).

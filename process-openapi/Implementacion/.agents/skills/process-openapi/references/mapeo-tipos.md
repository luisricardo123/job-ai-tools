# Mapeo de tipos OpenAPI → TypeScript

Fuente de verdad de cómo `scripts/extraer-openapi.mjs` traduce cada schema OpenAPI a un tipo
TypeScript. Si generas o corriges algo a mano (modo fallback), sigue exactamente estas reglas —
no inventes una convención distinta para que el contrato sea consistente entre ejecuciones.

## Tipos primitivos

| OpenAPI | TypeScript |
|---|---|
| `type: string` (sin `format`) | `string` |
| `type: string, format: date-time` | `string /* ISO 8601 date-time */` |
| `type: string, format: date` | `string /* ISO 8601 date */` |
| `type: string, format: uuid` | `string /* uuid */` |
| `type: string, format: byte` | `string /* base64 */` |
| `type: string, format: binary` | `string /* binary */` |
| `type: integer` / `type: number` (sin `format: int64`) | `number` |
| `type: integer` / `type: number`, `format: int64` | `number /* int64 */` |
| `type: boolean` | `boolean` |

**No conviertas `int64` a `bigint`.** JSON no distingue enteros grandes de `number`; se anota como
comentario para que quien conecte el backend decida si necesita manejo especial (ej. si el backend
serializa el `int64` como string para evitar pérdida de precisión, es un `string`, no un
`number /* int64 */` — verifícalo contra un ejemplo real de respuesta si el dato es crítico).

## Arrays

`type: array, items: <schema>` → `<TipoDeItems>[]`. Los `items` se resuelven con las mismas reglas
de este documento (incluida la regla de `$ref` nombrado, ver abajo).

## Objetos

- `type: object` con `properties` → objeto inline `{ "campo": Tipo; "campo2"?: Tipo2; }`, o
  `interface` cuando el objeto es un schema nombrado en `components/schemas` (ver `modelos.md`).
- Un campo es opcional (`?`) si su nombre **no** aparece en `required` del schema que lo declara.
- `additionalProperties: <schema>` (no booleano) → `Record<string, <Tipo>>`.
- `additionalProperties: true` → `Record<string, unknown>`.
- Objeto sin `properties` ni `additionalProperties` ni `type` reconocible → `unknown`, y se
  reporta como hueco ("schema sin type/properties reconocibles").

## `$ref` — regla central para evitar ciclos

**Un `$ref` a un schema con nombre (`#/components/schemas/X`) nunca se expande inline: se traduce
directamente al nombre del tipo en PascalCase (`X`), que referencia la `interface`/`type`
correspondiente en `modelos.md`.** Nunca se sustituye por su contenido completo, ni siquiera la
primera vez. Esta es la razón por la que un schema autoreferenciado o con ciclo entre dos schemas
nombrados (`A` contiene `B`, `B` contiene `A`) se resuelve sin problema: en TypeScript una
`interface` puede referenciarse a sí misma o a otra por nombre sin causar recursión infinita, así
que el tipo generado es válido y compila.

Los schemas **anónimos/inline** (los que aparecen directamente embebidos en un `requestBody`, una
`response`, o como valor de `items`/`properties` sin pasar por un `$ref`) sí se expanden
recursivamente por completo, porque no tienen nombre con el que formar un ciclo.

Un `$ref` **externo** (a otro archivo, o a una sección no soportada como `#/parameters/...` o
`#/responses/...` en swagger 2.0 sin normalizar) no se resuelve: se traduce a
`unknown /* $ref externo no resuelto */` y se registra como hueco del contrato.

## `enum`

Se traduce a una unión de literales, no a un `enum` de TypeScript:

```yaml
type: string
enum: [ACTIVO, CERRADO, VENCIDO]
```
→
```ts
"ACTIVO" | "CERRADO" | "VENCIDO"
```

Motivo: no depende de que el proyecto destino use `enum` de TS (algunos linters lo prohíben) y es
directamente asignable/comparable contra el JSON real que devuelve el backend.

## `oneOf` / `anyOf` / `discriminator`

`oneOf`/`anyOf` se traduce a una unión de los tipos miembro: `MiembroA | MiembroB`. Si el schema
declara `discriminator.propertyName`, se anota junto al tipo (ver `modelos.md`) para que quien
conecte el backend sepa por qué campo distinguir en runtime cuál miembro llegó — el mapeo de tipos
no intenta generar el narrowing por sí solo.

## `allOf`

Se aplana: las `properties`/`required` de todos los miembros de `allOf` (incluidos los que llegan
vía `$ref` a otro schema nombrado) se combinan en un único objeto plano. Un miembro `$ref` dentro
de `allOf` se resuelve leyendo las propiedades de ese schema nombrado **una sola vez** (no se re-
expande recursivamente más allá de eso), lo que también evita ciclos en cadenas de herencia
(`A allOf B`, `B allOf C`, …).

## `nullable`

`nullable: true` agrega ` | null` al tipo ya calculado: `string | null`, `number[] | null`, etc.

## Naming

- Nombre de `interface`/`type`: el nombre del schema en `components/schemas`, convertido a
  PascalCase (`financiamiento_detalle` → `FinanciamientoDetalle`).
- Nombre de cada campo: se conserva literal, entre comillas, tal como viene del schema (no se
  convierte a camelCase) — el campo debe coincidir exactamente con la clave JSON real que envía el
  backend.

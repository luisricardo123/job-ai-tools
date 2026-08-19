# Casos borde

Cómo se maneja cada caso difícil, tanto en el script (`scripts/extraer-openapi.mjs`) como en el
modo fallback (lectura manual guiada). Consúltalo antes de decidir cómo tratar algo que no encaje
en el flujo normal — no inventes un criterio distinto al aquí descrito.

## Swagger 2.0

El script detecta `swagger: "2.0"` y normaliza antes de procesar:

- `definitions` → `components.schemas` (y todo `$ref: '#/definitions/X'` se reescribe a
  `#/components/schemas/X'` en toda la spec, no solo en el nivel superior).
- `host` + `basePath` + `schemes[0]` → `servers: [{ url }]`.
- `securityDefinitions` → `components.securitySchemes` (`type: basic` se traduce a `type: http`).
- Parámetro `in: body` → `requestBody.content['application/json'].schema`.
- `response.schema` → `response.content['application/json'].schema`.
- Parámetro `in: formData` **no** tiene equivalente directo — se deja el parámetro tal cual y se
  registra como hueco ("revisar manualmente"). Es poco común en specs REST modernas; si aparece,
  probablemente sea un endpoint de subida de archivos que necesita descripción manual en el
  `README.md` bajo "Convenciones transversales".
- `#/parameters/...` y `#/responses/...` compartidos (secciones separadas de swagger 2.0 sin
  equivalente en `components.schemas`) no se reescriben: si algo los referencia, cae en la regla
  general de "$ref interno no encontrado" y se reporta como hueco.

## `$ref` externos (a otro archivo)

No se resuelven — ni el script ni el fallback abren archivos fuera del spec de entrada. Se
traducen a `unknown /* $ref externo no resuelto */` y se listan en "Huecos del contrato". Si el
proyecto tiene varios archivos YAML relacionados (spec principal + fragmentos), pídele al usuario
que los combine primero o indícalo como limitación en el reporte final.

## Ciclos (self-reference o ciclo entre dos schemas)

Resuelto por diseño: ver "regla central" en `mapeo-tipos.md`. Un schema nombrado nunca se expande
más allá de sus propias propiedades directas; cualquier `$ref` que contenga se deja como
referencia por nombre. No hace falta detección explícita de ciclos porque la regla lo evita
estructuralmente — nunca hay una llamada recursiva que vuelva a expandir el mismo schema nombrado
dos veces en la misma cadena.

## Endpoint sin `operationId`

Se deriva de método + ruta (`get /financiamientos/{id}/pagos` → `getFinanciamientosIdPagos`) y se
marca explícitamente como derivado, tanto en el detalle del endpoint (`_(derivado, no venía en la
spec)_`) como en "Huecos del contrato". No falles ni te detengas por esto — es habitual en specs
generadas automáticamente.

## Endpoint sin `tags`

Se agrupa en el dominio `general`. Si `general` termina concentrando muchos endpoints dispares,
repórtalo en el reporte final como observación — puede valer la pena pedirle al usuario que
indique un agrupamiento manual, pero no lo asumas tú ni le agregues tags a la spec.

## `operationId` duplicado

Si dos operaciones distintas comparten `operationId` (spec inválida pero ocurre), se le agrega el
método como sufijo al segundo (`crearPago_post`) para poder generar un ancla única, y se registra
como hueco. El `operationId` documentado en la tabla y en el detalle del endpoint sigue siendo el
original de la spec — solo el ancla interna cambia.

## Respuesta sin schema

Normal en respuestas `204 No Content` y en redirecciones `3xx` — no se reporta como hueco. Para
cualquier otro código sin schema (incluido un `200`/`201` sin cuerpo documentado), se reporta como
hueco: puede ser un descuido de quien escribió la spec o un endpoint que de verdad no devuelve
cuerpo — no lo asumas, dilo explícitamente en el reporte.

## Varios `content-type` en `requestBody` o en una respuesta

Solo se documenta en detalle el primero de esta prioridad: `application/json` si existe, si no el
primero que aparezca en la spec. Los demás quedan listados como hueco ("con varios content-types,
solo se documentó X en detalle"). Si el proyecto realmente necesita `multipart/form-data` u otro
content-type no-JSON, indícalo en el reporte final como algo que requiere atención manual.

## `additionalProperties`

- Con schema (`additionalProperties: { type: string }`) → `Record<string, string>`.
- `additionalProperties: true` (o objeto sin `properties` y sin restricción) → `Record<string,
  unknown>`, y se reporta como hueco si además el schema no tiene ninguna propiedad fija — es
  común en mapas de configuración, pero vale la pena que el usuario confirme que es intencional.

## Specs muy grandes (cientos de endpoints)

Usa `--tag <t>` (repetible) o `--path <patrón>` (repetible, substring sobre la ruta) para generar
el contrato solo del subconjunto que se va a usar. Pregúntale al usuario por el dominio antes de
correr el script sin filtros sobre una spec enorme — genera archivos igual de grandes y consume
contexto igual de innecesario que el YAML crudo si no se filtra.

## `deprecated`

Se marca con `⚠️ **Deprecado.**` en el detalle del endpoint. No se excluye del índice ni del
contrato — el implementador debe poder verlo y decidir si migrar o no.

## `callbacks` / `webhooks`

No se procesan (son flujos server→server, no relevantes para un frontend consumiendo el API). Si
la spec los usa extensivamente para lo que se está construyendo, dilo en el reporte final: se
necesitaría extender el script para cubrirlos.

## Parámetros a nivel de `path` vs a nivel de operación

Se fusionan: los parámetros declarados al nivel del `path` (aplican a todos los métodos de esa
ruta) se combinan con los de cada operación; si coinciden en `name` + `in`, gana la definición de
la operación. Esto es transparente en el contrato final — cada endpoint documenta la lista ya
fusionada, sin distinguir de dónde vino cada parámetro.

## Entrada ya en JSON

Si el archivo de entrada tiene extensión `.json`, se usa `JSON.parse` directo — no se intenta
convertir YAML ni se necesita `js-yaml`/red en ese caso.

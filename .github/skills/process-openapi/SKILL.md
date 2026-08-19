---
name: process-openapi
description: >
  Úsala cuando el usuario tenga un spec OpenAPI o Swagger (openapi.yaml, swagger.json, v2 o v3)
  y necesite convertirlo en un contrato de API consultable: índice de endpoints, detalle por
  dominio y tipos TypeScript, con `$ref` resueltos y `allOf` aplanados, en
  `.api-contracts/<nombre-api>/`. Aplica aunque no use la palabra "contrato" — pedir preparar un
  swagger para conectar el front, documentar los endpoints de una API, o extraer los tipos de una
  spec. No la uses para escribir servicios, clientes HTTP ni código de conexión: solo produce el
  artefacto del contrato; implementar la conexión es una tarea posterior que se apoya en él.
---

# Contrato de API desde OpenAPI

Convierte un `openapi.yaml`/`swagger.yaml`/`.json` en un **contrato de API** legible y barato de
consultar para un agente: un índice (`README.md`) con la tabla de todos los endpoints, un archivo
de detalle por dominio/tag, y un archivo de modelos con los tipos TypeScript ya resueltos —
`$ref` expandidos, `allOf` aplanados, ciclos manejados sin recursión infinita.

**El trabajo termina en el artefacto.** No escribas servicios, modelos ni clientes HTTP en el
proyecto, y no propongas hacerlo al terminar — eso se pide como tarea aparte una vez que el
contrato existe.

## Por qué existe

Un `openapi.yaml` real tiene miles de líneas, fragmenta todo en `$ref` hacia
`components/schemas`, y mezcla ruido (ejemplos, extensiones de vendor). Pedirle a un agente que
conecte un frontend leyendo ese YAML crudo quema contexto y abre la puerta a que invente campos o
tipos. Esta skill hace ese procesamiento **una sola vez**; después, conectar un endpoint es leer
el `README.md` del contrato, saltar al archivo del dominio correspondiente, y usar los tipos ya
resueltos de `modelos.md` — sin volver a tocar el YAML.

## Artefacto que produce

En la raíz del proyecto (o donde indique el usuario), `.api-contracts/<nombre-api>/`:

```
.api-contracts/creditos/
├── README.md          índice + servers + auth + huecos + convenciones transversales
├── modelos.md         schemas nombrados, aplanados, con su interface/type TS
├── _meta.json         spec de origen, modo de generación, contadores, huecos
└── dominios/
    ├── financiamientos.md detalle de los endpoints del tag "financiamientos"
    └── pagos.md
```

El formato exacto de cada archivo está en `references/plantilla-contrato.md` — cárgalo antes de
generar o revisar cualquiera de estos archivos, tanto si corre el script como en modo fallback.
`references/ejemplo-contrato.md` muestra el formato ya resuelto sobre una spec pequeña con `allOf`
y autoreferencia.

## Procedimiento

### Fase 0 — Alcance

Ubica el spec de entrada y la carpeta del proyecto destino. Pregunta solo si hace falta —no lo
adivines cuando el resultado cambia el contrato:

- Si hay varias specs en el repo y no está claro cuál usar.
- Si la spec no tiene `tags` en casi ningún endpoint (todo caería en el dominio `general`) y
  parece que un agrupamiento manual sería más útil — confírmalo antes de correr el script.
- Si la spec tiene un volumen grande (varias decenas o cientos de endpoints): pregunta si el
  usuario quiere el contrato completo o solo ciertos dominios/rutas (`--tag`/`--path`), para no
  generar un artefacto tan pesado como el YAML crudo que se quiere evitar.

### Fase 1 — Extracción

Corre el script:

```
node "<ruta a la skill>/scripts/extraer-openapi.mjs" <spec.yaml|.json> --out .api-contracts/<nombre-api> [--nombre "<Título>"] [--tag <t> ...] [--path <patrón> ...] [--json]
```

El script hace todo el trabajo mecánico y determinista: normaliza swagger 2.0, resuelve `$ref`
internos, aplana `allOf`, agrupa por tag, genera los tipos TS (ver `references/mapeo-tipos.md`) y
escribe los cuatro archivos descritos arriba. Su salida por stdout resume contadores
(`endpoints`, `dominios`, `modelos`, `huecos`) — úsalos para el reporte de la Fase 4.

**No reescribas a mano lo que el script ya generó correctamente.** Si algo se ve mal, corrige el
script o repórtalo — no "arregles" el `.md` a mano dejando el script desactualizado respecto al
artefacto.

**Si el script falla** (sale con código distinto de cero — típicamente porque no hay
`js-yaml`/`yaml` instalado en el proyecto y `npx` no tiene acceso a red), actívese el **modo
fallback**: carga `references/casos-borde.md` y `references/plantilla-contrato.md`, y genera los
mismos archivos leyendo el spec tú mismo con `Grep`/`Read` por bloques —
**nunca cargues el YAML completo de una sola lectura si es grande.** Procedimiento del fallback:

1. `Grep` sobre `^  /` (o el patrón equivalente de indentación) para listar todas las rutas.
2. Por cada ruta, `Read` solo el bloque de esa operación (usa `offset`/`limit` si el archivo es
   grande) para extraer método, parámetros, `requestBody`, `responses` y tags.
3. Cada `$ref` a `components/schemas/X` (o `definitions/X` en swagger 2.0) se resuelve con
   `Grep` puntual sobre esa definición — nunca expandas un schema nombrado más de una vez ni lo
   sigas expandiendo dentro de sí mismo (misma regla que el script, ver "regla central" en
   `references/mapeo-tipos.md`): un `$ref` a un schema con nombre se traduce al nombre del tipo,
   nunca a su contenido inline.
4. Escribe `README.md`, `dominios/<dominio>.md`, `modelos.md` y `_meta.json` (con
   `"modo": "fallback"`) siguiendo `references/plantilla-contrato.md` exactamente.
5. Deja constancia en el reporte final de que se usó el modo fallback y por qué — es más lento y
   con más riesgo de omisión que el script, el usuario debe saberlo.

### Fase 2 — Enriquecimiento

El script deja la sección "Convenciones transversales" del `README.md` como placeholder. Sobre el
contrato ya generado, revisa la spec completa (o los archivos generados, que ya son más baratos de
leer) y complétala con lo que solo se ve mirando el API en conjunto — no endpoint por endpoint:

- Convención de paginación (`page`/`size`, `offset`/`limit`, cursor) y dónde vienen los totales.
- Envelope de respuesta común, si existe (p. ej. `{ data, meta }` repetido en varias respuestas).
- El modelo de error real usado en la práctica (más allá del `4xx` genérico de cada endpoint).
- Formatos de fecha, moneda o código que se repiten y no quedan explícitos en el tipo TS (p. ej.
  un `string` que en realidad siempre es un monto con dos decimales, o un código de país ISO).
- Cabeceras obligatorias transversales (más allá de `Authorization`) y qué esquema de seguridad
  aplica realmente en la mayoría de endpoints.
- Endpoints deprecados o con duplicidad aparente que valga la pena señalar.

Si algo de esto no se puede determinar con confianza leyendo la spec, no lo inventes: dilo como
observación en el reporte final o dentro de la propia sección (p. ej. "no se pudo determinar un
envelope de respuesta común — cada endpoint parece devolver su schema directo").

### Fase 3 — Verificación

Vuelve a leer los archivos generados y contrasta contra el spec original una muestra
representativa (no hace falta línea por línea, pero sí cubrir cada tipo de caso presente):

- El índice del `README.md` lista todos los endpoints del alcance (cuenta contra el número de
  operaciones reales en la spec, considerando los filtros `--tag`/`--path` si se usaron).
- Ningún `$ref` interno quedó sin resolver (todo lo interno se resolvió a un tipo o a un nombre de
  modelo; lo externo está listado en huecos, no silenciado).
- Cada tipo referenciado por nombre en un endpoint (`Financiamiento`, `Pago`, etc.) existe en
  `modelos.md`.
- Los campos `required` de cada modelo coinciden con la spec.
- Los huecos reportados por el script tienen sentido (no hay huecos "fantasma" ni huecos reales
  sin reportar).

### Fase 4 — Reporte y parada

Entrega el reporte (ver "Formato del reporte final"). Si detectaste huecos que **el usuario puede
resolver** — la spec no declara `servers`, hay varios esquemas de seguridad y no está claro cuál
usa el frontend, hay endpoints agrupados en `general` que convendría repartir en dominios reales —
agrúpalos en una sola llamada a `AskUserQuestion` y termina el turno ahí. Los huecos que son
defectos del propio API (una respuesta sin schema, un campo sin `type`) se reportan como
observación, no como pregunta — no son algo que el usuario deba decidir en este momento.

## Restricciones estrictas

- No escribas ni modifiques nada fuera de `.api-contracts/<nombre-api>/`.
- No generes modelos, servicios, clientes HTTP ni ningún código de conexión en el proyecto.
- No ofrezcas implementar la conexión al backend al terminar — el trabajo de esta skill acaba en
  el artefacto.
- No inventes un campo, tipo o endpoint que no esté en la spec. Si algo no se puede determinar,
  repórtalo como hueco.
- No modifiques el spec de entrada.
- En modo fallback, no cargues el YAML completo de corrido si es grande — lee por bloques.

## Formato del reporte final

```
Contrato de API generado.

Spec de origen: <ruta>
Modo: script | fallback (y por qué, si fue fallback)
Carpeta del contrato: .api-contracts/<nombre-api>/

Contadores:
- Endpoints: N
- Dominios: N (lista)
- Modelos: N
- Huecos: N

Verificación:
- Índice completo: sí/no (detalle si no)
- $ref sin resolver: ninguno / lista
- Modelos referenciados que faltan en modelos.md: ninguno / lista

Convenciones transversales detectadas (Fase 2):
- <lista breve>

Huecos del contrato (observación, no requieren decisión):
- <lista>
```

Si hay huecos que sí requieren decisión del usuario, preséntalos con `AskUserQuestion` inmediatamente
después de este reporte, con la lista concreta y una propuesta cuando sea posible.

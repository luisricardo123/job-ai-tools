# Ejemplo resuelto

Spec de entrada mínima (recorta lo no relevante) y el contrato que produce, para ver el formato
en un caso concreto. No copies el contenido — es solo referencia de formato y nivel de detalle.

## Spec de entrada (fragmento)

```yaml
openapi: 3.0.3
info:
  title: API de prueba
  version: 1.2.3
servers:
  - url: https://api.ejemplo.com/v1
    description: Producción
security:
  - bearerAuth: []
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer }
  schemas:
    Base:
      type: object
      properties:
        id: { type: string, format: uuid }
        creadoEn: { type: string, format: date-time }
      required: [id]
    Financiamiento:
      allOf:
        - $ref: '#/components/schemas/Base'
        - type: object
          properties:
            monto: { type: number, format: int64 }
            estado: { $ref: '#/components/schemas/EstadoFinanciamiento' }
            hijos:
              type: array
              items: { $ref: '#/components/schemas/Financiamiento' }  # autoreferencia
          required: [monto, estado]
    EstadoFinanciamiento:
      type: string
      enum: [ACTIVO, CERRADO, VENCIDO]
paths:
  /financiamientos:
    get:
      tags: [financiamientos]
      operationId: listarFinanciamientos
      summary: Lista financiamientos del cliente
      parameters:
        - name: page
          in: query
          schema: { type: integer }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Financiamiento' }
```

Nota lo difícil que tiene a propósito: `allOf` (Financiamiento hereda de Base), una autoreferencia
(`Financiamiento.hijos` es un array de `Financiamiento`), y un `enum`.

## `README.md` generado (fragmento)

```markdown
# API de prueba

Versión: 1.2.3

## Servers
- `https://api.ejemplo.com/v1` — Producción

## Seguridad
- **bearerAuth**: http (bearer)

## Índice de endpoints

| Método | Ruta | operationId | Resumen | Dominio |
|---|---|---|---|---|
| GET | `/financiamientos` | `listarFinanciamientos` | Lista financiamientos del cliente | [financiamientos](dominios/financiamientos.md#listarFinanciamientos) |

## Huecos del contrato

- Ninguno detectado automáticamente.
```

## `dominios/financiamientos.md` generado

```markdown
# Dominio: financiamientos

<a id="listarFinanciamientos"></a>
### GET /financiamientos

**operationId:** `listarFinanciamientos`

Lista financiamientos del cliente

**Seguridad:** bearerAuth

**Parámetros de query**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `page` | `integer` | no | — |

**Respuestas**

- **200** — OK
  ​```ts
  Financiamiento[]
  ​```

---
```

Nota que la respuesta referencia `Financiamiento` **por nombre**, no expande su estructura inline
— para eso está `modelos.md`.

## `modelos.md` generado (fragmento — el caso con `allOf` + autoreferencia)

```markdown
<a id="Financiamiento"></a>
### Financiamiento

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `id` | `string /* uuid */` | sí | uuid | — |
| `creadoEn` | `string /* ISO 8601 date-time */` | no | date-time | — |
| `monto` | `number /* int64 */` | sí | int64 | — |
| `estado` | `EstadoFinanciamiento` | sí | — | — |
| `hijos` | `Financiamiento[]` | no | — | — |

​```ts
export interface Financiamiento {
  "id": string /* uuid */;
  "creadoEn"?: string /* ISO 8601 date-time */;
  "monto": number /* int64 */;
  "estado": EstadoFinanciamiento;
  "hijos"?: Financiamiento[];
}
​```

---

<a id="EstadoFinanciamiento"></a>
### EstadoFinanciamiento

​```ts
export type EstadoFinanciamiento = "ACTIVO" | "CERRADO" | "VENCIDO";
​```

---
```

Puntos a observar:

- `Financiamiento` trae ya combinados los campos de `Base` (`id`, `creadoEn`) y los propios
  (`monto`, `estado`, `hijos`) — el `allOf` quedó completamente aplanado, no queda rastro de
  `Base` como referencia separada.
- `hijos: Financiamiento[]` es una autoreferencia y se generó sin recursión infinita ni error:
  como `Financiamiento` es un schema nombrado, su `$ref` se tradujo directo al nombre del tipo
  (ver "regla central" en `mapeo-tipos.md`), nunca se intentó expandir su contenido de nuevo.
- `EstadoFinanciamiento` se generó como `type` (unión de literales), no como `interface`, porque
  es un `enum` de tipo `string`, no un objeto.

# Dominio: Events

<a id="createSpecialEvent"></a>
### POST /special-events

**operationId:** `createSpecialEvent`

Create special events

**Seguridad:** MuseumPlaceholderAuth

**Cuerpo de la petición** (`application/json`, requerido)

```ts
SpecialEvent
```

**Respuestas**

- **201** — Created.
  ```ts
  SpecialEvent
  ```
- **400** — Bad request.
  ```ts
  Error
  ```
- **404** — Not found.
  ```ts
  Error
  ```

---

<a id="listSpecialEvents"></a>
### GET /special-events

**operationId:** `listSpecialEvents`

List special events

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de query**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `startDate` | `string` | no | Starting date to retrieve future operating hours from. Defaults to today's date. |
| `endDate` | `string` | no | End of a date range to retrieve special events for. Defaults to 7 days after `startDate`. |
| `page` | `integer` | no | Page number to retrieve. |
| `limit` | `integer` | no | Number of days per page. |

**Respuestas**

- **200** — Success.
  ```ts
  SpecialEventCollection
  ```
- **400** — Bad request.
  ```ts
  Error
  ```
- **404** — Not found.
  ```ts
  Error
  ```

---

<a id="getSpecialEvent"></a>
### GET /special-events/{eventId}

**operationId:** `getSpecialEvent`

Get special event

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de path**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | sí | Identifier for a special event. |

**Respuestas**

- **200** — Success.
  ```ts
  SpecialEvent
  ```
- **400** — Bad request.
  ```ts
  Error
  ```
- **404** — Not found.
  ```ts
  Error
  ```

---

<a id="updateSpecialEvent"></a>
### PATCH /special-events/{eventId}

**operationId:** `updateSpecialEvent`

Update special event

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de path**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | sí | Identifier for a special event. |

**Cuerpo de la petición** (`application/json`, requerido)

```ts
SpecialEventFields
```

**Respuestas**

- **200** — Success.
  ```ts
  SpecialEvent
  ```
- **400** — Bad request.
  ```ts
  Error
  ```
- **404** — Not found.
  ```ts
  Error
  ```

---

<a id="deleteSpecialEvent"></a>
### DELETE /special-events/{eventId}

**operationId:** `deleteSpecialEvent`

Delete special event

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de path**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | sí | Identifier for a special event. |

**Respuestas**

- **204** — Success - no content.
- **400** — Bad request.
  ```ts
  Error
  ```
- **401** — Unauthorized.
  ```ts
  Error
  ```
- **404** — Not found.
  ```ts
  Error
  ```

---

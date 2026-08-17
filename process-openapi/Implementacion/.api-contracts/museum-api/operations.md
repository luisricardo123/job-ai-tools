# Dominio: Operations

<a id="getMuseumHours"></a>
### GET /museum-hours

**operationId:** `getMuseumHours`

Get museum hours

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de query**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `startDate` | `string` | no | Starting date to retrieve future operating hours from. Defaults to today's date. |
| `page` | `integer` | no | Page number to retrieve. |
| `limit` | `integer` | no | Number of days per page. |

**Respuestas**

- **200** — Success.
  ```ts
  MuseumHours
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

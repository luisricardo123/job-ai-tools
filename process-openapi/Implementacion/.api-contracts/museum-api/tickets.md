# Dominio: Tickets

<a id="buyMuseumTickets"></a>
### POST /tickets

**operationId:** `buyMuseumTickets`

Buy museum tickets

**Seguridad:** MuseumPlaceholderAuth

**Cuerpo de la petición** (`application/json`, requerido)

```ts
BuyMuseumTickets
```

**Respuestas**

- **201** — Created.
  ```ts
  MuseumTicketsConfirmation
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

<a id="getTicketCode"></a>
### GET /tickets/{ticketId}/qr

**operationId:** `getTicketCode`

Get ticket QR code

**Seguridad:** MuseumPlaceholderAuth

**Parámetros de path**

| Nombre | Tipo | Requerido | Descripción |
|---|---|---|---|
| `ticketId` | `string` | sí | Identifier for a ticket to a museum event. Used to generate ticket image. |

**Respuestas**

- **200** — Scannable event ticket in image format.
  ```ts
  TicketCodeImage
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

# Redocly Museum API

Versión: 1.2.1

## Servers
- `https://redocly.com/_mock/docs/openapi/museum-api`

## Seguridad
- **MuseumPlaceholderAuth**: http (basic)

## Índice de endpoints

| Método | Ruta | operationId | Resumen | Dominio |
|---|---|---|---|---|
| GET | `/museum-hours` | `getMuseumHours` | Get museum hours | [Operations](operations.md#getMuseumHours) |
| GET | `/special-events` | `listSpecialEvents` | List special events | [Events](events.md#listSpecialEvents) |
| POST | `/special-events` | `createSpecialEvent` | Create special events | [Events](events.md#createSpecialEvent) |
| DELETE | `/special-events/{eventId}` | `deleteSpecialEvent` | Delete special event | [Events](events.md#deleteSpecialEvent) |
| GET | `/special-events/{eventId}` | `getSpecialEvent` | Get special event | [Events](events.md#getSpecialEvent) |
| PATCH | `/special-events/{eventId}` | `updateSpecialEvent` | Update special event | [Events](events.md#updateSpecialEvent) |
| POST | `/tickets` | `buyMuseumTickets` | Buy museum tickets | [Tickets](tickets.md#buyMuseumTickets) |
| GET | `/tickets/{ticketId}/qr` | `getTicketCode` | Get ticket QR code | [Tickets](tickets.md#getTicketCode) |

## Huecos del contrato

- Ninguno detectado automáticamente.

## Convenciones transversales

### Paginación
- **Parámetros**: `page` (número de página, default 1) y `limit` (items por página, default 10, máximo 30)
- **Endpoints que paginan**: GET `/museum-hours`, GET `/special-events`
- **En la respuesta**: No se declaran metadatos de paginación (total de items, páginas, etc.) — solo se devuelve el array directo

### Modelo de respuesta
- **Sin envelope común**: Cada endpoint devuelve su schema directamente, sin wrapper `{ data, meta }` u otros
- **Content-Type estándar**: `application/json` (excepto GET `/tickets/{ticketId}/qr` que devuelve `image/png`)

### Modelo de error
- **Tipo**: `Error` con campos opcionales `type` (string) y `title` (string)
- **Content-Type**: `application/problem+json` 
- **Códigos más comunes**: 400 (Bad request), 404 (Not found), 401 (Unauthorized, solo en DELETE `/special-events/{eventId}`)

### Formatos de datos
- **Fechas**: ISO 8601 date (`YYYY-MM-DD`, ej. `2023-10-29`)
- **Horas**: Formato 24 horas `HH:mm` (ej. `09:00`, `18:00`)
- **Identificadores**: UUIDs (`ticketId`, `eventId`)
- **Moneda/Precios**: Números (`EventPrice` es `number`, sin formato específico de moneda declarado)
- **Email**: String con formato email

### Seguridad
- **Esquema usado**: `MuseumPlaceholderAuth` (HTTP Basic Authentication) aplicado a **todos** los endpoints
- **Cabeceras obligatorias**: `Authorization` (implícita por el esquema HTTP Basic)

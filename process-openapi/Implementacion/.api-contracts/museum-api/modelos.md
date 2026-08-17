# Modelos

<a id="TicketType"></a>
### TicketType

Type of ticket being purchased. Use `general` for regular museum entry and `event` for tickets to special events.

```ts
export type TicketType = "event" | "general";
```

---

<a id="Date"></a>
### Date

```ts
export type Date = string /* ISO 8601 date */;
```

---

<a id="Email"></a>
### Email

Email address for ticket purchaser.

```ts
export type Email = string;
```

---

<a id="BuyMuseumTickets"></a>
### BuyMuseumTickets

Data to purchase a ticket.

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `email` | `Email` | no | — | — |
| `ticketId` | `TicketId` | no | — | — |
| `ticketDate` | `Date` | sí | — | Date when this ticket can be used for museum entry. |
| `ticketType` | `TicketType` | sí | — | — |
| `eventId` | `EventId` | no | — | Unique identifier for a special event. Required if purchasing tickets for the museum's special events. |

```ts
export interface BuyMuseumTickets {
  "email"?: Email;
  "ticketId"?: TicketId;
  "ticketDate": Date;
  "ticketType": TicketType;
  "eventId"?: EventId;
}
```

---

<a id="TicketMessage"></a>
### TicketMessage

Confirmation message after a ticket purchase.

```ts
export type TicketMessage = string;
```

---

<a id="TicketId"></a>
### TicketId

Unique identifier for museum ticket. Generated when purchased.

```ts
export type TicketId = string /* uuid */;
```

---

<a id="TicketConfirmation"></a>
### TicketConfirmation

Unique confirmation code used to verify ticket purchase.

```ts
export type TicketConfirmation = string;
```

---

<a id="Ticket"></a>
### Ticket

Ticket for museum entry, can be general admission or special event.

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `ticketId` | `TicketId` | no | — | — |
| `ticketDate` | `Date` | sí | — | Date when this ticket can be used for museum entry. |
| `ticketType` | `TicketType` | sí | — | — |
| `eventId` | `EventId` | no | — | Unique identifier for a special event. Required if purchasing tickets for the museum's special events. |

```ts
export interface Ticket {
  "ticketId"?: TicketId;
  "ticketDate": Date;
  "ticketType": TicketType;
  "eventId"?: EventId;
}
```

---

<a id="MuseumTicketsConfirmation"></a>
### MuseumTicketsConfirmation

Details for a museum ticket after a successful purchase.

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `ticketId` | `TicketId` | no | — | — |
| `ticketDate` | `Date` | sí | — | Date when this ticket can be used for museum entry. |
| `ticketType` | `TicketType` | sí | — | — |
| `eventId` | `EventId` | no | — | Unique identifier for a special event. Required if purchasing tickets for the museum's special events. |
| `message` | `TicketMessage` | sí | — | — |
| `confirmationCode` | `TicketConfirmation` | sí | — | — |

```ts
export interface MuseumTicketsConfirmation {
  "ticketId"?: TicketId;
  "ticketDate": Date;
  "ticketType": TicketType;
  "eventId"?: EventId;
  "message": TicketMessage;
  "confirmationCode": TicketConfirmation;
}
```

---

<a id="TicketCodeImage"></a>
### TicketCodeImage

Image of a ticket with a QR code used for museum or event entry.

```ts
export type TicketCodeImage = string /* binary */;
```

---

<a id="MuseumHours"></a>
### MuseumHours

List of museum operating hours for a date range.

```ts
export type MuseumHours = MuseumDailyHours[];
```

---

<a id="MuseumDailyHours"></a>
### MuseumDailyHours

Daily operating hours for the museum.

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `date` | `Date` | sí | — | Date the operating hours apply to. |
| `timeOpen` | `string` | sí | pattern ^([01]\d|2[0-3]):?([0-5]\d)$ | Time the museum opens on a specific date. Uses 24 hour time format (`HH:mm`). |
| `timeClose` | `string` | sí | pattern ^([01]\d|2[0-3]):?([0-5]\d)$ | Time the museum closes on a specific date. Uses 24 hour time format (`HH:mm`). |

```ts
export interface MuseumDailyHours {
  "date": Date;
  "timeOpen": string;
  "timeClose": string;
}
```

---

<a id="EventId"></a>
### EventId

Identifier for a special event.

```ts
export type EventId = string /* uuid */;
```

---

<a id="EventName"></a>
### EventName

Name of the special event.

```ts
export type EventName = string;
```

---

<a id="EventLocation"></a>
### EventLocation

Location where the special event is held.

```ts
export type EventLocation = string;
```

---

<a id="EventDescription"></a>
### EventDescription

Description of the special event.

```ts
export type EventDescription = string;
```

---

<a id="EventDates"></a>
### EventDates

List of planned dates for the special event.

```ts
export type EventDates = Date[];
```

---

<a id="EventPrice"></a>
### EventPrice

Price of a ticket for the special event.

```ts
export type EventPrice = number;
```

---

<a id="SpecialEventFields"></a>
### SpecialEventFields

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `name` | `EventName` | no | — | — |
| `location` | `EventLocation` | no | — | — |
| `eventDescription` | `EventDescription` | no | — | — |
| `dates` | `EventDates` | no | — | — |
| `price` | `EventPrice` | no | — | — |

```ts
export interface SpecialEventFields {
  "name"?: EventName;
  "location"?: EventLocation;
  "eventDescription"?: EventDescription;
  "dates"?: EventDates;
  "price"?: EventPrice;
}
```

---

<a id="SpecialEvent"></a>
### SpecialEvent

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `eventId` | `EventId` | no | — | — |
| `name` | `EventName` | sí | — | — |
| `location` | `EventLocation` | sí | — | — |
| `eventDescription` | `EventDescription` | sí | — | — |
| `dates` | `EventDates` | sí | — | — |
| `price` | `EventPrice` | sí | — | — |

```ts
export interface SpecialEvent {
  "eventId"?: EventId;
  "name": EventName;
  "location": EventLocation;
  "eventDescription": EventDescription;
  "dates": EventDates;
  "price": EventPrice;
}
```

---

<a id="SpecialEventCollection"></a>
### SpecialEventCollection

List of upcoming special events.

```ts
export type SpecialEventCollection = SpecialEvent[];
```

---

<a id="Error"></a>
### Error

| Campo | Tipo | Requerido | Restricciones | Descripción |
|---|---|---|---|---|
| `type` | `string` | no | — | — |
| `title` | `string` | no | — | — |

```ts
export interface Error {
  "type"?: string;
  "title"?: string;
}
```

---

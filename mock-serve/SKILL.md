---
name: "mock-serve"
description: "Usar cuando el usuario quiera instalar, configurar, crear o editar mocks de API REST con la librería interna @bcp/mock-serve (CLI bcp-serve) del BCP Framework Web, que levanta un servidor HTTP local en base a archivos JSON dentro de una carpeta mock-db/. Disparar con menciones de \"mock server\", \"mockserve\", \"bcp-serve\", \"mock-db\", \"levantar un servidor de mocks\", o al pedir crear/editar JSONs de mocks en esa carpeta. NO usar si el usuario solo quiere hardcodear datos de prueba directamente en un servicio de Angular (arrays fijos, of(...).pipe(delay(...)), sin servidor HTTP real) — eso no usa esta librería. Si el pedido es ambiguo (p.ej. \"quiero mockear esta data\" sin más contexto), preguntar cuál de los dos enfoques prefiere antes de actuar."
---

# bcp-mock-serve

## Cuándo usar esta skill

Usar esta skill siempre que el usuario quiera instalar, configurar, crear o editar mocks con la librería **@bcp/mock-serve** (CLI `bcp-serve`), incluso si no la nombra explícitamente. Dispara con menciones de: "mock server", "mockserve", "bcp-serve", "mock-db", "levantar un servidor de mocks", o cuando el usuario pida crear/editar archivos JSON de mocks dentro de una carpeta `mock-db` en un proyecto BCP Framework Web.

## Dos formas distintas de "mockear" (no confundir)

"Mockear data" en un proyecto Angular puede significar dos cosas muy distintas. Esta skill solo cubre la primera:

| | Servidor local de mocks (esta skill) | Hardcodeo en el servicio Angular |
|---|---|---|
| Qué es | Servidor HTTP real (`bcp-serve`) que responde en `localhost:3000` a partir de JSONs en `mock-db/` | Datos fijos escritos directamente en el `.service.ts`, sin pasar por HTTP ni por esta librería |
| Cuándo conviene | Simular la API completa: endpoints, status codes, headers, casos de error de negocio | Aislar un componente rápido sin instalar nada ni tocar `HttpClient`/`mock-db` |
| Cómo se simula el delay | Campo `delay` (ms) dentro del JSON del mock | `of(data).pipe(delay(500))` con RxJS, directo en el servicio |
| Requiere el server corriendo | Sí (`npm run mock:start` / `bcp-serve mock`) | No |

**Cómo decidir:**
- Usar esta skill si el usuario menciona "bcp-serve", "mock-db", "servidor de mocks", "levantar un mock server", o quiere simular el endpoint real (con status codes, headers, distintos escenarios de negocio).
- **No** usar esta skill si el usuario pide algo como "que el servicio de Angular devuelva un dato hardcodeado con un delay, sin servidor" — eso es código RxJS (`of()`, `delay()`) directo en el `.service.ts`, fuera del alcance de `@bcp/mock-serve`. En ese caso no instalar la librería ni tocar `mock-db/`.
- Si el pedido es ambiguo ("necesito mockear esta data", "simula esta respuesta"), preguntar antes de actuar: *"¿Quieres levantar el servidor local de mocks (bcp-serve, con mock-db/) o prefieres hardcodear la respuesta directamente en el servicio de Angular, sin servidor?"*

## Qué es

`@bcp/mock-serve` es una librería interna (BCP Framework Web - DevTools) que levanta un servidor REST local a partir de archivos JSON, para simular las APIs de Experiencia durante el desarrollo frontend. Soporta dos tipos de respuesta:

1. **JSON** — devuelve un cuerpo (objeto, arreglo, string, number) directamente.
2. **File** — devuelve un archivo (buffer), útil para simular descargas.

## Instalación

Local (dentro del proyecto, recomendado):
```bash
npm install --save-dev @bcp/mock-serve
```

Global:
```bash
npm install -g @bcp/mock-serve
```

## Configuración y arranque

**Si la instalación es local**, agregar este script en `package.json`:
```json
{
  "scripts": {
    "mock:start": "./node_modules/.bin/bcp-serve mock"
  }
}
```
Y ejecutar:
```bash
npm run mock:start
```

**Si la instalación es global**, desde la raíz del proyecto:
```bash
bcp-serve mock start
```

En ambos casos, el servidor arranca por defecto en `http://localhost:3000`.

## Ubicación de los mocks

Los archivos JSON de mocks deben crearse dentro de una carpeta llamada exactamente **`mock-db`**, ubicada en la **raíz del proyecto** (al mismo nivel que `node_modules`, `src`, `angular.json`, etc.). El nombre del archivo JSON dentro de esa carpeta es libre (ej. `example.json`, `accounts.json`).

Cada endpoint simulado queda expuesto en `http://localhost:3000/<path>`, donde `<path>` es la clave usada en el JSON (ej. `api/example-mock`).

## Estructura del JSON de mocks

```json
{
  "<path-del-endpoint>": {
    "<MÉTODO_HTTP>": {
      "typeResponse": "JSON",
      "codeResponse": "200",
      "delay": 500,
      "responses": [
        {
          "statusCode": "200",
          "errorCode": "HK00024",
          "headers": {},
          "body": {},
          "filePath": ""
        }
      ]
    }
  }
}
```

Cada nivel puede repetirse: un mismo path puede tener varios métodos HTTP (`GET`, `POST`, etc.), y cada método puede tener varias respuestas posibles dentro de `responses`.

### Referencia de campos

| Campo | Descripción | Tipo |
|---|---|---|
| `typeResponse` | Tipo de respuesta: `JSON` o `File`. Por defecto `JSON`. | String |
| `codeResponse` | Controla qué respuesta del arreglo `responses` se devuelve. Debe coincidir con el `statusCode` (o `errorCode`) de una de las respuestas configuradas. | String |
| `delay` | Simula latencia de red, en milisegundos. | Number |
| `response` / `responses` | Arreglo con las distintas respuestas posibles según casos de éxito/error de negocio. | Object[] |
| `responses[n].statusCode` | Código HTTP de esa respuesta (`200`, `401`, `500`, etc.). | String |
| `responses[n].errorCode` | Código de error de negocio (ej. `HK00024`, `HK00015`). | String |
| `responses[n].headers` | Headers a simular en la respuesta (útil para CORS o integración). | Object |
| `responses[n].body` | Cuerpo de la respuesta. Solo aplica a `typeResponse: JSON`. | Object, Array, String, Number, void |
| `responses[n].filePath` | Ruta del archivo a devolver. Solo aplica a `typeResponse: File`. | String |

**Cómo se elige la respuesta**: el valor de `codeResponse` en la configuración del método debe coincidir con el `statusCode` (o `errorCode`) de uno de los objetos dentro de `responses`. Ese es el que se devuelve.

## Ejemplos

### 1. Mock mínimo (JSON)
```json
{
  "api/example-mock": {
    "GET": {
      "codeResponse": "200",
      "responses": [{
        "statusCode": "200",
        "body": "Esta es una respuesta simulada"
      }]
    }
  }
}
```
Prueba en: `http://localhost:3000/api/example-mock`

### 2. JSON con múltiples casos (éxito y error) y delay
```json
{
  "api/product/account": {
    "GET": {
      "codeResponse": "200",
      "delay": "500",
      "responses": [
        {
          "statusCode": "200",
          "body": [
            {
              "prodNro": "19311303929109",
              "prodNroEdit": "193-11303929-1-09",
              "currencysymbol": "US$",
              "clsEstFamDes": "CUENTAS DE AHORRO",
              "clsEstProdDes": "Ahorro Dólares",
              "mto": 333
            }
          ]
        },
        {
          "statusCode": "401",
          "body": "UNAUTORIZED"
        }
      ]
    }
  }
}
```
Con `codeResponse: "200"`, el endpoint devuelve el `body` de la respuesta cuyo `statusCode` es `"200"` (el array con el producto). Para simular el caso 401, bastaría con cambiar `codeResponse` a `"401"`.

### 3. Respuesta tipo File (descarga de archivo)
```json
{
  "api/contract/dowload": {
    "GET": {
      "typeResponse": "file",
      "filePath": "mock-db/files/test.pdf",
      "delay": "1000"
    }
  }
}
```
El `filePath` es relativo a la raíz del proyecto y normalmente apunta a un archivo dentro de `mock-db/` (ej. `mock-db/files/test.pdf`).

## Cómo ayudar al usuario paso a paso

Cuando el usuario pida crear o modificar un mock, seguir este flujo:

1. Confirmar (o inferir del contexto del proyecto) si `@bcp/mock-serve` ya está instalado y si el script `mock:start` existe en `package.json`. Si no, agregarlo según la sección de instalación.
2. Verificar que exista la carpeta `mock-db` en la raíz del proyecto; crearla si falta.
3. Escribir o editar el archivo JSON dentro de `mock-db` siguiendo la estructura descrita arriba:
   - Usar el path del endpoint tal cual lo consumirá el frontend (sin `http://localhost:3000`).
   - Definir el/los método(s) HTTP que necesite el usuario.
   - Si el usuario solo pide "un mock que devuelva X", usar la forma mínima (un solo `statusCode` en `responses`, `codeResponse` apuntando a ese mismo valor).
   - Si el usuario pide simular varios escenarios (éxito, error de negocio, no autorizado, etc.), agregar un objeto en `responses` por cada escenario, y dejar claro que para "activar" cada escenario hay que cambiar `codeResponse` al `statusCode`/`errorCode` correspondiente.
   - Si el usuario pide simular una descarga de archivo, usar `typeResponse: "file"` y `filePath` apuntando a un archivo real dentro de `mock-db/` (crear el archivo si no existe y el usuario lo puede proveer).
   - Agregar `delay` solo si el usuario menciona que quiere simular latencia.
4. Indicar cómo levantar el servidor (`npm run mock:start` o `bcp-serve mock`) y en qué URL probar el endpoint (`http://localhost:3000/<path>`).

## Notas

- Es una librería interna de BCP (BCP Framework Web - DevTools - MockServer), no un paquete público de npm; no buscar documentación externa sobre ella.
- El nombre de la carpeta `mock-db` y su ubicación en la raíz del proyecto son obligatorios: si no está ahí, el servidor no encuentra los mocks.


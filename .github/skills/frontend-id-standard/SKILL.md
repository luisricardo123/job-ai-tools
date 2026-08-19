---
name: frontend-id-standard
description: >
  Agrega y corrige atributos `data-id` estables para automatización de pruebas en componentes
  frontend (HTML nativo, componentes propios y componentes BCP, junto con su TypeScript asociado),
  siguiendo estrictamente el estándar `<nombre_componente>_<tipo_control>_<nombre_control>`. Úsala
  cuando el usuario pida "agregar IDs para pruebas", "aplicar el estándar de IDs de automatización",
  "analizar IDs de automatización", "poner IDs a este formulario/tabla/modal/componente", "revisar
  IDs existentes", "corregir IDs", o invoque /frontend-id-standard. Tiene modo análisis (detecta y
  propone sin modificar archivos) y modo aplicación (edita el archivo). No la uses para crear el
  componente en sí, ni para el atributo `id` de HTML ni para atributos de accesibilidad (`for`,
  `aria-*`): solo cubre `data-id`.
argument-hint: 'ruta de los componentes o carpetas a analizar (opcional)'
---

# Frontend ID Standard

Analiza componentes frontend (HTML nativo, componentes propios y componentes de la librería BCP,
junto con su TypeScript asociado) y agrega atributos `data-id` estables a los elementos relevantes para
la automatización de pruebas.

**Aplica estrictamente el estándar descrito en este archivo y en `references/`. No inventes,
extiendas, mejores, elimines ni reinterpretes las reglas.** Todo lo que puedes usar está definido
aquí. Antes de clasificar cualquier elemento, carga `references/catalogo-tipos-control.md` — es
la fuente de verdad del catálogo de tipos de control y no debe resumirse de memoria.

## Formato obligatorio del ID

El atributo HTML que se agrega es **`data-id`** (no `id`). A lo largo de este documento, "ID" se
usa para referirse al valor/identificador con el formato de tres bloques — pero el nombre del
atributo HTML donde se coloca ese valor siempre es `data-id`.

```
data-id="<nombre_componente>_<tipo_control>_<nombre_control>"
```

Ejemplos:

```html
data-id="block_data_txt_reference_payroll"
data-id="blocks_manager_btn_print"
data-id="summary_payment_btn_download_payment_summary"
```

## Ubicación del atributo `data-id` en el tag

`data-id` siempre se agrega como **el último atributo del tag**, después de `class`, de cualquier
otra propiedad o binding y de los eventos — es metadata para automatización, no parte de la
definición funcional del elemento, así que no debe interrumpir la lectura de los atributos que sí
describen su comportamiento. Esto aplica tanto al agregar un `data-id` nuevo como al corregir uno
no conforme: si el `data-id` existente no está en la última posición, muévelo al final como parte
de la corrección. Ver ejemplos en `references/ejemplos.md`.

**Los tres bloques se escriben en `snake_case`, en minúsculas.** El ID se compone de tres bloques:
`nombre_componente`, `tipo_control` y `nombre_control`. Aunque conceptualmente son tres bloques,
**algunos tipos de control oficiales contienen un guion bajo** (`ele_chr`, `ele_load`, `btn_close`,
`ele_dnd`), y como los tres bloques están en snake_case, el ID completo suele tener muchos guiones
bajos. Por eso nunca valides ni construyas el ID partiendo el string por `_` asumiendo un número
fijo de partes. Regla de parseo obligatoria:

1. El bloque 1 (nombre del componente) se conoce por contexto — es el nombre del componente dueño
   del archivo HTML que se está analizando, no algo que se deduzca del string del ID.
2. El bloque 2 (tipo de control) es el tipo oficial que aparece **inmediatamente después** del
   bloque 1, tomando siempre la coincidencia más larga del catálogo (`btn_close` antes que `btn`;
   `ele_chr`, `ele_load` y `ele_dnd` como unidad indivisible).
3. Todo lo que queda a la derecha del bloque 2 es el bloque 3, sin importar cuántos `_` contenga.

Cuidado con el caso trampa: el bloque 3, al estar en snake_case, puede contener palabras que
coinciden con tipos del catálogo (p. ej. `search_form_btn_add_tab` — el `tab` final **no** es el
bloque 2, porque el bloque 2 ya se identificó como `btn` inmediatamente después del bloque 1).
Nunca busques "el último tipo del catálogo que aparezca" ni partas el string por `_` sin aplicar
esta regla.

## Bloque 1 — nombre del componente (`snake_case`)

Representa el nombre funcional del **componente al que pertenece el archivo HTML que se está
editando** — no el de la pantalla, page o ruta que lo contiene. Cada componente usa su propio
nombre, aunque se renderice dentro de otro. Ejemplos: `block_data`, `blocks_manager`,
`summary_payment`, `financing_detail`, `payment_options`, `credit_search`,
`commercial_credit_detail`.

**Regla clave — un page y sus componentes hijos nunca comparten bloque 1.** Si un page invoca
componentes hijos, cada archivo HTML usa su propio nombre:

```
consulta.html          → consulta_...
form-search.html       → form_search_...
results-list.html      → results_list_...
```

Aunque `form-search` y `results-list` se rendericen dentro de `consulta.html`, **nunca** llevan el
prefijo `consulta_`. El nombre del page solo aplica a los elementos que viven literalmente en
`consulta.html`.

Determínalo analizando, en este orden, hasta encontrar suficiente certeza:

1. Nombre funcional indicado expresamente por el usuario.
2. IDs ya existentes en el mismo archivo que cumplan el estándar.
3. Nombre de la clase del componente en el `.ts` asociado.
4. Nombre del archivo HTML.
5. Nombre del archivo TypeScript asociado.
6. Selector del componente.
7. Nombre de la carpeta del componente.

Elimina sufijos técnicos que no forman parte del nombre funcional (`.component`, `.page`,
`.form`, `.view`, `.html`, `.ts`). Ejemplos:

- `blocks-manager.component.html` → `blocks_manager`
- `block-data-form.component.html` → `block_data`
- `form-search.component.html` → `form_search`
- `results-list.component.html` → `results_list`

Usa el **mismo** nombre de componente para todos los elementos del mismo archivo HTML. Si el
alcance de la tarea incluye varios componentes (un page y sus hijos, por ejemplo), cada archivo
usa su propio bloque 1. No uses nombres genéricos (`page`, `screen`, `component`, `main`, `view`)
cuando exista información funcional más precisa. **Si no puedes determinar el nombre del
componente con suficiente seguridad, no lo inventes.** No lo preguntes de inmediato: no agregues
ningún ID en ese archivo (todos dependen del bloque 1), continúa aplicando con normalidad en el
resto de archivos del alcance, y lleva ese archivo al punto de parada como ambigüedad bloqueante
(ver "Manejo de ambigüedades" y "Punto de parada obligatoria").

## Bloque 2 — tipo de control (catálogo oficial cerrado)

Carga y usa exclusivamente el catálogo de `references/catalogo-tipos-control.md`. Son las únicas
abreviaturas permitidas: no crees nuevas, no elimines, no cambies, no crees sinónimos, no alteres
su significado, y no uses una abreviatura por semejanza visual cuando su función oficial no
corresponda. Ese archivo también lista las abreviaturas explícitamente prohibidas (`ttl`, `pgh`,
`val`, `txt_value`, `text`, `amount`, `card`, `sec`, `msg`, etc.).

El bloque 2 se escribe siempre en minúsculas y en `snake_case`, igual que los bloques 1 y 3. Los
cuatro tipos compuestos (`ele_chr`, `ele_load`, `btn_close`, `ele_dnd`) ya siguen esa convención y
se tratan como una unidad indivisible: nunca se dividen al construir o parsear un ID.

### Clasifica según la función, no según el tag

- Un `<div>` no es automáticamente `cnt`.
- Un `<span>` no es automáticamente `lbl`.
- Un texto visible no es automáticamente `txt`.
- Un componente propio puede ser `btn` si funcionalmente representa un botón.
- Un icono solo es `ico` cuando tiene interacción propia.
- Un `<section>` solo es `cnt` cuando realmente es el contenedor principal de una sección clave.

Para clasificar, analiza en conjunto: tag, componente utilizado, atributos, propiedades, eventos,
roles de accesibilidad, contenido, ubicación dentro de la pantalla, binding, lógica asociada en el
TypeScript y contexto funcional.

## Bloque 3 — nombre del control (`snake_case`)

Describe el significado funcional del control, elemento, acción o dato. Ejemplos:
`reference_payroll`, `print`, `continue`, `download_payment_summary`, `payment_method`,
`direct_credits`, `confirmation`, `payment_error`.

**Nunca lo determines solo por el texto visible.** Revisa conjuntamente el HTML y el TypeScript
asociado. Orden de prioridad para determinarlo:

1. Nombre funcional indicado expresamente por el usuario.
2. `formControlName`.
3. Variable interpolada.
4. Binding principal de valor.
5. Método ejecutado por el elemento.
6. Evento asociado.
7. Signal, getter o propiedad relacionada.
8. Nombre del componente hijo.
9. Label o texto visible.
10. Contexto de la sección.
11. Inferencia conjunta del HTML y TypeScript.

Las fuentes técnicas anteriores (`formControlName`, métodos, signals, propiedades) suelen estar en
camelCase en el código. Primero determina el nombre funcional desde la fuente técnica correspondiente,
y luego **conviértelo a snake_case** para escribirlo en el ID — sin renombrar nada en el
TypeScript. Ejemplos de conversión: `referencePayroll` → `reference_payroll`,
`downloadPaymentSummary` → `download_payment_summary`, `totalDirectCreditsAmount` →
`total_direct_credits_amount`.

El texto visible es evidencia válida, pero no la única fuente cuando exista contexto técnico más
preciso. Ejemplo: `<span>{{ totalDirectCreditsAmount }}</span>` — revisa `totalDirectCreditsAmount`
en el `.ts` y la sección donde aparece para entender su significado (monto total de créditos
directos) antes de nombrar el bloque. El nombre funcional detectado es `total_direct_credits_amount`,
no `s1000` ni `monto`. Identificar bien este bloque **no implica** que exista un tipo oficial
aplicable: siempre valida también el bloque 2.

Otro ejemplo — `<bcp-button (ctrlClick)="downloadPaymentSummary()">Descargar</bcp-button>` — el
nombre debe basarse en el método (`downloadPaymentSummary`), no reducirse a `download` cuando el
contexto permite algo más preciso. Resultado: `summary_payment_btn_download_payment_summary`.

Evita nombres genéricos (`text`, `value`, `data`, `element`, `component`, `item`, `field`, `label`,
`container`, `action`, `button`, `input`, `first_element`, `second_item`) y nombres basados en
posición, color, apariencia, número secuencial arbitrario, nombre del tag o clase CSS
(`left_button`, `blue_button`, `button_1`, `input_2`, `first_item`, `div_container`).

## Archivos a analizar

Por cada HTML dentro del alcance, localiza y revisa su TypeScript asociado (p. ej.
`summary-payment.component.html` ↔ `summary-payment.component.ts`). Puedes revisar otros archivos
cercanos solo cuando sean necesarios para el contexto: interfaces, modelos, componentes hijos,
configuraciones de formularios, constantes usadas por el template.

**Modifica principalmente el HTML. No modifiques el TypeScript para facilitar la creación de
IDs.**

## Elementos a considerar

No te limites a tags `bcp-*`. Analiza también HTML nativo y componentes propios: `button`,
`input`, `select`, `textarea`, `a`, `table`, `tr`, `td`, `form`, `div`, `section`, `span`, `img`,
`nav`, y componentes propios como `app-custom-component`, `app-payment-card`, `app-credit-summary`.
El `data-id` va sobre el elemento que representa el control relevante para automatización.

### Componentes BCP

Agrega el `data-id` directamente en el tag relevante. No inventes ni modifiques propiedades, eventos,
slots, imports, bindings, métodos, configuraciones, textos ni estructura interna de componentes
BCP: **solo agregas o revisas el atributo `data-id`**. Ver ejemplos completos en
`references/ejemplos.md`.

### HTML nativo y componentes propios

Aplica el mismo estándar cuando su función corresponda a un tipo oficial. Ejemplos en
`references/ejemplos.md`.

## Reglas por categoría

- **Contenedores (`cnt`)**: solo para el contenedor principal de una sección clave. No lo agregues
  a todos los `div`/`section`/wrappers de layout. No identifiques varios wrappers anidados cuando
  solo uno representa la sección clave.
- **Formularios (`frm`)**: un formulario completo puede usar `frm`. Los controles internos reciben
  sus propios IDs cuando corresponda.
- **Tablas (`tbl`)**: para tablas, filas específicas y celdas específicas. No agregues IDs
  indiscriminadamente a todas las filas y celdas; solo cuando sean específicas, importantes o
  probablemente necesarias para una prueba automatizada.
- **Textos y etiquetas (`lbl`)**: identifica texto mostrado al usuario que no es editable —
  mensajes de error y validación (de negocio o de campo), títulos, subtítulos, párrafos
  informativos, textos generales, montos de solo lectura, fechas de solo lectura, saldos y
  resultados textuales. Ampliar `lbl` a estos casos no significa poner ID a cada `span`: recibe
  `lbl` el texto sobre el que una prueba automatizada probablemente vaya a **leer o afirmar** un
  valor o mensaje (importes, resultados, errores, títulos de sección relevantes). No lo reciben los
  textos puramente decorativos, los fragmentos partidos solo por maquetación, ni el texto estático
  dentro de un elemento que ya tiene su propio ID (p. ej. la etiqueta interna de un `btn`). Si la
  relevancia no es clara, no lo decidas por tu cuenta: repórtalo en "Casos que requieren consulta
  al usuario".
- **Iconos (`ico`)**: solo cuando el icono tiene interacción propia. Si el icono está dentro de un
  botón y no tiene acción independiente, el ID va únicamente en el botón; no agregues otro ID al
  icono.
- **Modales (`pop`) y cierre (`btn_close`)**: los modales/pop-ups usan `pop`. Los botones cuya
  función específica es cerrar un modal o pop-up usan `btn_close`. No uses `btn_close` para
  cualquier botón "Cancelar": solo cuando su función sea cerrar el modal/pop-up.
- **Elementos repetidos (`*ngFor` / `@for`)**: nunca uses un `data-id` estático que se repita en cada
  instancia; usa binding dinámico (`[attr.data-id]="'prefijo_' + identificador"`). Para diferenciar
  instancias usa un identificador estable de negocio (ID de entidad, código de registro, número de
  cuota/operación, ID de producto) — nunca valores aleatorios, UUID generados solo para el DOM,
  timestamps, texto variable o datos sensibles. El índice de iteración solo se considera cuando no
  existe ningún identificador estable, y debe reportarse como observación.
- **Unicidad**: todos los IDs deben ser únicos en el DOM renderizado. Antes de agregar uno,
  comprueba IDs existentes en el archivo, IDs propuestos durante la misma ejecución, elementos
  repetidos, componentes que puedan renderizarse múltiples veces y elementos similares en la misma
  pantalla.
- **Textos, títulos, párrafos, montos y datos de solo lectura**: usan `lbl` cuando son
  funcionalmente relevantes (ver la definición ampliada de `lbl` arriba). No uses `txt` (es para
  campos de texto editables), no uses `cnt` sobre el texto mismo (es para contenedores
  principales), y no inventes `ttl`, `pgh`, `val` ni ningún otro tipo. Si el valor está dentro del
  contenedor principal de una sección clave que sí cumple la definición de `cnt`, puedes
  identificar el contenedor además del `lbl` — pero no asumas que todo texto recibirá ID: solo
  cuando sea funcionalmente relevante para una prueba automatizada.

Ver ejemplos completos (antes/después) de cada categoría en `references/ejemplos.md`.

## Elementos que normalmente deben analizarse

Prioriza: acciones, entrada de datos, selección de opciones, navegación, validaciones, tablas
relevantes, modales, formularios, paginación, carga, drag-and-drop, tabs, secciones funcionales
clave, y elementos sobre los que probablemente se ejecutará una acción o validación automatizada.

## Elementos que NO deben recibir ID automáticamente

No agregues IDs indiscriminadamente a: wrappers de layout, `div` usados solo para flex/grid,
separadores visuales, elementos decorativos, iconos sin interacción, imágenes decorativas, cada
`span` interno, cada nivel de anidación, elementos internos de componentes BCP, elementos del
Shadow DOM, o tags sin relevancia para automatización. Cuando un elemento parezca importante pero
su relevancia o su tipo de control no sean claros, no lo descartes en silencio: repórtalo en
"Casos que requieren consulta al usuario".

## Tratamiento de IDs existentes

Antes de agregar un ID, comprueba si el elemento ya tiene uno. Clasifícalo en una de tres
categorías:

### 1. ID válido

Cumple formato, usa tipo oficial, tiene el bloque 1 correcto, es único y representa correctamente
el elemento. **Consérvalo sin cambios.**

### 2. ID no conforme — se corrige automáticamente

Tiene un defecto **estructural**, verificable sin juicio semántico:

- No tiene los tres bloques o no está en `snake_case` (camelCase, PascalCase, kebab-case,
  mayúsculas, espacios) — p. ej. `printButton`, `btnPrint`, `Blocks-Manager-Print`.
- Falta el bloque 1 (el ID empieza directamente por un tipo del catálogo, p. ej. `btn_print`).
- El bloque 2 está fuera del catálogo oficial, o usa una abreviatura explícitamente prohibida
  (`ttl`, `pgh`, `val`, `txt_value`, `text`, `amount`, `card`, `sec`, `msg`).
- Es un `data-id` estático repetido dentro de `*ngFor`/`@for` (debería ser `[attr.data-id]`
  dinámico).
- Está duplicado en el DOM renderizado.
- Contiene un valor prohibido: aleatorio, UUID generado para el DOM, timestamp o dato sensible.

La posición del atributo dentro del tag (ver "Ubicación del atributo `data-id` en el tag") se
corrige junto con el valor cuando ambas cosas aplican, y se corrige por sí sola —sin cambiar el
valor— cuando el `data-id` ya es válido pero no está al final del tag. En modo análisis, repórtalo
igual que un ID no conforme; en modo aplicación, corrígelo sin esperar autorización.

En **modo aplicación**, corrígelo: construye el reemplazo completo aplicando las reglas normales
de bloque 1/2/3, y reescribe el atributo en el HTML. En **modo análisis**, no lo modifiques —
preséntalo como propuesta. En ambos modos, repórtalo con el formato:

```
ID actual: printButton
ID propuesto: blocks_manager_btn_print
```

Antes de aplicar la corrección, busca el valor del ID antiguo como string dentro del alcance del
proyecto (`.ts`, `.spec.ts`, `.html`, `.scss`/`.css`, pruebas e2e accesibles). La corrección se
aplica siempre — no depende de si hay referencias — pero si encuentras coincidencias, repórtalas
con archivo y línea para que el usuario las actualice manualmente. **Nunca modifiques esos otros
archivos.**

Si un ID no conforme requiere un juicio semántico que no puede resolverse sin ambigüedad (no
puede determinarse el tipo correcto o el significado funcional del reemplazo), no lo corrijas:
trátalo como "Caso que requiere consulta al usuario" con la propuesta concreta que sí pudiste
construir.

### 3. ID mejorable — se propone, no se aplica

Es estructuralmente válido (formato correcto, tipo del catálogo, bloque 1 correcto, único), pero
podría representar mejor al elemento. Nunca se modifica sin autorización, ni siquiera en modo
aplicación: se agrega a la lista de "Mejoras sugeridas sobre IDs válidos" para que el usuario
decida. Ver esa sección para los criterios y el formato.

### Precedencia entre categorías

Si un ID tiene **cualquier** defecto estructural de la categoría 2, trátalo como no conforme
aunque además tenga defectos semánticos de la categoría 3 — el reemplazo ya se construye completo
y correcto, así que no lo listes también como mejorable.

## Modos de uso

**Modo análisis**: analiza HTML y TypeScript, detecta elementos relevantes, propone IDs,
identifica IDs existentes no conformes (como propuesta `ID actual` → `ID propuesto`), identifica
IDs mejorables (lista `M`), detecta duplicados, y presenta los casos dudosos como parte del
reporte (ver "Casos que requieren consulta al usuario"), sin esperar respuesta ni ejecutar el
"Punto de parada obligatoria" (ese punto es exclusivo de modo aplicación). **No modifica
archivos.**

**Modo aplicación**: realiza todo el análisis, agrega IDs únicamente a elementos claramente
clasificables, **corrige automáticamente los IDs no conformes** (ver "Tratamiento de IDs
existentes") y conserva IDs válidos sin cambios — todo esto se escribe primero, en todos los
archivos del alcance, antes de formular cualquier pregunta. Después ejecuta la primera pasada de
verificación y entrega el reporte de avance. Si quedan casos que requieren consulta, mejoras
sugeridas o ambigüedades bloqueantes, se detiene ahí (ver "Punto de parada obligatoria") y espera
la respuesta del usuario antes de aplicar mejoras o casos consultados, volver a verificar y
entregar el reporte final. La corrección de IDs no conformes ocurre siempre que la skill corre en
modo aplicación — no requiere que el usuario use el verbo "corregir" explícitamente.

Determina el modo por el verbo usado por el usuario: "analiza", "revisa", "evalúa", "propón" →
modo análisis; "agrega", "aplica", "implementa", "corrige" → modo aplicación. **Si sigue siendo
ambiguo, pregunta antes de modificar cualquier archivo.**

## Procedimiento obligatorio

**Fase 1 — Análisis**

1. Determinar el alcance solicitado (uno o varios componentes).
2. Identificar los archivos HTML involucrados.
3. Localizar los archivos TypeScript asociados.
4. Determinar el nombre funcional del componente dueño de cada HTML (bloque 1) — cada archivo el
   suyo propio.
5. Analizar componentes BCP, HTML nativo y componentes propios presentes.
6. Revisar bindings, interpolaciones, formularios, eventos y métodos relacionados.
7. Identificar elementos importantes para automatización.
8. Clasificar cada elemento usando únicamente el catálogo oficial (bloque 2).
9. Determinar el nombre funcional del tercer bloque (bloque 3) y convertirlo a `snake_case`.
10. Construir el ID.
11. Validar el formato aplicando la regla de parseo de "Formato obligatorio del ID".
12. Validar la unicidad.
13. Detectar elementos repetidos y resolverlos con identificador dinámico estable.
14. Clasificar cada ID existente en válido, no conforme o mejorable (ver "Tratamiento de IDs
    existentes").

**Fase 2 — Aplicación** (solo modo aplicación; en modo análisis se salta directo a la fase 3 sin
escribir ningún archivo)

15. Para cada ID no conforme: construir el reemplazo, buscar referencias externas al valor
    antiguo dentro del alcance, y aplicar la corrección.
16. Reunir los IDs mejorables en la lista de mejoras sugeridas, sin aplicarlas (ver "Mejoras
    sugeridas sobre IDs válidos").
17. Aplicar todos los `data-id` inequívocos y todas las correcciones, en **todos** los archivos
    del alcance, antes de pasar a la fase 3. Mientras quede una escritura pendiente por hacer, no
    se formula ninguna pregunta.

**Fase 3 — Verificación de lo aplicado y parada**

18. Ejecutar la primera pasada de verificación sobre lo ya aplicado (ver "Verificación final").
19. Emitir el reporte de avance (modo aplicación) o el reporte completo (modo análisis). En modo
    aplicación, si quedan casos que requieren consulta, mejoras sugeridas o ambigüedades
    bloqueantes, agruparlos y presentarlos con una única llamada a `AskUserQuestion`, terminando
    el turno ahí (ver "Punto de parada obligatoria"). En modo análisis no hay parada: todo se
    presenta como propuesta dentro del mismo reporte.

**Fase 4 — Cierre** (solo modo aplicación, y solo tras la respuesta del usuario en la fase 3)

20. Aplicar únicamente lo que el usuario aceptó, y ejecutar la segunda pasada de verificación.
21. Reportar cambios, correcciones, decisiones aplicadas y descartadas, mejoras y observaciones
    (ver "Reporte final").

## Restricciones estrictas

La skill **no debe**:

- Modificar lógica TypeScript, renombrar variables o métodos, cambiar formularios o
  `formControlName`, modificar eventos o properties.
- Modificar componentes BCP: inventar propiedades o eventos BCP, agregar imports, modificar
  estilos, agregar clases CSS.
- Cambiar textos visibles, reestructurar el HTML, reemplazar componentes o cambiar comportamiento.
- Usar IDs para estilos o para lógica de negocio.
- Crear nuevas abreviaturas ni cambiar el catálogo oficial.
- Asignar un tipo dudoso o forzar una clasificación sin consultarla en el "Punto de parada
  obligatoria".
- Agregar IDs duplicados, usar valores aleatorios, timestamps, o incluir información sensible.
- Renombrar un ID existente sin reportarlo en el reporte final. Corregir un ID no conforme está
  permitido (ver "Tratamiento de IDs existentes"); hacerlo sin dejar constancia, no.
- Modificar un ID válido, o aplicar una mejora sugerida sin autorización explícita del usuario.
- Modificar archivos `.ts`, `.spec.ts`, estilos u otros fuera del HTML en alcance, aunque
  contengan referencias al valor antiguo de un ID corregido.
- Modificar archivos fuera del alcance.

Las modificaciones habituales permitidas son **agregar el atributo `data-id`** en elementos HTML
claramente clasificables y **corregir el valor** de un `data-id` no conforme existente.

## Manejo de ambigüedades

Un elemento es ambiguo cuando: no puede determinarse el nombre del componente (bloque 1); no puede
determinarse el significado funcional; existen varias interpretaciones posibles; el HTML y el
TypeScript no dan suficiente contexto; no puede garantizarse la unicidad; el ID existente podría
estar referenciado externamente; o un identificador dinámico no tiene una clave estable. Los casos
de relevancia dudosa o tipo de control no claro se manejan con "Casos que requieren consulta al
usuario", no aquí.

En estos casos: no modifiques el elemento, explica qué se pudo determinar y qué falta, e indica
por qué no se agregó el ID. En modo aplicación estos casos se listan en el tramo `A` del "Punto de
parada obligatoria": son informativos salvo que, sin resolverlos, no se pueda continuar con el
resto del archivo (el caso típico es el bloque 1 indeterminado, del que dependen todos los IDs de
ese archivo) — solo entonces se presentan ahí como pregunta bloqueante. Formato:

```
Elemento ambiguo detectado.

Archivo: consulta.component.html
Elemento: <app-shared-widget></app-shared-widget>
Nombre funcional detectado: sin determinar.
Problema: el nombre del componente (bloque 1) no puede determinarse con seguridad — el archivo no
tiene .ts asociado en el alcance ni selector identificable.
Acción: no se agregó ID.
```

## Casos que requieren consulta al usuario

Hay dos disparadores obligatorios, distintos de las ambigüedades de la sección anterior:

1. **Bloque HTML posiblemente importante.** Un bloque que podría ser relevante para automatización
   pero cuya relevancia no es clara: contenedores candidatos a `cnt`, secciones que podrían ser
   funcionales o solo maquetación, componentes propios de función no evidente, bloques repetidos
   sin identificador estable.
2. **Bloque HTML claramente importante sin tipo de control claro.** El elemento es evidentemente
   relevante (recibe interacción, muestra un dato clave, es un componente propio central) pero
   ninguna fila del catálogo encaja de forma inequívoca, o encajan dos.

En ambos casos: no inventes el tipo, no fuerces la clasificación y no descartes el elemento en
silencio.

**Momento y forma.** Las preguntas se agrupan al final del análisis, nunca elemento por elemento.
Primero se aplican todos los IDs inequívocos; después se presenta una sola lista numerada con
archivo, elemento, motivo y una propuesta concreta (tipo + ID completo), para que la respuesta
pueda ser tan corta como "aplica 1 y 3":

```
Casos que requieren tu decisión:

1) Archivo: form-search.component.html
   Elemento: <h2>Resultados de la búsqueda</h2>
   Motivo: título de sección — relevancia para automatización no confirmada.
   Propuesta: lbl · form_search_lbl_search_results_title

2) Archivo: form-search.component.html
   Elemento: <div class="card-wrapper">
   Motivo: podría ser el contenedor principal de una sección clave (cnt) o solo un wrapper de
   layout.
   Propuesta: cnt · form_search_cnt_search_results  (o no asignar ID)

Indica cuáles aplicar.
```

**Integración con los modos.** En modo análisis, los casos dudosos se presentan como parte del
reporte, sin esperar respuesta. En modo aplicación, se aplican primero todos los IDs claros y
después estos casos se agrupan en el "Punto de parada obligatoria", junto con las mejoras
sugeridas y las ambigüedades bloqueantes, en una única llamada a `AskUserQuestion`; los elementos
consultados solo se modifican tras la respuesta del usuario.

## Mejoras sugeridas sobre IDs válidos

Un ID puede ser estructuralmente válido (formato correcto, tipo del catálogo, bloque 1 correcto,
único) y aun así representar al elemento de forma menos precisa de lo que el contexto permite. Este
caso es distinto de "ID no conforme" (ver "Tratamiento de IDs existentes"): aquí no hay un defecto
que corregir, hay una oportunidad de mejora que el usuario debe decidir aceptar o no.

Considera un ID mejorable cuando:

- El tipo pertenece al catálogo pero no corresponde a la función real del elemento (p. ej. `txt`
  sobre un monto de solo lectura, que debería ser `lbl`).
- El bloque 1 es un nombre válido pero no el del componente dueño del archivo (p. ej. un componente
  hijo que quedó con el prefijo del page), o es genérico (`page`, `main`, `view`, `screen`) pudiendo
  ser más específico.
- El bloque 3 es genérico (`text`, `value`, `item`, `field`…), está basado en posición, color o
  numeración secuencial, o es menos preciso que una fuente técnica disponible (p. ej.
  `..._btn_download` cuando el método asociado es `downloadPaymentSummary()`).
- El bloque 3 se derivó del texto visible existiendo un `formControlName` o método más preciso
  disponible en el TypeScript.
- El ID es inconsistente con el patrón de nombres de sus IDs hermanos en el mismo archivo.
- Un `[attr.data-id]` dinámico usa el índice de iteración existiendo un identificador estable de
  negocio disponible.

**Nunca apliques una mejora por tu cuenta**, ni siquiera en modo aplicación: siempre se propone y
se aplica solo tras la respuesta del usuario en el "Punto de parada obligatoria". Agrúpalas al
final, en una lista separada de "Casos que requieren consulta al usuario", numerada con el
prefijo `M` para no colisionar con esa numeración:

```
Mejoras sugeridas (opcionales — estos IDs ya cumplen el estándar):

M1) Archivo: summary-payment.component.html
    ID actual:    summary_payment_btn_download
    ID propuesto: summary_payment_btn_download_payment_summary
    Motivo: el bloque 3 se tomó del texto visible; el método asociado es
    downloadPaymentSummary(), que permite un nombre más preciso.

M2) Archivo: summary-payment.component.html
    ID actual:    summary_payment_txt_total_amount
    ID propuesto: summary_payment_lbl_total_amount
    Motivo: el elemento es un monto de solo lectura; txt es para campos editables.

Indica cuáles aplicar (p. ej. "1 y M2", "todas", "ninguna").
```

## Punto de parada obligatoria

Aplica únicamente en **modo aplicación**. En modo análisis no hay parada: los casos dudosos, las
ambigüedades y las mejoras se presentan dentro de un único reporte, sin bloquear (ver "Modos de
uso").

### Orden invariable

1. Escribe en disco **todos** los `data-id` sobre elementos claramente clasificables y **todas**
   las correcciones de IDs no conformes, en **todos** los archivos del alcance. Mientras quede una
   escritura pendiente por hacer, no se formula ninguna pregunta.
2. Ejecuta la primera pasada de verificación (ver "Verificación final").
3. Emite el reporte de avance con lo ya escrito (ver "Reporte final").
4. Reúne en un solo bloque de pendientes, con tramos separados y numerados de forma independiente:
   - `1) 2) 3)…` — casos que requieren consulta (formato de "Casos que requieren consulta al
     usuario").
   - `M1) M2)…` — mejoras sugeridas (formato de "Mejoras sugeridas sobre IDs válidos").
   - `A1) A2)…` — ambigüedades bloqueantes, si las hay (ver "Manejo de ambigüedades"): solo las
     que impidieron escribir un ID que de otro modo se habría aplicado.

   Omite cualquier tramo vacío.
5. Si al menos un tramo tiene contenido, llama a `AskUserQuestion` **una sola vez** y termina el
   turno ahí. Si los tres tramos están vacíos, no hay nada que preguntar: continúa directo al
   reporte final sin parada.

### Formato de la llamada a `AskUserQuestion`

- Pregunta: `¿Qué aplico de los casos pendientes?`
- Opciones (2 a 4, adaptadas a lo que realmente exista — omite las que no apliquen):
  - `Aplicar todos (1, 2, M1)` — listando los números reales presentes.
  - `Solo los casos dudosos (1, 2)` — si hay tramo `1)`.
  - `Solo las mejoras (M1, M2)` — si hay tramo `M)`.
  - `Ninguno — dejar como está`.
- La opción "Other" que agrega el propio harness cubre respuestas parciales como "aplica 1 y M2".

### Prohibido en este punto

- Ejecutar cualquier herramienta después de `AskUserQuestion` sin haber recibido respuesta.
- Continuar con otro archivo, componente o parte del alcance mientras haya una pregunta sin
  responder.
- Responder la pregunta por cuenta propia, o asumir "ninguna" / "todas" por defecto.
- Emitir el reporte final de cierre o declarar el trabajo terminado antes de la respuesta.
- Interpretar el silencio como conformidad.

Si la respuesta del usuario no resuelve todos los tramos pendientes, vuelve a preguntar solo por
lo que quedó sin resolver — no repitas lo ya decidido.

### Después de la respuesta

1. Aplica únicamente lo que el usuario aceptó.
2. Registra lo descartado como decisión del usuario, no como pendiente.
3. Ejecuta la segunda pasada de verificación.
4. Emite el reporte final.

## Verificación final

En modo aplicación esta verificación corre dos veces: una **antes** del punto de parada (sobre lo
ya escrito) y otra **después** de la respuesta del usuario (sobre el cierre completo). En modo
análisis corre una sola vez, sobre las propuestas.

### Primera pasada — antes del punto de parada

Lee de nuevo cada archivo HTML del alcance y confirma, sobre lo ya aplicado:

1. **Cobertura**: todo elemento relevante para automatización que fue clasificable sin ambigüedad
   tiene `data-id` — acciones, entrada de datos, selección de opciones, navegación, validaciones,
   tablas relevantes, modales, formularios, paginación, carga, drag-and-drop, tabs, secciones
   funcionales clave y textos de solo lectura relevantes (`lbl`).
2. **Formato**: cada ID tiene los tres bloques en `snake_case` y su bloque 2 pertenece al catálogo
   oficial, verificado con la regla de parseo de "Formato obligatorio del ID". Además, el atributo
   `data-id` está en la última posición del tag (ver "Ubicación del atributo `data-id` en el
   tag").
3. **Bloque 1 correcto**: todos los IDs de un archivo usan el nombre de ese componente; ningún ID
   de un componente hijo lleva el prefijo del page que lo contiene.
4. **Unicidad**: no hay `data-id` repetidos en el DOM renderizado; los elementos dentro de
   `*ngFor`/`@for` usan `[attr.data-id]` con identificador estable de negocio.
5. **IDs corregidos**: todo ID no conforme fue corregido (modo aplicación) o propuesto (modo
   análisis); ninguno quedó sin tratar. Cada corrección respeta el formato y la unicidad.
6. **Pendientes listados**: todo ID mejorable, todo caso dudoso y toda ambigüedad bloqueante
   aparece en el bloque de pendientes (tramos `1)`, `M)`, `A)`) — ninguno quedó sin listar. Esta
   pasada **no** exige que estén respondidos; eso corresponde a la segunda pasada.

Si detectas un faltante, corrígelo antes de emitir el reporte de avance (o añádelo al bloque de
pendientes si es dudoso). Declara el resultado de esta pasada en el reporte de avance.

### Segunda pasada — después de la respuesta del usuario

Solo en modo aplicación, y solo tras recibir la respuesta en el punto de parada (o directamente si
no hubo pendientes). Confirma:

- Lo aceptado por el usuario se aplicó, con el mismo formato y unicidad que la primera pasada.
- Lo descartado quedó registrado como decisión del usuario, no como pendiente.
- No queda ningún elemento, consulta ni mejora sin resolver.

Declara el resultado de esta pasada en el reporte final.

## Reporte final

En modo aplicación se entregan dos reportes en momentos distintos: el **reporte de avance** (antes
del punto de parada) y el **reporte final** (después de la respuesta del usuario, o directamente
si no hubo pendientes). En modo análisis se entrega un solo reporte, con el formato del reporte
final, sin `AskUserQuestion`.

### Reporte de avance

Se entrega al terminar la fase 3, inmediatamente antes de `AskUserQuestion`. Omite secciones
vacías. **No** incluye una frase de cierre tipo "finalizada" — el trabajo sigue abierto:

```
Avance de la aplicación del lineamiento de IDs.

Componente(s) detectado(s):
- summary_payment

Archivos analizados:
- summary-payment.component.html
- summary-payment.component.ts

Archivos modificados:
- summary-payment.component.html

IDs agregados:
- summary_payment_btn_continue
- summary_payment_tbl_direct_credits
- summary_payment_pop_confirmation
- summary_payment_btn_close_confirmation

IDs válidos conservados:
- summary_payment_txt_reference_number

IDs corregidos (no cumplían el estándar):
- printButton → summary_payment_btn_print
  Motivo: no usaba snake_case ni los tres bloques.
- summary_payment_msg_error → summary_payment_lbl_payment_error
  Motivo: msg es una abreviatura prohibida.
  ⚠ Referencia al ID anterior detectada en summary-payment.component.spec.ts:42 —
    actualízala manualmente.

Posibles duplicados:
- Ninguno.

Verificación (primera pasada):
- Cobertura: todos los elementos clasificables sin ambigüedad tienen data-id.
- Formato: 4/4 IDs con los tres bloques en snake_case y tipo del catálogo oficial.
- Bloque 1: correcto en el componente analizado.
- Unicidad: sin duplicados.
- Pendientes listados: 2 casos que requieren consulta, 2 mejoras sugeridas.

No se modificaron:
- Archivos TypeScript (incluidos los que referencian IDs corregidos).
- Lógica funcional.
- Estilos.
- Textos visibles.
- Propiedades o eventos BCP.
- Estructura del HTML.

Pendientes de tu decisión — ver la pregunta a continuación:

1) Archivo: form-search.component.html
   Elemento: <h2>Resultados de la búsqueda</h2>
   Motivo: título de sección — relevancia para automatización no confirmada.
   Propuesta: lbl · form_search_lbl_search_results_title

M1) Archivo: summary-payment.component.html
    ID actual:    summary_payment_btn_download
    ID propuesto: summary_payment_btn_download_payment_summary
    Motivo: el bloque 3 se tomó del texto visible; el método asociado es
    downloadPaymentSummary(), que permite un nombre más preciso.

M2) Archivo: summary-payment.component.html
    ID actual:    summary_payment_txt_total_amount
    ID propuesto: summary_payment_lbl_total_amount
    Motivo: el elemento es un monto de solo lectura; txt es para campos editables.
```

Inmediatamente después de este bloque, llama a `AskUserQuestion` **una sola vez** (ver "Punto de
parada obligatoria") y termina el turno ahí.

### Reporte final

Se entrega tras la respuesta del usuario (o directamente si no hubo pendientes):

```
Aplicación del lineamiento de IDs finalizada.

Decisiones aplicadas:
- 1) form_search_lbl_search_results_title
- M1) summary_payment_btn_download_payment_summary

Decisiones descartadas por indicación del usuario:
- M2) summary_payment_txt_total_amount → summary_payment_lbl_total_amount

Verificación (segunda pasada):
- Todo lo aceptado se aplicó con formato y unicidad correctos.
- No quedan elementos, consultas ni mejoras sin resolver.

No se modificaron:
- Archivos TypeScript (incluidos los que referencian IDs corregidos).
- Lógica funcional.
- Estilos.
- Textos visibles.
- Propiedades o eventos BCP.
- Estructura del HTML.
```

En modo análisis, usa el formato del "Reporte final" pero deja vacía o indica explícitamente la
sección "Archivos modificados" (no se modifica nada), presenta los IDs agregados y las
correcciones de IDs no conformes como **propuestas** (`ID actual` → `ID propuesto`), presenta los
casos consultados y las mejoras sugeridas sin esperar respuesta, y omite las secciones
"Decisiones aplicadas" / "Decisiones descartadas" y la llamada a `AskUserQuestion` — no aplican en
este modo, porque no hay parada.

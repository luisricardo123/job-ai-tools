# Ejemplos ilustrativos

Ejemplos de referencia para calibrar el nivel de detalle y el formato exacto de los cambios. No
copies literalmente estos nombres en otros componentes: cada caso real debe derivarse de su propio
contexto (HTML + TypeScript), siguiendo las prioridades definidas en `SKILL.md`.

## Componentes BCP

### Input dentro de un formulario

Antes:

```html
<bcp-input
  label="Referencia para la empresa"
  (ctrlChange)="changeReference()"
  bcpCtrlForm
  formControlName="referencePayroll"
  [message]="msgError('referencePayroll')"
  [state]="stateError('referencePayroll') || stateReferencePayroll()">
</bcp-input>
```

Después:

```html
<bcp-input
  label="Referencia para la empresa"
  (ctrlChange)="changeReference()"
  bcpCtrlForm
  formControlName="referencePayroll"
  [message]="msgError('referencePayroll')"
  [state]="stateError('referencePayroll') || stateReferencePayroll()"
  data-id="block_data_txt_reference_payroll">
</bcp-input>
```

### Botón con icono interno (el icono NO recibe ID propio)

Antes:

```html
<bcp-button
  full-width="true"
  shape="rectangle"
  tier="secondary"
  [disabled]="blocks.length === 0"
  (ctrlClick)="onDownload()">

  <bcp-icon
    name="print-b"
    slot="start"
    color="onsurface-800">
  </bcp-icon>

  Imprimir
</bcp-button>
```

Después:

```html
<bcp-button
  full-width="true"
  shape="rectangle"
  tier="secondary"
  [disabled]="blocks.length === 0"
  (ctrlClick)="onDownload()"
  data-id="blocks_manager_btn_print">

  <bcp-icon
    name="print-b"
    slot="start"
    color="onsurface-800">
  </bcp-icon>

  Imprimir
</bcp-button>
```

No se toca ninguna otra propiedad, evento, slot o texto del componente BCP: solo se agregó `data-id`.

## HTML nativo

```html
<button
  type="button"
  (click)="continue()"
  data-id="summary_payment_btn_continue">
  Continuar
</button>
```

```html
<input
  type="text"
  formControlName="documentNumber"
  data-id="summary_payment_txt_document_number">
```

## Componente propio que funciona como botón

```html
<app-download-action
  (download)="downloadPaymentSummary()"
  data-id="summary_payment_btn_download_payment_summary">
</app-download-action>
```

## Bloque 1 — cada componente usa su propio nombre

Escenario: un page invoca dos componentes hijos.

```html
<!-- consulta.component.html (page) -->
<form data-id="consulta_frm_query">...</form>
<app-form-search></app-form-search>
<app-results-list></app-results-list>
```

Correcto — cada componente hijo usa su propio nombre (bloque 1 = `form_search` / `results_list`),
no el del page que los invoca:

```html
<!-- form-search.component.html  →  bloque 1 = form_search -->
<bcp-input
  formControlName="documentNumber"
  data-id="form_search_txt_document_number">
</bcp-input>

<bcp-button (ctrlClick)="search()" data-id="form_search_btn_search">
  Buscar
</bcp-button>
```

```html
<!-- results-list.component.html  →  bloque 1 = results_list -->
<table data-id="results_list_tbl_results">
  ...
</table>
```

Incorrecto — heredar el prefijo del page dentro de un componente hijo:

```html
<!-- form-search.component.html -->
<bcp-input
  formControlName="documentNumber"
  data-id="consulta_txt_document_number">
</bcp-input>
```

`form-search.component.html` no es dueño del nombre `consulta`; es dueño de `form_search`, y ese es
el que debe usar en todos sus elementos.

## Contenedor principal de una sección clave (`cnt`)

Válido — es realmente la sección principal de créditos directos:

```html
<section data-id="summary_payment_cnt_direct_credits">
  <!-- Sección principal de créditos directos -->
</section>
```

Normalmente **no** debe recibir ID — es solo un wrapper de layout:

```html
<div class="d-flex align-items-center">
  ...
</div>
```

## Formulario completo (`frm`)

```html
<form
  [formGroup]="paymentForm"
  data-id="summary_payment_frm_payment_data">
  ...
</form>
```

Los controles internos reciben sus propios IDs cuando corresponda; `frm` no reemplaza los IDs de
los controles individuales.

## Tablas (`tbl`)

Tabla:

```html
<table data-id="summary_payment_tbl_direct_credits">
  ...
</table>
```

Fila dinámica (identificador estable de negocio, nunca índice de iteración ni valores aleatorios).
Como `data-id` no es una propiedad DOM nativa, el binding dinámico debe hacerse con `[attr.data-id]`,
no con `[data-id]`:

```html
@for (credit of credits; track credit.id) {
  <tr [attr.data-id]="'summary_payment_tbl_direct_credit_' + credit.id">
    ...
  </tr>
}
```

Celda dinámica:

```html
<td [attr.data-id]="'summary_payment_tbl_credit_amount_' + credit.id">
  {{ credit.amount }}
</td>
```

No agregues IDs a todas las filas/celdas de forma indiscriminada — solo a las específicas o
probablemente necesarias para una prueba automatizada.

## Textos y etiquetas (`lbl`)

Error general:

```html
<span data-id="summary_payment_lbl_payment_error">
  No se pudo procesar el pago.
</span>
```

Error de validación de campo:

```html
<span data-id="summary_payment_lbl_document_number_error">
  Ingresa un número de documento válido.
</span>
```

Título de sección relevante para automatización:

```html
<h2 data-id="summary_payment_lbl_direct_credits_title">
  Créditos directos
</h2>
```

Monto de solo lectura sobre el que probablemente se afirme un valor en una prueba automatizada
(nombre derivado de la propiedad del `.ts`, `totalDirectCreditsAmount`, no del texto visible):

```html
<span data-id="summary_payment_lbl_total_direct_credits_amount">
  {{ totalDirectCreditsAmount | currency }}
</span>
```

`lbl` cubre mensajes de error/validación, títulos, subtítulos, párrafos informativos, textos
generales, montos de solo lectura, fechas de solo lectura, saldos y resultados textuales — siempre
que el texto sea funcionalmente relevante para una prueba automatizada (algo que probablemente se
vaya a leer o afirmar). No lo recibe cada `span` de la pantalla: los textos decorativos, los
fragmentos partidos solo por maquetación, o el texto estático dentro de un elemento que ya tiene su
propio ID (p. ej. la etiqueta interna de un `btn`) no llevan `lbl`. Cuando la relevancia no sea
clara, no se decide por defecto: se reporta en "Casos que requieren consulta al usuario".

## Iconos interactivos (`ico`)

Icono con acción propia:

```html
<bcp-icon
  name="info"
  (click)="openInformation()"
  data-id="summary_payment_ico_open_information">
</bcp-icon>
```

Icono dentro de un botón sin acción independiente — el ID va solo en el botón:

```html
<bcp-button
  (ctrlClick)="print()"
  data-id="summary_payment_btn_print">

  <bcp-icon name="print-b"></bcp-icon>

  Imprimir
</bcp-button>
```

## Modales (`pop`) y botón de cierre (`btn_close`)

```html
<bcp-modal data-id="summary_payment_pop_confirmation">
  ...
</bcp-modal>
```

```html
<bcp-button
  (ctrlClick)="closeConfirmation()"
  data-id="summary_payment_btn_close_confirmation">
  Cerrar
</bcp-button>
```

`btn_close` solo aplica cuando la función específica del botón es cerrar un modal o pop-up — no
para cualquier botón "Cancelar".

## Elementos repetidos — evitar duplicados

Incorrecto (`data-id` estático repetido en cada instancia del `@for`):

```html
@for (credit of credits; track credit.id) {
  <tr data-id="summary_payment_tbl_direct_credit">
    ...
  </tr>
}
```

Correcto (binding dinámico con identificador estable de negocio, usando `[attr.data-id]`):

```html
@for (credit of credits; track credit.id) {
  <tr [attr.data-id]="'summary_payment_tbl_direct_credit_' + credit.id">
    ...
  </tr>
}
```

## Unicidad

Correcto:

```html
<bcp-button data-id="summary_payment_btn_continue">
  Continuar
</bcp-button>

<bcp-button data-id="summary_payment_btn_cancel">
  Cancelar
</bcp-button>
```

Incorrecto (mismo ID en dos elementos distintos):

```html
<bcp-button data-id="summary_payment_btn_action">
  Continuar
</bcp-button>

<bcp-button data-id="summary_payment_btn_action">
  Cancelar
</bcp-button>
```

## Determinar el bloque 3 a partir de HTML + TypeScript

```html
<span>{{ totalDirectCreditsAmount }}</span>
```

Revisa `totalDirectCreditsAmount` en el `.ts` y la sección en la que aparece: representa el monto
total de los créditos directos. El nombre funcional detectado es `totalDirectCreditsAmount`, que se
convierte a `snake_case` (`total_direct_credits_amount`) para el bloque 3. Como se trata de un
monto de solo lectura funcionalmente relevante, corresponde al tipo `lbl` (ver
`catalogo-tipos-control.md`):

```html
<span data-id="summary_payment_lbl_total_direct_credits_amount">
  {{ totalDirectCreditsAmount }}
</span>
```

La lección de este ejemplo: el nombre del bloque 3 se deriva del `.ts` (`totalDirectCreditsAmount`)
y no del texto visible ni del formato mostrado en pantalla. Si ese valor está además dentro del
contenedor principal de una sección clave, también se puede identificar el contenedor:

```html
<section data-id="summary_payment_cnt_direct_credits">
  <span data-id="summary_payment_lbl_total_direct_credits_amount">
    {{ totalDirectCreditsAmount }}
  </span>
</section>
```

## Casos que requieren consulta al usuario

Escenario: en modo aplicación sobre `form-search.component.html`, además de los elementos
claramente clasificables, aparece un título de sección y un `div` cuya función no es evidente. En
vez de asignar `lbl`/`cnt` por defecto o descartarlos en silencio, se dejan sin ID por ahora y se
agrupan al final, después de haber escrito ya todos los IDs inequívocos — ver "Punto de parada
obligatoria" en `SKILL.md`.

Primero se aplican y reportan los IDs inequívocos (reporte de avance):

```
Avance de la aplicación del lineamiento de IDs.

Archivos modificados:
- form-search.component.html

IDs agregados:
- form_search_txt_document_number
- form_search_btn_search

Pendientes de tu decisión — ver la pregunta a continuación:

1) Archivo: form-search.component.html
   Elemento: <h2>Resultados de la búsqueda</h2>
   Motivo: título de sección — relevancia para automatización no confirmada.
   Propuesta: lbl · form_search_lbl_search_results_title

2) Archivo: form-search.component.html
   Elemento: <div class="card-wrapper">
   Motivo: podría ser el contenedor principal de una sección clave (cnt) o solo un wrapper de
   layout.
   Propuesta: cnt · form_search_cnt_search_results  (o no asignar ID)
```

Inmediatamente después de este bloque se llama a `AskUserQuestion` una sola vez, con opciones como
`Aplicar todos (1, 2)`, `Solo el caso 1`, `Ninguno — dejar como está`, y el turno **termina ahí**:
no se ejecuta ninguna herramienta más, no se pasa a otro archivo y no se da el trabajo por
terminado hasta tener la respuesta.

Si el usuario responde, por ejemplo, "aplica 1, no el 2", recién entonces se aplica el caso 1, se
descarta el 2 como decisión explícita, se corre la segunda pasada de verificación y se entrega el
reporte final:

```
Aplicación del lineamiento de IDs finalizada.

Decisiones aplicadas:
- 1) form_search_lbl_search_results_title

Decisiones descartadas por indicación del usuario:
- 2) form_search_cnt_search_results (el usuario indicó no aplicar)
```

## Tratamiento de IDs existentes — las tres categorías

Ver `SKILL.md` ("Tratamiento de IDs existentes" y "Mejoras sugeridas sobre IDs válidos") para las
reglas completas. Un ejemplo de cada categoría:

### 1. ID válido — se conserva sin cambios

```html
<bcp-input ... data-id="summary_payment_txt_reference_number"></bcp-input>
```

Formato correcto, tipo del catálogo, bloque 1 correcto, representa bien al elemento. No se toca.

### 2. ID no conforme — se corrige automáticamente (modo aplicación)

Antes:

```html
<button (click)="print()" data-id="printButton">Imprimir</button>
```

`printButton` no usa `snake_case` ni los tres bloques del ID — es un defecto estructural. Se
corrige sin esperar autorización:

```html
<button (click)="print()" data-id="blocks_manager_btn_print">Imprimir</button>
```

Reporte:

```
ID actual: printButton
ID propuesto: blocks_manager_btn_print
```

Si `printButton` apareciera referenciado en otro archivo del alcance (p. ej.
`blocks-manager.component.spec.ts`), esa referencia se lista en el reporte con archivo y línea,
pero el `.spec.ts` no se modifica.

Caso aparte: un `data-id` cuyo **valor** ya es válido pero que no está en la última posición del
tag también se corrige sin esperar autorización, moviéndolo al final sin tocar su valor:

Antes:

```html
<bcp-input
  data-id="block_data_txt_reference_payroll"
  bcpCtrlForm
  formControlName="referencePayroll">
</bcp-input>
```

Después:

```html
<bcp-input
  bcpCtrlForm
  formControlName="referencePayroll"
  data-id="block_data_txt_reference_payroll">
</bcp-input>
```

### 3. ID mejorable — se propone, nunca se aplica solo

```html
<bcp-button (ctrlClick)="downloadPaymentSummary()" data-id="summary_payment_btn_download">
  Descargar
</bcp-button>
```

El ID es válido (formato correcto, tipo `btn` adecuado, bloque 1 correcto), pero el bloque 3
(`download`) es menos preciso de lo que permite el método asociado (`downloadPaymentSummary`). No
se modifica automáticamente; se agrega a la lista de mejoras sugeridas:

```
M1) Archivo: summary-payment.component.html
    ID actual:    summary_payment_btn_download
    ID propuesto: summary_payment_btn_download_payment_summary
    Motivo: el método asociado es downloadPaymentSummary(), que permite un nombre más preciso.
```

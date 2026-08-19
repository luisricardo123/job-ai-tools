# Catálogo de variantes de componente BCP

Fuente única de las **variantes de cada componente y el criterio de cuándo usar cada una** en las
webs de BCP. Un modelo puede ya saber que existe "un botón" o "un modal"; lo que falta y resuelve
este archivo es el criterio de elección: cuándo ese botón es de énfasis principal, secundario o de
menor compromiso; cuándo un mensaje va inline o flotante; cuándo una card reemplaza a un grupo de
radios.

Es agnóstico de librería: describe variantes y criterio de elección por función, nunca por nombre de
componente ni de librería (ver `SKILL.md`). Por M4, no describe la apariencia interna que cada
variante ya trae resuelta por el propio componente (color, forma, borde, animación) — solo el qué y
el cuándo.

Mismo formato de dos partes que el resto del catálogo:
- **Se aplica en silencio:** el criterio de elección — nunca se pregunta si el caso encaja
  claramente en una de las variantes descritas.
- **Variable (sí se pregunta):** el contenido concreto (textos, qué acción dispara) y cualquier
  caso que no encaje con claridad en ninguna variante descrita (fallback M2 — no se inventa).

IDs propios de este archivo, uno por componente: `V-BOTON#`, `V-TABLA#`, `V-MODAL#`,
`V-MENSAJE#`, `V-CARD#`, `V-BADGE#`, `V-LOADER#`, `V-ENLACE#`, `V-ERRORCARGA#`…

## Botón

### V-BOTON2 · Énfasis: principal para la acción de mayor compromiso, secundario para la que convive con ella, menor énfasis para volver/cancelar
- **Se aplica en silencio:** todo botón interactivo tiene uno de tres énfasis:
  - **Principal:** la acción de mayor compromiso de la vista o del paso (enviar, guardar y enviar,
    buscar, continuar).
  - **Secundario:** una acción que convive con la principal (p. ej. "Enviar a Pendiente de envío"
    junto a "Guardar y enviar"; "Descargar" junto a una acción principal; "Actualizar estados").
  - **Menor énfasis:** la acción de menor compromiso — volver (C12) o limpiar/reset de un formulario
    de búsqueda, que va inmediatamente a la izquierda del botón de búsqueda cuando el formulario lo
    incluye (C20).
- **Variable:** cuál acción concreta de la vista es la principal y cuáles son secundarias, si no es
  evidente por el contexto.

## Enlace

### V-ENLACE1 · Acción que abre un detalle relacionado con un bloque de datos: enlace inline, no botón
- **Se aplica en silencio:** una acción que abre un detalle relacionado con un bloque de datos (p.
  ej. "Ver documentos", "Ver aceptantes") se presenta como enlace inline, no como botón.
- **Variable:** el texto del enlace y a dónde lleva.

## Tabla

### V-TABLA2 · Columna de estado: se representa con la variante de badge (ver Badge/Estado)
- **Se aplica en silencio:** cuando una columna representa un estado, se muestra con la variante de
  badge de estado (ver Badge/Estado más abajo), nunca con otra representación ad hoc.
- **Variable:** el mapeo de color por valor de estado (V-BADGE2).

### V-TABLA3 · Acciones por fila: dentro de la columna de acciones de esa fila
- **Se aplica en silencio:** una acción de fila (p. ej. "Continuar", "Ver errores") se ubica dentro
  de la columna de acciones de esa fila — no suelta en otra columna ni fuera de la tabla.
- **Variable:** qué acciones concretas existen por fila y qué disparan.

## Card

### V-CARD1 · Una card puede agrupar varias sub-secciones de datos relacionadas
- **Se aplica en silencio:** cuando varios bloques de datos pertenecen a la misma entidad/operación
  (p. ej. "Datos de la operación" + "Detalle de documentos" de un mismo resumen), no es obligatorio
  usar una card por bloque (aunque C1 lo permitiría): pueden agruparse dentro de **una sola card**,
  cada bloque con su propio encabezado de sub-sección (C17) y separados entre sí por espacio visible
  (C15).
- **Variable:** cuáles bloques se agrupan juntos en una misma card — si no es evidente por
  pertenecer a la misma entidad/operación, se pregunta.

### V-CARD2 · Card seleccionable: opción dentro de un grupo de selección única
- **Se aplica en silencio:** cuando el usuario debe elegir una opción entre varias y cada opción
  necesita mostrar más de un dato (p. ej. un monto y una descripción), la opción se presenta como
  una card pequeña dentro de un grupo de cards, en vez de un grupo de radio buttons. Es la variante
  de "card" que reemplaza a un grupo de radios cuando una sola etiqueta no alcanza para describir
  cada opción.
- **Variable:** cuántas opciones hay, sus datos, y cuál (si alguna) viene seleccionada por defecto.

## Badge / Estado

### V-BADGE2 · Color por tipo de estado: no fijo, pero con mapeo semántico recomendado
- **Se aplica en silencio:** ninguno — el color de cada valor de estado se confirma para cada
  catálogo de estados concreto (no hay una asignación universal obligatoria).
- **Variable:** el color de cada valor se pregunta, ofreciendo como recomendación por defecto el
  mapeo semántico observado: **verde** = éxito/activo/vigente/completado, **amarillo** =
  en proceso/pendiente, **rojo** = error/rechazado, **azul** = neutro/informativo/cerrado
  (p. ej. "Cancelado" en el sentido de trámite finalizado, no de error). El usuario puede aceptar
  la recomendación o indicar otra asignación para su catálogo de estados concreto.

## Mensajería

### V-MENSAJE1 · Alerta informativa: canal inline, dentro del flujo de contenido
- **Se aplica en silencio:** un mensaje contextual ligado al estado de la vista (p. ej. un plazo
  límite) se muestra dentro del flujo normal de contenido (no superpuesto ni flotante), en el lugar
  de la vista donde corresponda por relevancia.
- **Variable:** el texto del mensaje y el tono/severidad (informativo, advertencia), si no es
  evidente por el contexto.

## Indicador de carga

### V-LOADER1 · Placeholder: ocupa la posición exacta del contenido que reemplaza
- **Se aplica en silencio:** mientras se carga una sección con contenido estructurado (p. ej.
  contador y tabla), se muestra un placeholder en la posición exacta donde ese contenido va a
  aparecer (p. ej. donde iría el contador, y donde irían las filas y columnas de la tabla). Por M4,
  no se describe la forma ni la animación del placeholder — solo que existe y qué posición ocupa.
- **Variable:** nada de la mecánica — es fija. Sí es variable cuánto contenido (cuántas
  filas/columnas) simula, según la sección que reemplaza.

## Estado de error de carga (recuperable)

### V-ERRORCARGA1 · Estado centrado con reintentar, distinto del estado vacío
- **Se aplica en silencio:** cuando una sección o la vista completa no logra obtener sus datos (una
  falla técnica, no la ausencia de resultados de una búsqueda), se muestra un estado centrado que
  ofrece **reintentar** la carga. Es una variante **distinta** del "estado vacío" (ese es para una
  búsqueda sin resultados; este es para un fallo al obtener los datos). Puede reemplazar una sección
  puntual (p. ej. bajo un formulario) o la vista completa, sin cambiar de composición.
- **Variable:** el texto del mensaje y qué acción dispara "Reintentar".

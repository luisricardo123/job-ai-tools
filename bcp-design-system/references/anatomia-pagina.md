# Anatomía de página BCP

Fuente única de la **estructura fija de página** de las webs de BCP: qué regiones existen en toda
pantalla, en qué orden van de arriba abajo, y cuáles varían según el tipo de vista (consulta,
detalle, wizard multi-paso, confirmación, menú de módulo). Es lo que hace que dos módulos
distintos, construidos por equipos distintos, se perciban como la misma web — más allá de que
compartan los mismos componentes.

Complementa a `convenciones-bcp.md` (C1-C16): aquellas convenciones fijan el layout **dentro** de
una vista (dónde va el contador, dónde el botón de búsqueda); este archivo fija el layout de **la
página como contenedor** de esa vista (qué envuelve al contenido, en qué orden), y cuáles son los
distintos "moldes" de página que existen.

Cada convención sigue el mismo formato que `convenciones-bcp.md`:
- **Se aplica en silencio:** lo que ya está resuelto — nunca se pregunta.
- **Variable (sí se pregunta):** lo único que depende de la pantalla concreta.

IDs propios de este archivo: `A1`, `A2`, `A3`… No reutilizan el namespace `C#` de
`convenciones-bcp.md`.

## Contexto: arquitectura de microfrontends

Las webs de BCP son **microfrontends**: cabecera, menú de navegación y migas de pan globales los
provee la shell que embebe al módulo — el propio módulo **nunca** los renderiza ni los describe.
Todo lo que sigue es exclusivamente la anatomía de lo que el módulo sí controla: el área de
contenido que la shell le entrega.

## A1 · Lo primero dentro del contenido: título, o "Volver" + título si hay navegación de vuelta
- **Se aplica en silencio:** lo primero que renderiza el módulo, arriba de todo, es el título
  principal de la vista (C6). **Excepción:** si la vista tiene navegación de regreso a una vista
  anterior, el botón "Volver" (C12) va primero, en su propia fila completa, y el título queda
  debajo de él, en la fila siguiente. Cuando la vista además tiene un indicador de progreso
  multi-paso, este se ubica entre "Volver" y el título (ver A5).
- **Variable:** si la vista concreta tiene o no navegación de vuelta.

## A2 · Título y acciones de nivel de vista: misma fila
- **Se aplica en silencio:** cuando existen acciones a nivel de vista completa (p. ej. "Descargar",
  "Descargar manual") — no las ya cubiertas por C2 (envío de formulario) o C4 (acciones de
  tabla) —, comparten la misma fila que el título principal: título a la izquierda, acción(es) a la
  derecha. Mismo patrón que C4, mudado del nivel de tabla al nivel de página.
- **Variable:** cuáles acciones existen y qué disparan.

## A3 · Debajo del título: texto instructivo de la vista, si aplica
- **Se aplica en silencio:** es habitual (no obligatorio) que justo debajo del título vaya una
  línea o párrafo corto de texto instructivo describiendo qué hacer en la vista (p. ej. "Valida los
  datos de la operación y envíala al banco."). Es texto estándar (no título — no aplica C6/C7).
- **Variable:** si la vista concreta lleva o no este texto, y su contenido.

## A4 · Ancho del contenido: 100% del disponible, con margen fijo (C16)
- **Se aplica en silencio:** el contenido del módulo no fija un ancho máximo propio ni se centra:
  ocupa el 100% del ancho que le entrega la shell, siempre respetando el margen horizontal y
  vertical fijo de C16 (nunca pegado a los bordes de su propio contenedor).
- **Variable:** nada — es fijo; no se pregunta.

## A5 · Vista de flujo multi-paso (wizard): indicador de progreso entre "Volver" y el título
- **Se aplica en silencio:** cuando una funcionalidad se completa en varios pasos secuenciales
  (p. ej. "Forma de ingreso → Datos generales → Aceptantes → Validación"), la página incluye un
  indicador de progreso (stepper — ver detalle de variante en `catalogo-variantes.md`) centrado,
  ubicado entre el botón "Volver" (A1) y el título de la vista. El título y el texto instructivo
  (A3) se mantienen iguales en cada paso del flujo (el título no cambia por paso, salvo que el
  usuario indique lo contrario). Al final de la página va una barra de acciones fija (ver A10).
- **Variable:** la cantidad y nombre de los pasos del flujo concreto.

## A6 · Vista de confirmación/resultado de una operación: anatomía propia, centrada
- **Se aplica en silencio:** al completarse una operación (envío, registro, solicitud), la vista de
  confirmación **no** sigue el patrón de A1-A2 (no hay "Volver" ni título alineado a la izquierda).
  En su lugar: un ícono ilustrativo centrado, un encabezado centrado confirmando el resultado, y una
  línea de subtítulo centrada indicando dónde seguir el estado (con la parte de navegación
  destacada con el color de acción). Debajo, si aplica, una alerta
  informativa (ver `catalogo-variantes.md`, Mensajería) con información relevante de plazo o
  siguiente paso. Debajo de eso, uno o más bloques de datos en card (C1) con el detalle de la
  operación realizada. Las acciones de esta vista (p. ej. "Nuevo pago", "Descargar") no van en la
  fila del título (no aplica A2 aquí) sino apiladas verticalmente al lado derecho del bloque de
  detalle.
- **Variable:** el ícono, el texto del encabezado/subtítulo, el contenido de los bloques de datos,
  y cuáles acciones existen.

## A9 · Vista de detalle: misma anatomía que una vista de consulta
- **Se aplica en silencio:** una vista de detalle (ver/editar un registro puntual) reutiliza la
  misma anatomía que una vista de consulta (A1-A4): "Volver" si aplica, título con posible acción
  en la misma fila (A2), bloques de datos en card (C1), y si incluye un listado propio, ese listado
  sigue las mismas convenciones de tabla (C3-C5, C10). No tiene una estructura envolvente
  distinta — lo único que cambia es el contenido central.
- **Variable:** nada de la estructura — es fijo; sí es variable el contenido concreto de cada
  bloque.

## A10 · Barra de acciones fija al final de un flujo multi-paso
- **Se aplica en silencio:** en una vista de flujo multi-paso (A5), las acciones de navegación del
  paso (cancelar, continuar, guardar, enviar) van en una barra al final de la página, visualmente
  distinguida del contenido, ordenadas según C20 (menor a mayor compromiso, izquierda a derecha):
  cancelar/salir del flujo a la izquierda; la o las acciones de avance (continuar, guardar y enviar,
  enviar a un estado intermedio) a la derecha.
- **Variable:** cuáles acciones concretas existen en cada paso y su texto.

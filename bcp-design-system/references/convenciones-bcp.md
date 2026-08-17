# Convenciones del sistema de diseño BCP

Fuente única de las convenciones **fijas** del sistema de diseño de las webs de BCP: patrones de
layout, agrupación y jerarquía que se repiten igual en todos los módulos. `SKILL.md` y cualquier
skill que consuma `bcp-design-system` las citan por su ID (C1…C20) — no las repiten.

Cada convención tiene dos partes:
- **Se aplica en silencio:** lo que ya está resuelto — nunca se pregunta, se registra directamente
  en el documento final.
- **Variable (sí se pregunta):** lo único de esa convención que depende de la pantalla concreta.

Este catálogo está pensado para **crecer**: cuando aparezca un patrón nuevo que se repita igual en
más de una pantalla, se agrega aquí con su propio ID, en vez de volver a preguntarlo cada vez.

## C1 · Buscadores y bloques de datos agrupados van en card
- **Se aplica en silencio:** todo formulario de búsqueda y todo bloque de pares etiqueta-valor de
  solo lectura (p. ej. "Producto: Producto 1", "Estado: Activo") va contenido dentro de una card.
- **Variable:** nada de estilo — solo el contenido (qué filtros tiene el formulario, qué datos
  muestra el bloque).

## C2 · Botón de búsqueda del formulario: abajo, a la derecha
- **Se aplica en silencio:** el botón que dispara la búsqueda va debajo de todos los filtros del
  formulario, alineado a la derecha.
- **Variable:** nada — la posición es fija. Solo se pregunta el texto del botón si no es "Buscar"
  por evidencia del contexto.

## C3 · Contador de resultados de tabla: arriba de la tabla, izquierda, formato fijo
- **Se aplica en silencio:** el contador va **arriba de la tabla** (nunca debajo ni junto a la
  paginación), alineado a la izquierda, con el formato exacto `[índice inicial
  de la página actual]-[índice final de la página actual] de [total de registros] [Entidad(s)]`,
  donde la porción `de [total de registros] [Entidad(s)]` va siempre **en negrita**. Ejemplo:
  `1-50 de **310 Clientes**`.
  - Esta es una convención de comportamiento numérico fija de la web de BCP, siempre igual sin
    importar la funcionalidad: el rango mostrado depende de la página actual y del tamaño de
    página, y el total es el conteo completo del resultado (todas las páginas), no solo de la
    página actual.
    - **Índice inicial** = (número de página actual − 1) × tamaño de página + 1.
    - **Índice final** = mínimo(número de página actual × tamaño de página, total de registros).
    - **Total de registros** es el mismo número en todas las páginas (no cambia al paginar).
    - En la última página el índice final coincide con el total, y esa página puede quedar
      parcial (con menos registros que el tamaño de página).
    - Ejemplo con 310 registros y 50 registros por página: página 1 → `1-50 de **310
      Registro(s)**`; página 2 → `51-100 de **310 Registro(s)**`; página 3 → `101-150 de **310
      Registro(s)**`; … última página (7) → `301-310 de **310 Registro(s)**`.
- **Variable:** el nombre de la entidad (singular/plural) que corresponde a esa tabla — se
  pregunta si no es evidente por el contexto. El total de registros, el tamaño de página y la
  página actual son datos de ejecución del prototipo, no se preguntan al usuario.

## C4 · Acciones de tabla: arriba de la tabla, extremo opuesto, misma fila que el contador
- **Se aplica en silencio:** las acciones relativas a la tabla completa (no las de una fila
  puntual) — p. ej. un botón de descarga — van **arriba de la tabla**, en el extremo opuesto al
  contador (C3), dentro de esa misma fila: contador a la izquierda, acciones a la derecha.
- **Variable:** cuáles acciones existen y qué disparan.

## C5 · Paginación de tabla: centrada
- **Se aplica en silencio:** la paginación va centrada, debajo de la tabla.
- **Variable:** opciones de tamaño de página disponibles y el valor por defecto; comportamiento al
  cambiar de página si es relevante.

## C6 · Título principal de la vista: nivel 1 de jerarquía
- **Se aplica en silencio:** el título principal de cada vista es siempre el nivel 1 de la jerarquía
  de título.
- **Variable:** nada — es fijo para todo título principal de vista.

## C7 · Títulos secundarios: nivel 2 de jerarquía
- **Se aplica en silencio:** cualquier título que no sea el principal de la vista (títulos de
  sección, subtítulos, rótulos de card de formulario) va un escalón por debajo del título principal:
  nivel 2 de la jerarquía.
- **Variable:** nada — es fijo para todo título secundario.

## C8 · Colores de fondo: nunca decorativos
- **Se aplica en silencio:** un color de fondo no se usa como decoración de un elemento genérico de
  interfaz (card, fila, sección, contenedor). Los componentes que sí llevan fondo de color por su
  propia función semántica (p. ej. un componente de mensajería o un indicador de estado) lo traen
  resuelto por el propio sistema de diseño — no es una excepción que esta skill deba listar caso a
  caso, es la mecánica interna de ese componente (M4).
- **Variable:** si el usuario menciona explícitamente un color de fondo puntual para un elemento
  genérico, esa excepción se registra (ver "Desviaciones" más abajo) — nunca se pregunta
  proactivamente por colores de fondo.

## C10 · Alineación de columnas de tabla: texto a la izquierda, números a la derecha, montos en negrita
- **Se aplica en silencio:** por defecto, las columnas de texto se alinean a la izquierda; las
  columnas numéricas (cantidades, conteos) se alinean a la derecha; las columnas de **montos**
  (importes de dinero) se alinean a la derecha y además van **en negrita**. El formato del valor de
  un monto (símbolo, separadores, decimales) lo fija C13, no esta convención.
- **Variable:** cualquier excepción a ese default (p. ej. una columna centrada, o un monto sin
  negrita) sí se confirma con el usuario.

## C11 · Filtro de rango de fechas: un solo componente
- **Se aplica en silencio:** un rango de fechas es un único componente aunque se vea como dos
  inputs (fecha inicio y fecha final): su valor es el rango completo, no dos valores
  independientes. Toda referencia a obligatoriedad, validación o estado se expresa sobre **el
  rango** como una sola unidad. Ejemplo correcto: "el rango de fechas es obligatorio". Ejemplo
  incorrecto: "el input de fecha inicio y el input de fecha final son obligatorios".
- **Variable:** el contenido — si el rango es obligatorio o no, el rango de fechas permitido, el
  valor por defecto.

## C12 · Botón "Volver": la acción de menor énfasis de la vista, primera región de la página
- **Se aplica en silencio:** todo botón cuya función es volver a la página/vista anterior usa el
  énfasis de menor compromiso del catálogo de botones (ver `catalogo-variantes.md`, V-BOTON2) y va
  en la posición fija que define A1 en `anatomia-pagina.md`.
- **Variable:** nada de posición o énfasis — es fijo. A lo sumo el texto del botón, si no es
  "Volver".

## C13 · Formato de montos (importes de dinero)
- **Se aplica en silencio:** todo monto se muestra como `[símbolo de moneda] [número]`, donde el
  número usa **coma como separador de millares**, **punto como separador decimal** y **siempre dos
  decimales** — sin importar si son exactos. Ejemplos: `S/ 123,456.12`, `S/ 0.00`, `$ 1,200.50`.
  El formato numérico es idéntico para cualquier moneda; lo único que cambia es el símbolo. `S/ ` es
  el símbolo por defecto (Soles) cuando el usuario no indica otra moneda. Esta convención define el
  **formato del valor**; la alineación a la derecha y la negrita de la columna de montos en tabla
  las define C10.
- **Variable:** la moneda concreta de cada monto (símbolo) si no es evidente por el contexto o si el
  usuario indica explícitamente una distinta a Soles.

## C15 · Separación entre secciones de una vista
- **Se aplica en silencio:** dentro de cada vista, las secciones/regiones (título, card de filtros,
  fila contador+acciones, tabla, paginación, bloques de datos, etc.) van separadas entre sí con
  espacio suficiente para que no se vean pegadas ni amontonadas; nunca quedan unas contra otras sin
  separación. No se requiere precisión de píxeles: basta con que exista una separación visible y
  consistente entre secciones contiguas.
- **Variable:** nada — es fijo para toda vista; no se pregunta.

## C16 · Márgenes de vista: existentes e iguales en todas las vistas
- **Se aplica en silencio:** toda vista tiene márgenes respecto a los bordes de la pantalla (el
  contenido nunca queda pegado a los bordes), y esos márgenes son **los mismos en todas las vistas**
  del prototipo. No se requiere precisión de píxeles: basta con que haya un margen visible uniforme
  e idéntico de una vista a otra.
- **Variable:** nada — es fijo; no se pregunta.

## C17 · Tercer nivel de título: encabezado de sub-sección dentro de una card
- **Se aplica en silencio:** más allá de C6 (nivel 1, título principal de vista) y C7 (nivel 2,
  título secundario), existe un tercer nivel de título: el encabezado de una sub-sección de datos
  **dentro** de una card (p. ej. "Datos del girador", "Detalle del pago", "Datos de la operación").
  Una misma card puede contener varias de estas sub-secciones (ver `catalogo-variantes.md`,
  V-CARD1). Cuál nivel usa cada tipo de card:
  - **Card de datos de solo lectura** (resumen, confirmación, detalle): cada bloque interno usa este
    nivel 3. No lleva un título de card separado — los encabezados de nivel 3 son el título.
  - **Card de formulario/búsqueda** (C1): el título propio de la card (p. ej. "Búsqueda de
    financiamientos") y cualquier rótulo de grupo de campos dentro de ella usan el nivel 2 (C7), no
    el nivel 3.
- **Variable:** el texto de cada encabezado de sub-sección.

## C20 · Orden de un par de acciones en la misma fila: menor a mayor compromiso, izquierda a derecha
- **Se aplica en silencio:** cuando dos o más acciones conviven en una misma fila (p. ej. cancelar +
  continuar en una barra de flujo — A10 —, o limpiar + buscar en un formulario — C2), van ordenadas
  de **menor a mayor compromiso**, de izquierda a derecha: la acción de menor énfasis (cancelar,
  limpiar) primero; la de mayor compromiso (guardar, enviar, confirmar) al final.
- **Variable:** cuáles acciones concretas participan y su texto — el orden relativo entre ellas no
  se pregunta.

---

## Meta-reglas de uso del catálogo

Las meta-reglas de proceso completas (M1-M4) viven en `../SKILL.md` — aquí solo se resumen en el
contexto de este catálogo.

### Fallback: lo no cubierto, se pregunta (M2)
Si un aspecto de layout o agrupación de un elemento **no** está cubierto por ninguna convención
C1–C20, rige el principio general "no inventar": se pregunta como cualquier otro dato, nunca se
asume en silencio ni se inventa una convención que no esté escrita aquí.

### Desviaciones: gana lo que diga el usuario (M3)
Si en algún momento el usuario describe explícitamente algo que **contradice** una convención (p.
ej. "el contador va a la derecha"), esa descripción prevalece. La desviación se describe en el
documento final como el comportamiento definitivo de ese elemento, en su layout o detalle
correspondiente — nunca se aplica la convención por encima de lo que pidió el usuario, y nunca se
deja la excepción implícita.

El formato con el que se presentan las preguntas que sí surgen de este catálogo (listar opciones,
bloques de preguntas, etc.) no es parte de estas convenciones — es una convención general de cómo
preguntar, propia de cada skill consumidora (ver, p. ej., "Tono al hacer preguntas" en
`spec-prototype/SKILL.md`).

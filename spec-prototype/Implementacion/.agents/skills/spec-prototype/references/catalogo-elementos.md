# Catálogo de elementos y sus detalles a capturar

Para cada tipo de elemento presente en una vista, esta es la lista de detalles que hay que
recopilar (preguntando al usuario lo que no se pueda inferir con confianza). Es una guía de
preguntas, no un catálogo cerrado: si aparece un elemento que no está aquí, aplica el mismo
criterio general — capturar todo detalle de layout y funcional necesario para que no quede
ambigüedad — y documéntalo igual en el bloque 4 correspondiente.

No uses nombres de componentes ni tecnologías al preguntar o documentar: refiérete a los elementos
por su función (botón, tabla, selector, etc.), nunca por el nombre de una librería o framework.
Tampoco preguntes ni documentes la apariencia interna que cada componente ya trae resuelta por el
propio sistema de diseño (color de borde, forma, animación) — ver M4.

Las convenciones fijas del sistema de diseño BCP viven en la skill `bcp-design-system`: cards,
contador, posición del botón de búsqueda, paginación, niveles de título, roles de color, alineación
de columnas, formato de montos (`convenciones-bcp.md`, C1-C20); estructura de página y anatomía de
vista (`anatomia-pagina.md`, A1-A10); y variantes de componente con su criterio de elección — énfasis
de botón, mensajería, badges, etc. (`catalogo-variantes.md`, V-#). Las
reglas de proceso que gobiernan cómo se usan (aplicar en silencio, fallback, desviaciones,
componentes con mecánica visual fija) son M1-M4, en el `SKILL.md` de `bcp-design-system`; las propias
de esta skill (columnas largas, layout de inputs de formulario, columnas de significado ambiguo,
datos con varios formatos posibles, paginación por front) son R6-R10, en
`references/reglas-obligatorias.md`. Este catálogo cita todas por ID donde aplican — cárgalas antes
de preguntar, no las repitas. Donde una convención ya resuelve el layout, la agrupación o el criterio
de elección de un elemento, **no se pregunta**: solo se captura lo que quede marcado como variable en
esa convención.

## Título principal (heading de vista o sección)
- Nivel de jerarquía: resuelto por convención — C6 si es el título principal de la vista, C7 si es
  un título secundario o rótulo de card de formulario, C17 si es el encabezado de una sub-sección
  dentro de una card de datos de solo lectura. No se pregunta.

## Botón
- Si el botón es para **volver a la página/vista anterior**: es la acción de menor énfasis y su
  posición está resuelta por convención (C12, A1). No se pregunta nada de estilo o posición; a lo
  sumo el texto si no es "Volver".
- ¿Tiene texto? ¿cuál?
- ¿Tiene ícono? ¿a la izquierda o a la derecha del texto? ¿o es un botón solo de ícono?
- Énfasis/importancia: si el botón es la acción de mayor compromiso de la vista/paso (principal),
  una acción secundaria que convive con esa principal (secundario), o la de menor compromiso —
  volver, limpiar/reset— resuelto por convención (V-BOTON2); solo se pregunta si el rol del botón no
  es evidente por el contexto.
- Bajo qué condición pasa a deshabilitado, si aplica.
- ¿Ocupa el ancho disponible o es de ancho ajustado al contenido?
- ¿Qué acción dispara al presionarlo? (ver bloque de interacciones)
- Posición/alineación respecto a los demás elementos del bloque en el que está: si el botón cae
  bajo una convención ya definida (p. ej. es el botón de envío de un formulario → C2, o de acción
  de tabla → C4, o de volver → C12), se aplica en silencio. Si convive con otra acción en la misma
  fila, el orden entre ambas lo resuelve C20. Si no, y tampoco es evidente por una convención
  universal, se pregunta (fallback M2).

## Tabla
- Nombres de las cabeceras de columna, en orden. Si alguno supera los 16 caracteres, aplica (R6).
- Si el nombre de alguna columna no deja claro qué dato contiene, aplica (R8): se pregunta siempre
  qué dato representa y 2-3 valores de ejemplo — aunque el nombre sea corto y no dispare R6.
- Si alguna columna contiene un dato con varios formatos posibles (fechas, horas, porcentajes,
  códigos), aplica (R9): se pregunta el formato una vez por tipo de dato. Los montos quedan fuera —
  su formato ya lo resuelve C13.
- Alineación de cada columna: texto a la izquierda; números/cantidades a la derecha; **montos**
  (importes de dinero) a la derecha y **en negrita** — todo resuelto por convención (C10); solo se
  confirman las excepciones a ese default. El formato del valor de cualquier columna de montos
  (símbolo de moneda, coma de millares, punto decimal, siempre dos decimales — p. ej.
  `S/ 123,456.12`) está resuelto por convención (C13); no se pregunta, salvo la moneda si no es
  evidente por el contexto.
- ¿Reordenamiento de filas? Si sí, ¿cuáles columnas permiten ordenar y cuál es el orden por
  defecto (ascendente/descendente, y por qué columna)?
- ¿Reordenamiento de columnas (drag para cambiar el orden de las columnas)? Si sí, ¿cuáles pueden
  reordenarse?
- ¿Paginación? Si sí: posición centrada resuelta por convención (C5); la tabla recibe siempre la
  totalidad de los registros y pagina por front sobre ese conjunto completo (R10) — no se pregunta
  ese mecanismo. Solo se pregunta las opciones para cambiar la cantidad de filas por página y cuál
  es el valor por defecto.
- ¿Contador de resultados? Posición (**arriba de la tabla**, izquierda), formato del texto y
  comportamiento numérico por página resueltos por convención (C3): `[índice inicial]-[índice
  final] de [total de registros] [Entidad(s)]`, con `de [total de registros] [Entidad(s)]` en
  negrita; el rango se recalcula en cada página según su tamaño y el total no cambia al paginar (ver
  C3 para la fórmula y el ejemplo). Solo se pregunta el nombre de la entidad (singular/plural) si no
  es evidente por el contexto.
- ¿Acciones a nivel de tabla completa (no de fila, p. ej. un botón de descarga)? Posición resuelta
  por convención (C4): **arriba de la tabla**, extremo opuesto al contador, misma fila. Solo se
  pregunta cuáles acciones existen y qué disparan.
- ¿Alguna columna representa un estado? Se representa con la variante de badge (V-TABLA2); el color
  por valor no es fijo, pero se pregunta ofreciendo el mapeo semántico recomendado (V-BADGE2) —
  verde éxito, amarillo en proceso, rojo error, azul neutro/cerrado.
- ¿Algún otro valor de columna tiene un estilo condicional distinto a un estado? (p. ej. un monto
  negativo resaltado). ¿Cuál es la regla y cuál el estilo?
- ¿Hay acciones por fila (dentro de la columna de acciones de esa fila, resuelto por convención —
  V-TABLA3)? Solo se pregunta cuáles acciones existen y qué disparan.
- ¿Se pueden seleccionar filas (checkboxes por fila)? ¿para qué se usa esa selección?
- Estado vacío específico de la tabla (si difiere del estado vacío general de la vista); distinto
  del estado de error de carga (falla técnica al obtener los datos, no ausencia de resultados —
  V-ERRORCARGA1).

## Selector / dropdown
- Todas las opciones disponibles, en el orden en que deben aparecer.
- ¿Hay una opción seleccionada por defecto? ¿cuál?
- ¿Permite selección múltiple o es de selección única?
- ¿Tiene buscador interno para filtrar las opciones?
- Texto de placeholder cuando no hay selección.
- ¿Alguna opción está deshabilitada o condicionada?

## Campo de texto / área de texto
- Texto de placeholder.
- Valor inicial (si aplica).
- Validaciones (obligatorio, formato, longitud mínima/máxima, etc.) y el mensaje de error
  correspondiente. No se pregunta cómo se presenta visualmente el error — lo resuelve el propio
  componente.
- Formato o máscara especial (fecha, moneda, teléfono, etc.), si aplica. Para moneda, el formato del
  valor (símbolo, coma de millares, punto decimal, siempre dos decimales) está resuelto por
  convención (C13); no se pregunta, salvo la moneda concreta si no es evidente por el contexto. Para
  cualquier otro dato con varios formatos posibles (fecha, hora, etc.), aplica (R9) — se pregunta el
  formato, una sola vez por tipo de dato a nivel de todo el prototipo.

## Checkbox / radio button / interruptor (toggle)
- Opciones disponibles (para radio/toggle con más de dos estados).
- Estado inicial (marcado/desmarcado, o cuál opción viene seleccionada).
- Si son varios juntos: ¿son mutuamente excluyentes (radio) o independientes (checkbox)?

## Formulario / buscador
- Contenido en card resuelto por convención (C1); posición del botón de envío (abajo, a la
  derecha de todos los campos) resuelta por convención (C2). No se pregunta ninguna de las dos.
- Qué campos contiene (referenciar a los elementos individuales ya detallados arriba).
- Orden y disposición de los campos entre sí (en fila, en columna, agrupados, qué campo va dónde):
  ningún campo queda sin posición definida — **se pregunta/confirma siempre de forma explícita**
  (R7), salvo que el usuario ya la haya descrito por completo sin que se le preguntara.
- Qué acción dispara el envío (botón dedicado, tecla enter, envío automático al cambiar un campo).
- ¿Hay validación antes de permitir el envío? ¿qué pasa si falla?
- Qué ocurre tras un envío exitoso (ver bloque de interacciones).

## Bloque de datos agrupados (pares etiqueta-valor de solo lectura)
Ejemplo: una sección que muestra "Producto: Producto 1", "Estado: Activo", "Cantidad: 3", etc.
- Contenido en card resuelto por convención (C1); su encabezado usa el nivel de título C17; varios
  bloques relacionados pueden compartir una sola card, separados por espacio (V-CARD1) — ninguno de
  estos tres puntos se pregunta.
- Qué datos muestra y en qué orden.

## Contador de resultados
- Posición (izquierda), formato y comportamiento numérico por página resueltos por convención (C3),
  igual que el contador de tabla. Solo se pregunta el nombre de la entidad si no es evidente por el
  contexto.
- En qué momento aparece y en qué momento se actualiza.

## Paginación
- Posición centrada resuelta por convención (C5). No se pregunta.
- Gestión por front sobre la totalidad de los registros ya recibidos, resuelta por convención (R10).
  No se pregunta ese mecanismo.
- Opciones de tamaño de página disponibles y el valor por defecto.

## Tabs / pestañas
- Posición de las pestañas respecto al título y al resto del contenido de la vista.
- Nombre de cada pestaña, en orden.
- Cuál pestaña está activa por defecto.
- Qué contiene cada pestaña (referenciar a la vista o sección correspondiente).

## Esqueleto de carga (skeleton)
- Si reemplaza una sección con contenido estructurado (p. ej. contador y tabla): ocupa la posición
  exacta de ese contenido, resuelto por convención (V-ESQUELETO1, M4) — no se pregunta ni se
  redescribe su forma o animación; sí es variable cuánto contenido simula.
- Qué acción dispara su aparición.
- Dónde se muestra (reemplaza todo el contenido, aparece superpuesto, aparece solo en la sección
  afectada) si no es el caso de placeholder ya cubierto arriba.
- Duración simulada esperada, si el usuario la especifica (útil para un mock realista).

## Lista / tarjetas (cards)
- Si es una card seleccionable dentro de un grupo de opciones (V-CARD2): usarla en vez de un grupo
  de radios cuando cada opción necesita mostrar más de un dato — la marca de selección la resuelve
  el propio componente. Solo se pregunta cuántas opciones hay, sus datos y cuál viene seleccionada
  por defecto.
- Qué datos muestra cada tarjeta y en qué orden dentro de la tarjeta.
- Orden de las tarjetas entre sí (si hay un criterio) y si se puede cambiar.
- Acciones disponibles por tarjeta.

## Fecha / selector de fecha
- Formato de fecha mostrado: aplica (R9) — se pregunta una sola vez por tipo de dato a nivel de todo
  el prototipo (no por cada campo de fecha), y rige también cualquier otra fecha que aparezca en
  columnas de tabla o bloques de datos.
- Rango permitido (si aplica) y valor por defecto.
- Si el filtro es un **rango de fechas** (fecha inicio + fecha final), es un solo componente cuyo
  valor es el rango completo (C11): su obligatoriedad y validaciones se capturan y documentan sobre
  el rango como una sola unidad, nunca sobre cada input por separado.

## Enlaces
- Si abre un detalle relacionado con un bloque de datos, se presenta como enlace inline, no como
  botón (V-ENLACE1). No se pregunta esa elección.
- Texto del enlace.
- A dónde lleva (otra vista, sección, o recurso externo).

## Ícono interactivo (con acción propia, no decorativo)
- Qué ícono representa (su significado funcional).
- Qué acción dispara al interactuar con él.

## Alerta informativa inline (banda de mensaje dentro del flujo de contenido)
- Canal (inline, dentro del flujo normal de contenido) resuelto por convención (V-MENSAJE1). No se
  pregunta.
- Texto del mensaje y el dato clave que resalta.
- En qué vista/momento aparece.

## Estado vacío (como elemento a nivel de vista o sección)
- Texto o mensaje mostrado.
- ¿Incluye alguna acción sugerida (p. ej. un botón para limpiar filtros)?
- Distinto del **estado de error de carga** (fallo técnico al obtener datos, no ausencia de
  resultados de una búsqueda): ese último ofrece reintentar, resuelto por convención
  (V-ERRORCARGA1), sustituyendo una sección o la vista completa. No se pregunta su presentación,
  solo si aplica a la vista y el texto del mensaje.

## Etiqueta / distintivo de estado (badge)
- Valores posibles y su texto.
- Color asociado a cada valor: no es fijo, pero se pregunta ofreciendo como recomendación el mapeo
  semántico de convención (V-BADGE2) — verde éxito, amarillo en proceso, rojo error, azul
  neutro/cerrado.
- ¿Alguno de los valores necesita una aclaración secundaria adicional (p. ej. "Rechazada" + "Por
  usuario")? Se pregunta si aplica y su texto.

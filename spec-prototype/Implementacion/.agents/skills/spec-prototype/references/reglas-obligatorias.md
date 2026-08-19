# Reglas de proceso transversales

Esta es la **fuente única** de las reglas de proceso propias de la entrevista de esta skill.
`SKILL.md` y `references/catalogo-elementos.md` las citan por su ID (R6, R7, R8, R9, R10) — no las
repiten.

Las meta-reglas que gobiernan **cómo se usa** el sistema de diseño BCP (aplicar en silencio,
fallback, desviaciones, componentes con mecánica visual fija) son M1-M4 y viven en la skill
`bcp-design-system` (`SKILL.md` de esa skill) — no aquí. El catálogo de convenciones fijas en sí
(qué se aplica en silencio y qué queda variable) vive en las references de esa misma skill
(`bcp-design-system/references/convenciones-bcp.md`, `bcp-design-system/references/anatomia-pagina.md`,
`bcp-design-system/references/catalogo-variantes.md`).

## R6 · Nombres de columna de tabla demasiado largos
Al capturar los nombres de las cabeceras de una tabla, si algún nombre supera los **16 caracteres**:
- Señala explícitamente que es demasiado largo.
- Propone entre 2 y 4 abreviaciones posibles, marcando tu recomendación y por qué.
- El usuario decide siempre cuál abreviación usar, o si prefiere mantener el nombre completo —
  nunca lo decidas por él.

## R7 · Layout de inputs de formulario: siempre se pregunta
Para todo formulario, el orden y la posición relativa exacta de sus inputs (en fila, en columna,
agrupados en secciones, qué campo va dónde respecto a los demás) **se pregunta/confirma siempre de
forma explícita** con el usuario — nunca se asume ni se da por evidente, por más obvia que parezca
la disposición. Excepción: si el usuario ya describió esa disposición **por completo** sin que se le
preguntara, no hace falta repetir la pregunta. Si la describió solo parcialmente, se pregunta lo que
falte — completar una descripción parcial no es "repreguntar lo ya dejado claro" (ver "No inventar"
y "Tono al hacer preguntas" en `SKILL.md`), es cubrir un vacío que sigue abierto.
- Esto **no** contradice M1: las partes del formulario ya resueltas por convención (C1 — contenido
  en card; C2 — posición del botón de envío) se siguen aplicando en silencio. R7 solo vuelve
  obligatoria la pregunta sobre el **arreglo interno de los campos entre sí**, que ninguna
  convención C1-C16 resuelve.
- Igual que en el resto de la skill, no se requiere precisión de píxeles: alcanza con que el orden
  relativo y el agrupamiento de los inputs queden inequívocos.

## R8 · Columna de tabla de significado ambiguo: siempre se pregunta
Al capturar las cabeceras de una tabla, si el nombre de una columna **no deja inequívocamente claro
qué dato contiene** (p. ej. "Situación", "Tipo", "Estado"), se pregunta siempre — no es fallback
opcional ni depende de que el usuario lo mencione primero: ante la duda sobre el significado de una
columna, se pregunta.
- **Qué se pregunta, las dos cosas juntas:**
  1. Qué dato representa exactamente esa columna.
  2. Qué valores concretos puede tomar (2-3 ejemplos reales).
- Si el significado admite listarse como opciones, se listan como (a)/(b)/(c) con la recomendación
  marcada, dejando siempre una opción abierta para que el usuario indique otra cosa (ver "Tono al
  hacer preguntas" en `SKILL.md`).
- Ejemplo: una columna "Situación" en una tabla de trámites — se pregunta si representa el estado
  del trámite, el estado del cliente, u otra cosa, y qué valores concretos toma (p. ej. "En
  proceso", "Aprobado", "Rechazado").
- **Independiente de R6:** un nombre corto y válido frente a R6 puede seguir siendo ambiguo de
  significado. Ambas reglas pueden dispararse sobre la misma columna (nombre largo *y* significado
  poco claro) sin excluirse.
- El significado se registra en el detalle de la tabla (bloque 4); los valores de ejemplo
  alimentan los datos mock (bloque 7).

## R9 · Dato con varios formatos posibles: se pregunta una vez por tipo de dato
Cuando un dato del prototipo admite más de una representación válida y ninguna convención BCP la
fija, **se pregunta el formato** — nunca se asume el más común. Aplica en cualquier contexto donde
aparezca ese dato: columna de tabla, input, bloque de pares etiqueta-valor, texto de un mensaje.
- **Casos típicos:** fechas (`12/07/2026` · `2026-07-12` · `12 de julio de 2026`), fecha con hora,
  horas (12h vs 24h), porcentajes (cantidad de decimales, posición del `%`), números de documento o
  códigos con separadores/máscara.
- **Granularidad — una pregunta por tipo de dato, no por campo:** el formato se pregunta **una sola
  vez por tipo** (todas las fechas del prototipo, todos los porcentajes) y se aplica a todas sus
  apariciones. Al preguntarlo, se ofrece explícitamente la opción de que alguna aparición difiera;
  si el usuario la marca, esa excepción se captura y se documenta sobre el elemento concreto donde
  aplica.
- Las opciones se listan como (a)/(b)/(c) con una recomendación, más una opción abierta para "alguna
  difiere" (ver "Tono al hacer preguntas" en `SKILL.md`).
- **No aplica a montos:** el formato de los importes de dinero ya está resuelto por C12 y se aplica
  en silencio (M1) — ahí solo la moneda sigue siendo variable, según C12.
- El formato se registra en el detalle del elemento donde aparece el dato (bloque 4) y rige la
  generación de los datos mock (bloque 7), que deben respetarlo.
- **Relación con R8:** son independientes y pueden dispararse sobre la misma columna — R8 resuelve
  *qué dato es*, R9 resuelve *cómo se escribe*. Si R8 revela que una columna contiene fechas, R9
  entra a continuación sobre esa columna.

## R10 · Paginación de tabla: siempre del lado del cliente (front)
La tabla recibe de una sola vez la **totalidad** de los registros del resultado; la paginación se
resuelve sobre ese conjunto completo ya cargado, sin volver a consultar el origen de datos al
cambiar de página. El prototipo no implementa carga por página ni paginación por servidor.
- Es una decisión de implementación de esta skill, no una convención visual de `bcp-design-system`:
  no se pregunta, se aplica siempre.
- Consecuencia sobre los datos mock (bloque 7 / "Datos de ejemplo"): deben generarse **todos** los
  registros que se quieran demostrar de una vez, no solo los de la primera página.
- El tamaño de página y sus opciones siguen siendo variables de C5; el formato y cálculo del
  contador siguen siendo los de C3 (que ya opera sobre el total completo de registros, no solo
  sobre la página cargada).

El formato con el que se presentan las preguntas que sí surgen (si admiten listarse como opciones a
elegir) no es parte de estas reglas — es una convención general de cómo preguntar, válida para
cualquier pregunta de la skill. Ver "Tono al hacer preguntas" en `SKILL.md`.

---
name: spec-prototype
description: >
  Recopila y organiza toda la información necesaria sobre una funcionalidad (objetivo, vistas,
  elementos, layout, detalle de cada elemento, interacciones y comportamientos) y produce una
  especificación de prototipo en `.prototype-specs/`, lista para entregarse a un agente que genere
  el código de una prueba de concepto funcional con la que los usuarios puedan interactuar. Es para
  módulos de las webs de BCP: aplica el sistema de diseño del banco, pero es agnóstica de stack —no
  menciona Angular, HTML ni nombres de librería— y no escribe código. Úsala cuando el usuario pida
  un prototipo, una prueba de concepto o una maqueta funcional de una pantalla. No la uses para
  implementar el prototipo ni para especificar lógica de negocio de producción.
user-invocable: true
disable-model-invocation: true
argument-hint: 'funcionalidad o pantalla a prototipar'
---

# Especificación de prototipo

Recopila y organiza toda la información necesaria sobre una funcionalidad para producir una
**especificación de prototipo**: un documento que otro agente pueda tomar y usar para empezar a
generar código de inmediato, sin adivinar nada ni volver a preguntar.

El prototipo resultante es una **prueba de concepto funcional** (no un mockup estático): existe
para que los usuarios interactúen rápidamente con la prueba de concepto de la funcionalidad. Por
eso la especificación cubre tanto lo visual (qué se ve y en qué orden) como lo funcional (qué
pasa cuando el usuario interactúa, y con qué datos).

## Principio central: especificación para webs de BCP

Esta skill produce especificaciones para módulos de las **webs de BCP**, que comparten un sistema
de diseño con estructuras, agrupaciones y layout ya definidos — fuente única en la skill
`bcp-design-system`, agnóstica de tecnología (ver "Sistema de diseño BCP y reglas de proceso" más
abajo para dónde cargar cada referencia). Por eso el spec **sí aplica
ese sistema de diseño** — vocabulario de diseño como card, énfasis principal/secundario, jerarquía
de título, centrado — pero **sigue sin mencionar el stack técnico de implementación** (nada de
Angular, React, HTML, nombres de librerías o componentes específicos, etc.) ni en las preguntas que
hace ni en el documento que produce, y tampoco la apariencia interna que cada componente ya trae
resuelta (color de borde, forma, animación — ver M4). Describe la
funcionalidad en términos de **objetivo, vistas, elementos, layout, interacciones y
comportamientos** — el "qué", nunca "con qué tecnología se construye" ni "cómo se ve por dentro cada
componente". La elección de stack técnico y la implementación quedan enteramente del lado del agente
que reciba la especificación.

## Principios

| Principio | En qué consiste |
|---|---|
| **Convenciones BCP por defecto** | Todo lo que ya resuelve el sistema de diseño BCP (`bcp-design-system`) se aplica en silencio y se registra — nunca se pregunta. Solo se pregunta lo que esa convención marca como variable, lo que no está cubierto por ninguna convención, o una desviación explícita del usuario. |
| **No inventar** | Si un dato relevante no se puede inferir con confianza de lo que dijo el usuario ni de una convención BCP, se pregunta. No se completan huecos con supuestos silenciosos. |
| **Supuestos explícitos** | Cuando sí se asume algo razonable para no interrumpir (un detalle menor y no crítico), queda registrado en "Alcance y supuestos" del documento final — nunca de forma implícita. |
| **Autonomía del documento** | Quien lea la especificación no debe necesitar la conversación original: todo lo relevante para construir el prototipo debe estar en el archivo, incluido todo el estilo y layout que aplica, descrito directamente. |
| **Suficiente, no exhaustivo por exhaustividad** | El detalle debe alcanzar para que un agente no tenga ambigüedades al construir, pero no se piden datos irrelevantes para una prueba de concepto (p. ej. no se pregunta por tipografías o paletas salvo que el usuario las mencione). |
| **Idioma de respuesta** | Responde siempre en el mismo idioma en que está escrito el prompt inicial del usuario (preguntas, resúmenes y documento final). |

## Sistema de diseño BCP y reglas de proceso

El sistema de diseño de BCP se repite igual en todos los módulos: layout, agrupación, jerarquía de
título y anatomía de página son las mismas de una vista a otra (ver el catálogo C1-C16/A1-A7 de
`bcp-design-system` para el detalle puntual de cada convención). Por eso esas convenciones **no se
preguntan**: se aplican en silencio y se registran en el documento. La fuente completa de ese sistema de diseño vive
en la skill `bcp-design-system` (ver "Principio central" arriba) — **cárgala antes de preguntar o de
escribir el documento final**, no la resumas de memoria:
`bcp-design-system/references/convenciones-bcp.md` (C1-C16),
`bcp-design-system/references/anatomia-pagina.md` (A1-A7) y
`bcp-design-system/references/catalogo-variantes.md` (V-...).

Las meta-reglas que gobiernan *cómo* se usan esas convenciones (cuándo aplicar en silencio, cuándo
preguntar por un vacío del catálogo, cómo registrar una desviación, cuándo un componente ya trae su
mecánica visual fija) son M1-M4 y viven en el `SKILL.md` de `bcp-design-system` — cárgalo también.
La regla de nombres de columna largos, la regla del layout de inputs de formulario, la de columnas
de significado ambiguo, la de datos con varios formatos posibles y la de paginación por front son
propias de esta skill y viven en `references/reglas-obligatorias.md` — cárgalo también antes de
preguntar o escribir.

| ID | Regla | Fuente |
|---|---|---|
| M1 | Aplicar en silencio toda convención BCP que cubra el elemento; solo preguntar su parte variable. | `bcp-design-system/SKILL.md` |
| M2 | Fallback: si un aspecto no está cubierto por ninguna convención, se pregunta — nunca se inventa. | `bcp-design-system/SKILL.md` |
| M3 | Desviaciones: si el usuario contradice una convención, gana el usuario; se registra como excepción explícita. | `bcp-design-system/SKILL.md` |
| M4 | Componente con mecánica visual fija: se documenta que existe, cuándo se usa y qué estados expone — no su mecánica interna. | `bcp-design-system/SKILL.md` |
| R6 | Nombre de columna >16 caracteres: avisar y proponer 2-4 abreviaciones. | `references/reglas-obligatorias.md` |
| R7 | Layout de inputs de un formulario: se pregunta/confirma siempre de forma explícita, nunca se asume. | `references/reglas-obligatorias.md` |
| R8 | Columna de tabla cuyo significado no queda claro: preguntar qué dato representa y 2-3 valores de ejemplo. | `references/reglas-obligatorias.md` |
| R9 | Dato que admite varios formatos (fecha, hora, porcentaje, código): preguntar el formato una vez por tipo de dato. | `references/reglas-obligatorias.md` |
| R10 | Tabla del prototipo: pagina siempre por front sobre la totalidad de los registros ya cargados; los datos mock se generan completos. | `references/reglas-obligatorias.md` |

## Reglas estrictas

- **Nunca escribas código durante esta skill.** El único artefacto que produce es el archivo
  `.md` de la especificación.
- **Nunca propongas implementar la especificación después de guardarla.** El trabajo termina
  cuando el archivo queda escrito y confirmado; no ofrezcas empezar a construir el prototipo.
- **Nunca asumas decisiones que el usuario no confirmó.** Si falta información, se pregunta.
- **Nunca dejes nada como "pendiente" o "decisión abierta" en el documento.** Todo dato relevante
  se pregunta y se repregunta hasta obtener una respuesta directa, o queda registrado como
  supuesto explícito en "Alcance y supuestos". El documento final no lleva sección de pendientes.
- **Nunca generes el archivo sin una confirmación explícita del usuario sobre el resumen final.**
  Si el usuario agrega o corrige información después de ver un resumen, ese resumen queda
  invalidado: hay que absorber lo nuevo, preguntar lo que quede ambiguo, y volver a resumir y
  confirmar — tantas veces como haga falta — antes de escribir el archivo.

## Prerrequisito: `bcp-design-system` debe estar instalada

Antes de cualquier otra cosa (incluso antes del "Punto de partida"), intenta abrir
`bcp-design-system/SKILL.md` — skill hermana que debe estar instalada junto a esta en el mismo
proyecto, nunca una copia embebida. Si no existe o no se puede leer, **detente de inmediato y
avísalo explícitamente al usuario**: sin esa skill no hay fuente de convenciones C1-C16, A1-A7 ni
V-# que aplicar, y esta skill no debe continuar parafraseando esas convenciones de memoria ni
inventando un equivalente. No sigas con el "Punto de partida" ni con el "Procedimiento" hasta que
la skill esté disponible.

## Punto de partida

Antes de todo lo demás (ya resuelto el prerrequisito anterior): si `$ARGUMENTS` viene vacío y no
hay ninguna descripción de la funcionalidad en la conversación previa, no asumas nada — pide al
usuario una descripción inicial de qué quiere prototipar y espera su respuesta antes de aplicar el
"Procedimiento".

## Tono al hacer preguntas

Sé directo y específico. No te disculpes por preguntar ni uses fórmulas como "si no te importa..."
o "podrías quizá...". El usuario invocó esta skill precisamente para que preguntes.

- **Preguntas concretas, no abiertas.** ❌ "¿Cómo imaginas el botón?" → ✅ "¿El botón debe tener un texto o icono?"
- **Una pregunta por línea, numerada**, cuando haya varias dentro de un mismo bloque.
- **Si una pregunta admite listar sus posibles respuestas, siempre se listan como opciones**,
  entre 2 y 4, mostradas como (a), (b), (c), etc., marcando cuál es tu recomendación y por qué.
  Nunca una lista abierta ni texto libre cuando basta con elegir una letra. Esto es una
  convención de formato para cualquier pregunta de la skill que lo admita — no depende de qué
  regla o bloque la originó.
- **Pregunta en bloques de mínimo 3 y máximo 5 a la vez**, nunca una sola pregunta seguida de otra
  sola pregunta — eso agota al usuario. El 5 es un tope de cuántas se muestran juntas, nunca de
  cuántas se llegan a hacer: si un mismo punto/fase necesita más de 5, se parte en bloques
  consecutivos de hasta 5 y se sigue con las restantes **de ese mismo punto** antes de pasar al
  siguiente (p. ej. 10 preguntas de un punto → salen 5, se espera la respuesta, salen las otras 5).
  Un punto no se da por cerrado hasta que se hicieron todas sus preguntas, aunque haya requerido
  varios bloques. Si al cerrar un punto quedan 1-2 preguntas sueltas, se agrupan con el bloque del
  punto siguiente; solo si ya no queda nada con qué agruparlas se mandan solas. Espera la respuesta
  antes de mandar el siguiente bloque.
- **Repreguntar para profundizar es obligatorio, repetir lo ya contestado no.** Está prohibido
  repetir una pregunta que el usuario ya respondió de forma completa y directa, o preguntar algo que
  ya resolvió una convención BCP (M1). Pero un tema no queda cerrado solo porque se tocó una vez:
  si la respuesta fue parcial o ambigua, o abrió un detalle nuevo que la pregunta original no
  cubría, se vuelve a preguntar sobre ese mismo tema hasta que no queden vacíos. Estas repreguntas
  de profundización van dentro de los bloques normales, con el mismo tope de 5.

## Bloques de información a recolectar

### 1. Objetivo
Qué problema resuelve la funcionalidad y qué debería poder realizar el usuario. Debe
quedar en una o dos frases claras, no en generalidades vagas.

### 2. Inventario de vistas
- Cuántas vistas tiene el prototipo.
- Nombre y propósito breve de cada vista.
- Cómo se navega entre ellas (qué acción en qué vista lleva a cuál otra).

### 3. Por cada vista: qué muestra y su layout
- Qué debe mostrarse en la vista (a alto nivel).
- Inventario de los elementos específicos presentes (formularios, tablas, botones, selectores,
  contadores, tabs, mensajes, etc.).
- **Layout:** en qué orden o posiciones visuales están esos elementos entre sí (arriba/abajo,
  izquierda/derecha, agrupados en secciones, etc.). Buena parte del layout ya está resuelto por las
  convenciones de `bcp-design-system` (C1-C16 para el layout dentro de una vista, A1-A7 para
  la estructura de la página como contenedor — ver "Sistema de diseño BCP y reglas de proceso" para
  dónde cargarlas): aplícalas en
  silencio (M1) y no las preguntes. Pregunta (fallback M2) solo la
  posición que **no** quede resuelta por una convención ni por una convención universal evidente.
  No se requiere precisión de píxeles: se requiere que el orden relativo y el agrupamiento queden
  inequívocos.
  - **Excepción obligatoria (R7 en `references/reglas-obligatorias.md`):** el arreglo interno de
    los inputs de todo formulario (orden, filas/columnas, agrupamiento) no es fallback opcional —
    **siempre** se pregunta/confirma con el usuario, salvo que ya lo haya descrito por completo.

### 4. Detalle de cada elemento
Para cada elemento identificado en el bloque 3, captura sus detalles específicos usando
`references/catalogo-elementos.md` como checklist según el tipo de elemento (botón, tabla,
selector, campo de texto, contador, paginación, tabs, esqueleto, etc.). **Carga ese archivo,
las references de `bcp-design-system` (ver "Sistema de diseño BCP y reglas de proceso" arriba)
y `references/reglas-obligatorias.md` antes de
preguntar por los detalles** — son la fuente de verdad de qué preguntar por cada tipo, de las
convenciones fijas C1-C16/A#/V-# y de las reglas de proceso M1-M4/R6/R7/R8/R9/R10; no las resumas de
memoria. El layout y la agrupación ya cubiertos por una convención **no se preguntan** (M1): solo se
captura el contenido variable (textos, opciones, columnas, validaciones, datos) y cualquier
desviación explícita (M3). Cuando el elemento es un componente con mecánica visual fija (M4, p. ej.
un esqueleto de carga), tampoco se pregunta esa mecánica — solo cuándo aparece y qué expone.
Excepción: el layout interno de los inputs de un formulario nunca cuenta como "ya cubierto" — R7 lo
mantiene como pregunta obligatoria. Una columna de tabla de significado ambiguo (R8) y un dato con
más de un formato posible (R9) tampoco cuentan como cubiertos hasta resolverlos.

### 5. Interacciones entre elementos de la vista
Cómo se relacionan los elementos entre sí dentro de una misma vista: qué acción de cuál elemento
dispara qué efecto en cuáles otros. Ejemplo: un formulario de búsqueda dispara la consulta, cuyos
resultados se pintan en una tabla y actualizan un contador.

### 6. Comportamientos y estados a nivel de vista
- **Estado inicial:** qué se muestra al entrar a la vista antes de cualquier interacción (¿solo el
  formulario vacío, o hay una búsqueda/consulta por defecto ya ejecutada?).
- **Estado de carga:** si una acción toma tiempo, ¿se muestra alguna indicación de carga? ¿dónde y
  cómo?
- **Estado vacío:** qué se muestra cuando una acción no produce resultados.
- **Errores y validaciones:** qué validaciones existen antes de disparar una acción, y qué pasa
  ante un error.

### 7. Datos de ejemplo (mock)
Como la prueba de concepto debe ser funcional para los usuarios, se necesitan datos con los que interactuar:
- Cantidad aproximada de registros de ejemplo (p. ej. para una tabla).
- Valores representativos (casos típicos) y casos borde relevantes (vacío, error, valores
  extremos) si el usuario los menciona o si son evidentemente necesarios para probar la
  funcionalidad.
- Si el usuario no da detalles de los datos, se puede asumir que el agente generará datos mock
  razonables — pero esto debe quedar anotado como supuesto, no asumido en silencio.
- **Tablas con paginación (R10 en `references/reglas-obligatorias.md`):** como la paginación siempre
  se resuelve por front sobre la totalidad de los registros ya recibidos, los datos mock deben
  generarse completos (todo el conjunto a demostrar), no solo los de la primera página.
- **Formato de los valores mock:** los datos generados deben respetar el formato de moneda fijado
  por convención (C12) y el formato de cualquier dato de varios formatos posibles que se haya
  confirmado con el usuario (R9 en `references/reglas-obligatorias.md`).

## Procedimiento

### Fase A — Recolección
1. Verificar el "Prerrequisito: `bcp-design-system` debe estar instalada" y resolver el "Punto de
   partida" antes de seguir.
2. **Absorber primero.** Leer todo lo que el usuario ya describió (mensaje actual o conversación
   previa) y mapearlo a los bloques 1-7.
3. **Aplicar convenciones BCP.** Para cada elemento identificado, mapearlo contra
   `bcp-design-system` (C1-C16, A1-A7, V-# — ver "Sistema de diseño BCP y reglas de proceso" para
   dónde cargarlas): toda convención que lo cubra se marca como resuelta
   (M1) y se aplica en silencio — no se pregunta, se registra directamente para el documento final.
   Si lo que describió el usuario contradice una convención, queda marcado como desviación (M3), no
   como vacío.
4. **Detectar vacíos.** Para cada bloque y cada vista, determinar qué falta o quedó ambiguo **una
   vez descontado lo ya resuelto por convenciones BCP**: solo cuentan como vacío (a) el contenido
   variable que ninguna convención fija (entidad, columnas, filtros, acciones, textos, datos), y
   (b) los aspectos de estilo/layout que ninguna convención cubre (M2).
5. **Preguntar solo lo que falta, respetando el tope de "Tono al hacer preguntas" (bloques de
   mínimo 3 y máximo 5 preguntas concretas a la vez).** No repetir una pregunta que el usuario ya
   respondió por completo ni lo que ya resolvió una convención BCP — pero sí volver a preguntar
   sobre un tema tratado si la respuesta quedó parcial o abrió un detalle nuevo (ver "Tono al hacer
   preguntas"). Nunca mandar una sola pregunta ni una lista gigante de decenas de puntos sueltos:
   agrupar por bloque o por vista, priorizando objetivo → vistas → layout → detalle de elementos →
   interacciones → comportamientos → datos mock. Si un punto/fase necesita más de 5 preguntas, no se
   da por cerrado hasta agotarlas todas, en los bloques consecutivos que hagan falta. Si hay varias
   vistas, completar el detalle de una antes de pasar a la siguiente. Esperar la respuesta del
   usuario después de cada bloque de preguntas.
6. Repetir el paso 5 hasta cubrir todos los bloques de todas las vistas (o hasta que el usuario
   indique que lo restante puede quedar como supuesto).
7. **Resumir y confirmar.** Antes de escribir el archivo, resumir lo entendido y preguntar
   explícitamente si es correcto y suficiente para generar el archivo. Nunca escribir el archivo
   tras el primer resumen sin esa confirmación. Si el usuario responde con información nueva en
   vez de confirmar:
   1. Absorber esa información nueva (volver al paso 2 para ese dato).
   2. Detectar si genera ambigüedad o huecos nuevos y preguntarlos (en los bloques de "Tono al
      hacer preguntas") — no dar por hecho cómo encaja lo nuevo con lo ya definido.
   3. Presentar un resumen actualizado completo (no solo el delta) y volver a pedir confirmación.
   Repetir este ciclo hasta recibir un "sí, genera el archivo" explícito.

### Fase B — Escritura
8. Determinar el nombre del archivo: kebab-case derivado del objetivo/nombre de la funcionalidad.
9. Crear la carpeta `.prototype-specs/` en la raíz del proyecto si no existe.
10. Escribir `.prototype-specs/[nombre-kebab].md` siguiendo exactamente la estructura de
    `references/plantilla-especificacion.md`. Consultar `references/ejemplo-especificacion.md`
    como referencia de formato y nivel de detalle (no de contenido).
11. Confirmar al usuario la ruta del archivo y presentar el resumen final (ver "Al terminar"). No
    proponer ni empezar a implementar el prototipo: el trabajo de esta skill termina aquí.

## Al terminar

Confirma la ruta del archivo generado y resume brevemente en el chat:
- Vistas cubiertas y su propósito.
- Elementos principales por vista.
- Supuestos que quedaron registrados en "Alcance y supuestos".

El detalle completo queda en el archivo de `.prototype-specs/`.

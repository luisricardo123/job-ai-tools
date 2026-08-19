---
name: bcp-design-system
description: >
  Fuente única del lenguaje visual de las webs de BCP: convenciones fijas de layout y estilo
  (C1-C16), anatomía de página (A1-A7) y catálogo de variantes de cada componente con el criterio de
  cuándo usar cada una. Úsala siempre que necesites saber cómo debe verse o comportarse visualmente
  una pantalla de BCP: al crear o diseñar una vista nueva (el caso diario de un frontend de BCP), al
  escribir una especificación, al revisar una pantalla ya implementada, o al elegir qué variante de
  un componente corresponde a un caso concreto. Es vocabulario de diseño agnóstico de librería
  (card, énfasis principal/secundario, jerarquía de título): nunca nombra componente, prop, evento
  ni token real. No la uses para generar código, para decidir el stack técnico, ni en proyectos que
  no sean webs de BCP.
---

# Sistema de diseño BCP

Fuente única del **lenguaje visual compartido** de las webs de BCP: lo que hace que dos módulos
construidos por equipos distintos, con los mismos componentes, se perciban como la misma web. Esta
skill no genera código ni especificaciones — es una skill de **referencia** que otras skills y
agentes cargan para responder "¿cómo debe verse/comportarse esto en BCP?".

Es **agnóstica de librería**: describe layout, anatomía de página, agrupación y criterio de elección
de variante — nunca el nombre real de un componente, prop, evento o token. La apariencia interna de
cada componente (color de borde, forma, animación, peso tipográfico exacto) la resuelve el propio
sistema de diseño instalado en el proyecto; esta skill no la documenta ni siquiera cuando se conoce
(ver M4).

## Cuándo abrir cada reference

| Archivo | Cárgalo cuando... |
|---|---|
| `references/convenciones-bcp.md` (C1-C16) | Necesites las reglas fijas puntuales de layout/estilo ya resueltas: cards, posición de botón de búsqueda, contador, paginación, niveles de título, roles de color, alineación de columnas, formato de montos, orden de acciones. |
| `references/anatomia-pagina.md` (A1-A7) | Necesites la estructura de la página como contenedor: qué regiones existen de arriba abajo y en qué orden, más allá del contenido de una vista puntual. |
| `references/catalogo-variantes.md` (V-...) | Necesites decidir qué variante de un componente corresponde a un caso concreto (qué botón, qué tipo de mensaje, qué variante de card). |

Carga siempre el archivo completo antes de responder o de escribir un documento que dependa de él —
no resumas estas convenciones de memoria; son la fuente única y están pensadas para crecer.

## Meta-reglas de uso del catálogo (M1-M4)

Gobiernan cómo se usa **todo** el contenido de esta skill (C1-C16, A#, V-#). Cualquier skill
consumidora las cita por ID, no las repite.

### M1 · Aplicar las convenciones BCP en silencio
Antes de preguntar por el layout o la agrupación de un elemento, revisa si ya está cubierto por una
convención de esta skill. Si lo está:
- **No se pregunta.** Se aplica directamente y se describe en el documento o código final en el
  layout o el detalle del elemento correspondiente, sin etiquetarlo como convención.
- Solo se pregunta la parte que esa convención marca explícitamente como **variable** (p. ej. el
  nombre de la entidad en C3, las acciones concretas en C4).

### M2 · Fallback: lo no cubierto por el catálogo, se pregunta
Si un aspecto de layout o agrupación de un elemento no está cubierto por ninguna convención de esta
skill, aplica el principio general "no inventar": se pregunta como cualquier otro dato. Nunca se
asume en silencio ni se inventa una convención que no esté escrita.

### M3 · Desviaciones: gana lo que confirme el usuario
Si la descripción del usuario contradice una convención de esta skill, prevalece lo que dijo el
usuario. La desviación se describe en el documento o código final como el comportamiento definitivo
de ese elemento, en su layout o detalle correspondiente — nunca se aplica la convención por encima
de lo que pidió el usuario, y nunca se deja la excepción implícita ni se omite.

### M4 · Componentes con mecánica visual fija: se documenta el qué y el cuándo, no el cómo interno
Cuando un componente ya trae una apariencia y comportamiento interno fijos por el propio sistema de
diseño, esta
skill documenta **que existe**, **cuándo se usa** (posición en la página, condición que lo dispara)
y **qué estados o estructura funcional expone** (p. ej. paso completado/actual/pendiente) — pero no
prescribe su mecánica visual interna como si hubiera que construirla desde cero: esa mecánica ya la
resuelve el propio componente del sistema de diseño. La distinción real que esta skill sí debe fijar
o preguntar es la de **variante** cuando el componente ofrece más de una (p. ej. qué énfasis de
botón, qué variante de card) — ahí sí hay una elección de diseño, no una mecánica interna dada.

**Esta es la regla rectora de todo el catálogo:** ante la duda de si algo va en esta skill, la
pregunta no es "¿es visual?" sino "¿lo resuelve el componente por sí solo, o es una decisión de
layout/agrupación/elección de variante que el componente no puede tomar por ti?". Solo lo segundo se
documenta. La apariencia interna de un componente no se documenta aquí **ni siquiera cuando se
conoce** — conocerla no la convierte en información que esta skill deba fijar.

## Reglas estrictas

- **Nunca inventes una convención, variante o mapeo que no esté escrito en `references/`.** Ante un
  vacío, aplica M2: se pregunta, no se completa de oído.
- **Esta skill es agnóstica de librería.** Nunca nombra paquete, componente, prop, evento ni token
  real — eso lo resuelve, al implementar, la librería instalada en el proyecto destino, que es
  siempre la fuente de verdad de cómo se ve cada componente. Esta skill no la describe ni la
  sustituye.
- **Este catálogo está pensado para crecer.** Cuando aparezca un patrón, variante o región de página
  nueva que se repita igual en más de una pantalla/proyecto, se agrega aquí con su propio ID
  (`C#`, `A#`, `V-<COMPONENTE>#`) en vez de volver a resolverla cada vez desde cero.
- **Qué va aquí y qué no.** Una regla nueva pertenece a este catálogo solo si es una verdad sobre
  cómo se ve o se comporta visualmente una web de BCP, válida para cualquier proyecto. Si en cambio
  regula cómo una skill consumidora conduce su propia entrevista o una decisión de implementación
  propia de esa skill (no una convención visual), no va aquí.

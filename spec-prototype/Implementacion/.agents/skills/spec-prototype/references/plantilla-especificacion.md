# Plantilla de la especificación de prototipo

Esta es la estructura **exacta** que debe seguir el archivo generado en
`.prototype-specs/[nombre-kebab].md`. Respeta los encabezados y su orden. Omite una subsección
solo cuando genuinamente no aplica a la funcionalidad (indícalo explícitamente con "No aplica",
no la borres sin más).

No menciones tecnologías, frameworks ni librerías en ningún punto del documento.

```markdown
# Especificación de prototipo: [Nombre de la funcionalidad]

## Objetivo
[Una o dos frases: qué problema resuelve y qué debe poder hacer un usuario al probarlo.]

## Alcance y supuestos
- [Qué queda explícitamente fuera del prototipo, si aplica.]
- [Cada supuesto asumido por no haber sido definido por el usuario, marcado como tal. Ejemplo:
  "Supuesto: los datos de ejemplo de la tabla serán generados por el agente implementador,
  no se especificaron valores concretos."]

## Pautas visuales generales
- **Colores de fondo:** [Si el usuario mencionó algún color de fondo en algún momento para un
  elemento genérico de interfaz, listar cuál y dónde aplica. Si nunca lo mencionó, no incluir esta
  pauta — la resuelve el propio sistema de diseño (C8).]
- **Jerarquía de título:** [siempre presente, textual: "Existen tres niveles de título: el
  principal de vista, el secundario (secciones/rótulos de card de formulario), y el de sub-sección
  dentro de una card de datos de solo lectura. Cuál nivel corresponde a cada título de la vista
  queda indicado en el detalle de cada elemento — el propio sistema de diseño resuelve su
  apariencia (color, peso)."]
- **Roles de color:** [siempre presente, textual: "El sistema de diseño usa dos colores de marca
  con roles fijos: uno para dar énfasis a texto no interactivo (título principal, contador), otro
  para todo elemento interactivo o accionable (botones, enlaces, pestaña activa, selección). Esta
  especificación no fija los tonos concretos — los resuelve el sistema de diseño."]
- **Separación entre secciones:** [siempre presente, textual: "Las secciones de cada vista
  (título, cards, tabla, paginación, etc.) van separadas entre sí con espacio suficiente; no deben
  verse pegadas ni amontonadas."]
- **Márgenes de vista:** [siempre presente, textual: "Todas las vistas tienen márgenes respecto a
  los bordes de la pantalla, y esos márgenes son los mismos en todas las vistas; el contenido
  nunca queda pegado a los bordes."]
- **Anatomía de página:** [siempre presente, resumida a partir de `anatomia-pagina.md`: si la vista
  tiene navegación de vuelta, el botón "Volver" precede al título en su propia fila; el título
  comparte fila con las acciones de nivel de vista, si existen; el contenido ocupa el 100% del
  ancho disponible. Añadir aquí, si aplica a alguna vista del prototipo, que sigue el patrón de
  flujo multi-paso (indicador de progreso), de confirmación de operación (anatomía centrada), de
  vista con pestañas, o de menú de módulo — según corresponda.]

## Mapa de vistas y navegación
- [Lista de vistas con su nombre y propósito en una línea cada una.]
- [Cómo se navega entre ellas: qué acción, en qué vista, lleva a cuál otra vista.]

## Datos de ejemplo (mock)
- [Cantidad aproximada de registros de ejemplo por cada colección de datos relevante.]
- [Valores representativos / casos típicos.]
- [Casos borde relevantes: vacío, error, valores extremos, si aplica.]

---

## Vista 1: [Nombre de la vista]

### Propósito
[Qué debe mostrar esta vista y para qué sirve, en contexto del objetivo general.]

### Layout (regiones y orden)
[Describe el orden y posición relativa de los elementos: qué va arriba, abajo, a la izquierda, a
la derecha, agrupado en qué secciones. Describe cada posición de forma directa y natural, sin
marcarla como "confirmado con el usuario" ni con ninguna otra etiqueta — toda posición mencionada
aquí, la haya fijado el estilo compartido de la web o el propio usuario, debe haber quedado
resuelta antes de escribirla; no describas una posición que nunca se definió. El arreglo interno
de los inputs de un formulario siempre debe estar confirmado con el usuario, nunca asumido. El
layout descrito asume siempre separación visible entre secciones y márgenes de vista consistentes
con el resto del prototipo; no hace falta repetir esto en cada vista, ya quedó declarado en
"Pautas visuales generales". Usa una lista o un esquema textual simple, por ejemplo:

- Región superior: [elemento A], [elemento B]
- Región central, en dos columnas:
  - Columna izquierda: [elemento C]
  - Columna derecha: [elemento D]
- Región inferior: [elemento E]
]

### Inventario de elementos
[Lista de todos los elementos presentes en la vista, con su tipo general: formulario, tabla,
botón, selector, contador, tabs, modal, mensaje, loader, etc.]

### Detalle de elementos
[Para cada elemento del inventario, sus detalles específicos según
`references/catalogo-elementos.md`. Un subapartado por elemento, por ejemplo:

#### [Nombre del elemento] (tipo: [tipo])
- [detalle 1]
- [detalle 2]
- ...
]

### Interacciones
[Qué acción de qué elemento dispara qué efecto en cuáles otros elementos de la vista. Ejemplo:
"Al enviar el formulario de búsqueda, se ejecuta la consulta; los resultados se pintan en la
tabla de resultados y el contador se actualiza con el total."]

### Comportamientos y estados
- **Estado inicial:** [qué se muestra al entrar a la vista, antes de cualquier interacción.]
- **Estado de carga:** [si aplica, cuándo aparece y qué se muestra.]
- **Estado vacío:** [qué se muestra cuando una acción no produce resultados.]
- **Errores y validaciones:** [validaciones antes de disparar una acción, y qué pasa ante un
  error.]

---

## Vista 2: [Nombre de la vista]

[Repetir la misma estructura de la Vista 1 por cada vista adicional.]

---

## Flujo global entre vistas
[Descripción de punta a punta de cómo un usuario recorrería el prototipo completo, atravesando
todas las vistas relevantes, para validar el flujo principal de la funcionalidad.]
```

No incluyas una sección de "Pendientes" o "decisiones abiertas": el documento no debe dejar nada
sin resolver. Todo dato relevante fue preguntado y respondido directamente por el usuario, o quedó
registrado como supuesto explícito en "Alcance y supuestos" (ver `SKILL.md`, principio "No
inventar").

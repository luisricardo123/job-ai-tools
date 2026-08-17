# Ejemplo ilustrativo de especificación de prototipo

Este ejemplo muestra el **nivel de detalle y el formato** esperado en un documento generado por
esta skill. Es solo una referencia de estilo — no copies su contenido, cada especificación real
depende de la funcionalidad concreta que se esté prototipando.

---

```markdown
# Especificación de prototipo: Catálogo de productos

## Objetivo
Permitir que un usuario filtre productos de un catálogo por categoría y revise el detalle de cada
producto encontrado, para validar rápidamente el flujo de exploración antes de construir la
versión final.

## Alcance y supuestos
- No se incluyen acciones de edición o creación de productos; solo consulta.
- Supuesto: los datos de ejemplo se generarán con al menos 10 productos de prueba repartidos en
  distintas categorías y niveles de stock, ya que el usuario no especificó valores concretos.
- Supuesto: no se definió un límite máximo de resultados; se asume que la paginación es suficiente
  para manejar cualquier cantidad.

## Pautas visuales generales
- **Colores de fondo:** no debe haber colores de fondo en ningún elemento de la interfaz, bajo
  ningún motivo (el usuario no mencionó ningún color de fondo durante la conversación).
- **Colores de texto:** el usuario mencionó los colores del estado de stock en la tabla (verde
  para "Disponible", ámbar para "Stock bajo", gris para "Agotado"; ver detalle de la tabla de
  productos). El resto de los textos no mencionados deben usar el color de texto estándar
  (oscuro).
- **Separación entre secciones:** las secciones de cada vista (título, cards, tabla, paginación,
  etc.) van separadas entre sí con espacio suficiente; no deben verse pegadas ni amontonadas.
- **Márgenes de vista:** todas las vistas tienen márgenes respecto a los bordes de la pantalla, y
  esos márgenes son los mismos en todas las vistas; el contenido nunca queda pegado a los bordes.

## Mapa de vistas y navegación
- **Vista 1 — Catálogo de productos:** vista de entrada, contiene el filtro por categoría y la
  tabla de resultados.
- **Vista 2 — Detalle de producto:** se accede haciendo clic en una fila de la tabla de resultados
  de la Vista 1. Tiene un botón para volver a la Vista 1.

## Datos de ejemplo (mock)
- 10 productos de ejemplo para cubrir la tabla de resultados con datos variados.
- Al menos un producto en cada estado posible: disponible, stock bajo, agotado.
- Un caso de filtro sin resultados (categoría sin productos asociados).

---

## Vista 1: Catálogo de productos

### Propósito
Permitir elegir una categoría y ver los productos asociados en una tabla.

### Layout (regiones y orden)
- Región superior: título principal "Catálogo de productos", en color primario y negrita.
- Región superior, debajo del título: formulario de búsqueda en card, con el filtro por categoría
  (selector desplegable) y el botón "Filtrar" debajo de él, alineado a la derecha.
- Región central: contador de resultados a la izquierda, sobre la tabla.
- Región central, misma fila que el contador: sin acciones adicionales a nivel de tabla — esta
  vista no tiene acciones de exportar u otras acciones globales sobre la tabla.
- Región central, debajo del contador: tabla de resultados.
- Región inferior: paginación, debajo de la tabla, centrada.

### Inventario de elementos
- Título principal ("Catálogo de productos").
- Formulario de búsqueda (selector de categoría "Categoría" + botón "Filtrar").
- Contador de resultados.
- Tabla de productos.
- Paginación.
- Elemento de carga.
- Estado vacío.

### Detalle de elementos

#### Título "Catálogo de productos" (tipo: título principal)
- Negrita y color primario.

#### Formulario de búsqueda (tipo: formulario / buscador)
- Contenido en card.
- Disposición: un único campo (selector "Categoría"), confirmada con el usuario; el botón
  "Filtrar" va debajo, alineado a la derecha.

#### Selector "Categoría" (tipo: selector desplegable)
- Opciones: "Todas", "Electrónica", "Hogar", "Ropa", "Juguetes".
- Valor por defecto: "Todas".
- Selección múltiple: no.

#### Botón "Filtrar" (tipo: botón)
- Texto: "Filtrar".
- Sin ícono.
- Énfasis: principal.
- Ancho ajustado al contenido.
- Estado inicial: habilitado.
- Posición: debajo del selector, alineado a la derecha.
- Acción: dispara el filtrado de productos (ver Interacciones).

#### Contador de resultados (tipo: contador)
- Formato: "1-10 de **50 Productos**", alineado a la izquierda, color primario.
- Aparece solo después del primer filtrado; se actualiza en cada nuevo filtrado y en cada cambio de
  página (p. ej. con 50 productos filtrados y 10 por página: página 1 → "1-10 de **50
  Productos**", página 2 → "11-20 de **50 Productos**", última página → "41-50 de **50
  Productos**").

#### Tabla de productos (tipo: tabla)
- Cabeceras, en orden: "Nombre", "Categoría", "Precio", "Stock".
- Alineación: "Nombre" y "Categoría" a la izquierda, "Precio" a la derecha y en negrita. "Stock" va
  centrado en vez de a la derecha, confirmado con el usuario, porque muestra una etiqueta de
  estado, no un número.
- Formato de "Precio": `S/ [monto]` con coma de millares, punto decimal y dos decimales fijos — p.
  ej. "S/ 89.90", "S/ 1,250.00".
- Reordenamiento de filas: sí, por "Precio" (por defecto ascendente) y por "Nombre".
- Reordenamiento de columnas: no.
- Paginación: sí, por front sobre la totalidad de los 50 productos ya recibidos; ver elemento de
  paginación.
- Contador de resultados: sí (ver elemento de contador, arriba de la tabla).
- Estilo condicional: la columna "Stock" muestra una etiqueta con color — verde para
  "Disponible", ámbar para "Stock bajo", gris para "Agotado".
- Acción por fila: clic en cualquier parte de la fila navega al detalle del producto (Vista 2).
- Estado vacío específico: ver "Estado vacío" a nivel de vista.

#### Paginación (tipo: paginación)
- Opciones de filas por página: 10, 25, 50. Valor por defecto: 10.
- Posición: debajo de la tabla, centrada.
- Gestión por front sobre los 50 productos ya filtrados: no hay una nueva consulta al cambiar de
  página.

### Interacciones
Al presionar "Filtrar" (o al cambiar la categoría, si el usuario lo confirma así) con una
categoría seleccionada, se ejecuta el filtrado de productos; mientras se resuelve se muestra el
elemento de carga sobre la región de la tabla; al finalizar, si hay resultados, se listan en la
tabla y el contador se actualiza con el total; si no hay resultados, se muestra el estado vacío en
lugar de la tabla.

### Comportamientos y estados
- **Estado inicial:** se muestra la tabla ya cargada con todos los productos (categoría "Todas"),
  sin necesidad de una acción previa del usuario.
- **Estado de carga:** al filtrar, se reemplaza el área de la tabla por un indicador de carga
  hasta que los resultados están listos.
- **Estado vacío:** si el filtro no arroja productos, se muestra el mensaje "No se encontraron
  productos en esta categoría" en lugar de la tabla, sin acción sugerida adicional.
- **Errores y validaciones:** no aplica; el selector siempre tiene un valor válido seleccionado.

---

## Vista 2: Detalle de producto

### Propósito
Mostrar la información completa de un producto seleccionado desde la tabla de la Vista 1.

### Layout (regiones y orden)
- Región superior: botón "Volver" a la izquierda (confirmado con el usuario).
- Región central: datos del producto en dos columnas (columna izquierda: nombre, categoría;
  columna derecha: precio, stock).

### Inventario de elementos
- Botón "Volver".
- Bloque de datos del producto (solo lectura).

### Detalle de elementos

#### Botón "Volver" (tipo: botón)
- Texto: "Volver".
- Ícono a la izquierda (flecha hacia atrás).
- Énfasis: secundario.
- Acción: navega de regreso a la Vista 1, conservando el último filtro aplicado.

#### Bloque de datos del producto (tipo: bloque de datos agrupados)
- Contenido en card.
- Datos: nombre, categoría, precio y stock del producto seleccionado.

### Interacciones
No hay interacciones adicionales dentro de esta vista: es de solo lectura salvo por el botón
"Volver".

### Comportamientos y estados
- **Estado inicial:** se muestran de inmediato los datos del producto seleccionado, sin carga
  simulada porque los datos ya se obtuvieron en la Vista 1.
- **Estado de carga:** no aplica.
- **Estado vacío:** no aplica.
- **Errores y validaciones:** no aplica.

---

## Flujo global entre vistas
Un usuario entra a la Vista 1 y ve de inmediato la tabla con todos los productos, elige una
categoría, presiona "Filtrar", ve el indicador de carga y luego la tabla con los productos
encontrados (o el estado vacío si no hay resultados). Al hacer clic en una fila, pasa a la Vista 2
y ve el detalle completo de ese producto. Al presionar "Volver", regresa a la Vista 1 con el
filtro anterior todavía aplicado.
```

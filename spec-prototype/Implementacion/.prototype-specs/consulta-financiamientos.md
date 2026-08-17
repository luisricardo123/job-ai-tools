# Especificación de prototipo: Consulta de financiamientos

## Objetivo
Permitir a los usuarios consultar sus financiamientos (pendientes de pago o cancelados) aplicando filtros de tipo, rango de fechas y moneda, visualizar los resultados en una tabla, y acceder al detalle de cada financiamiento con su tabla de cuotas.

## Alcance y supuestos
- Los botones "Descargar Excel" (en la vista de consulta) y "Descargar" (en la vista de detalle) son visuales y no ejecutan acciones funcionales en este prototipo — quedan preparados para implementación futura.
- Los datos de ejemplo (financiamientos y cuotas) serán generados por el agente implementador en cantidad suficiente para demostrar la paginación y los diferentes estados posibles, respetando los formatos especificados en este documento.

## Pautas visuales generales
- **Colores de fondo:** No debe haber colores de fondo en ningún elemento de la interfaz, bajo ningún motivo.
- **Colores de texto:** Todos los textos deben usar el color de texto estándar (oscuro); no se permiten colores de texto personalizados.
- **Separación entre secciones:** Las secciones de cada vista (título, cards, tabla, paginación, etc.) van separadas entre sí con espacio suficiente; no deben verse pegadas ni amontonadas.
- **Márgenes de vista:** Todas las vistas tienen márgenes respecto a los bordes de la pantalla, y esos márgenes son los mismos en todas las vistas; el contenido nunca queda pegado a los bordes.

## Mapa de vistas y navegación
- **Vista 1: Consulta de financiamientos** — Permite buscar y visualizar la lista de financiamientos según filtros aplicados.
- **Vista 2: Detalle del financiamiento** — Muestra la información detallada de un financiamiento específico y su tabla de cuotas.

**Navegación:**
- Desde Vista 1: Click en cualquier fila de la tabla de resultados → Vista 2 (detalle del financiamiento seleccionado)
- Desde Vista 2: Click en botón "Volver" → Vista 1 (consulta)

## Datos de ejemplo (mock)
- **Financiamientos:** Entre 100 y 200 registros de financiamientos, con estados distribuidos entre vigente, moroso, amortizado, vencido y cancelado. Los montos deben incluir una mezcla de Soles (S/) y Dólares ($).
- **Cuotas por financiamiento:** Entre 24 y 36 cuotas por cada financiamiento, con estados distribuidos según corresponda al estado del financiamiento.
- **Formato de fechas:** Todas las fechas del prototipo (columnas de tablas, filtros, datos de detalle) deben usar el formato `dd/mm/aaaa` (ejemplo: `27/07/2026`).
- **Formato de montos:** Todos los montos (importes de dinero) deben usar el formato `[símbolo] [número]`, donde el número usa coma como separador de millares, punto como separador decimal y siempre dos decimales. Ejemplos: `S/ 123,456.12`, `$ 1,200.50`, `S/ 0.00`.
- **Formato de tasas:** Porcentaje con dos decimales. Ejemplo: `15.50%`, `8.75%`.
- **Rango de fechas precargado:** El rango de fechas inicial del filtro debe estar precargado con 30 días antes y 30 días después de la fecha actual del sistema (en este caso, 27/06/2026 a 27/08/2026, tomando 27/07/2026 como fecha de referencia).

---

## Vista 1: Consulta de financiamientos

### Propósito
Permitir al usuario buscar sus financiamientos aplicando filtros (tipo, rango de fechas, moneda) y visualizar los resultados en una tabla paginada, desde donde puede acceder al detalle de cada uno.

### Layout (regiones y orden)
- Región superior:
  - Título principal "Financiamientos"
  - Texto descriptivo: "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas."
- Región central:
  - Card de búsqueda (contiene todo el formulario de filtros)
- Región de resultados:
  - Fila horizontal: Contador de resultados a la izquierda, botón "Descargar Excel" a la derecha
  - Tabla de resultados
  - Paginación centrada debajo de la tabla

### Inventario de elementos
- Título principal de vista
- Texto descriptivo
- Card de búsqueda (formulario)
- Radio buttons (tipo de financiamiento)
- Texto descriptivo dinámico
- Rango de fechas
- Dropdown de moneda
- Botón "Buscar"
- Contador de resultados
- Botón "Descargar Excel"
- Tabla de resultados
- Paginación
- Skeleton (estado de carga)

### Detalle de elementos

#### Título principal (tipo: heading)
- Texto: "Financiamientos"
- Estilo: color primario, negrita

#### Texto descriptivo superior (tipo: párrafo)
- Texto: "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas."
- Estilo: color de texto estándar (oscuro)

#### Card de búsqueda (tipo: formulario contenido en card)
- El formulario completo va contenido dentro de una card.
- Título interno de la card: "Búsqueda de financiamientos" (peso demi, color negro)
- Elementos internos (en orden de arriba hacia abajo):
  1. Radio buttons
  2. Texto descriptivo dinámico
  3. Fila horizontal con: rango de fechas (izquierda) + dropdown de moneda (derecha)
  4. Botón "Buscar" abajo a la derecha

#### Radio buttons (tipo: radio button)
- Opciones: "Pendiente de pago" | "Cancelados"
- Estado inicial: "Pendiente de pago" seleccionado
- Los dos radio buttons son mutuamente excluyentes
- Al cambiar de opción: se actualiza el texto descriptivo dinámico, pero no se ejecuta automáticamente la búsqueda

#### Texto descriptivo dinámico (tipo: texto)
- Cambia según el radio button seleccionado:
  - Si "Pendiente de pago" está seleccionado: "Selecciona el rango de fechas de vencimiento de las cuotas pendientes"
  - Si "Cancelados" está seleccionado: "Selecciona el rango de fechas de vencimiento del financiamiento"
- Estilo: color de texto estándar (oscuro)

#### Rango de fechas (tipo: selector de rango de fechas)
- Es un solo componente (no dos campos independientes): su valor es el rango completo, no dos valores separados.
- Formato de fechas mostrado: `dd/mm/aaaa`
- Es obligatorio: debe estar completo (ambas fechas) o completamente vacío para permitir el envío del formulario
- Valor inicial: precargado con un rango de 30 días antes y 30 días después de la fecha actual (ejemplo: del 27/06/2026 al 27/08/2026, si hoy es 27/07/2026)
- Validación: la fecha inicio no puede ser mayor que la fecha final

#### Dropdown de moneda (tipo: selector)
- Opciones disponibles (en orden): "Todas" | "Soles" | "Dólares"
- Opción seleccionada por defecto: "Todas"
- Selección única (no múltiple)
- No tiene buscador interno

#### Botón "Buscar" (tipo: botón)
- Texto: "Buscar"
- Posición: abajo a la derecha de todos los campos del formulario (dentro de la card)
- Énfasis: principal
- Estado inicial: habilitado
- Acción: ejecuta la búsqueda aplicando los filtros seleccionados (ver sección "Interacciones")

#### Contador de resultados (tipo: contador)
- Posición: arriba de la tabla, alineado a la izquierda, misma fila que el botón "Descargar Excel"
- Color: primario
- Formato: `[índice inicial]-[índice final] de **[total de registros] Financiamiento(s)**`, donde la porción `de [total de registros] Financiamiento(s)` va en negrita
- Comportamiento numérico por página:
  - Índice inicial = (número de página actual − 1) × tamaño de página + 1
  - Índice final = mínimo(número de página actual × tamaño de página, total de registros)
  - Total de registros no cambia al paginar
  - Ejemplo con 150 registros y 100 por página: página 1 → `1-100 de **150 Financiamiento(s)**`; página 2 → `101-150 de **150 Financiamiento(s)**`
- Momento de actualización: se actualiza cada vez que se ejecuta una búsqueda o se cambia de página

#### Botón "Descargar Excel" (tipo: botón)
- Texto: "Descargar Excel"
- Posición: arriba de la tabla, extremo opuesto al contador (derecha), misma fila
- Énfasis: secundario
- Acción: visual, no funcional en este prototipo (supuesto registrado en "Alcance y supuestos")

#### Tabla de resultados (tipo: tabla)
- Columnas (en orden):
  1. **Producto** — texto, alineado a la izquierda
  2. **Número de financiamiento** — texto, alineado a la izquierda
  3. **Estado** — texto, alineado a la izquierda; valores posibles: vigente, moroso, amortizado, vencido, cancelado
  4. **Fecha de emisión** — fecha formato `dd/mm/aaaa`, alineado a la izquierda
  5. **Cuota pendiente** — fecha formato `dd/mm/aaaa` (representa la fecha de vencimiento de la próxima cuota pendiente), alineado a la izquierda
  6. **Venc. final** — fecha formato `dd/mm/aaaa` (representa el vencimiento final del financiamiento), alineado a la izquierda
  7. **Tasa** — porcentaje con dos decimales (ejemplo: `15.50%`), alineado a la derecha
  8. **Monto financ.** — monto (importe de dinero) con formato `S/ [número]` o `$ [número]` según corresponda; número con coma de millares, punto decimal, siempre dos decimales (ejemplo: `S/ 123,456.12`); alineado a la derecha y en negrita
  9. **Saldo financ.** — monto con mismo formato que "Monto financ."; alineado a la derecha y en negrita
- Reordenamiento de filas: no aplica
- Reordenamiento de columnas: no aplica
- Paginación: sí (ver elemento "Paginación")
- Contador de resultados: sí (ver elemento "Contador de resultados")
- Acciones a nivel de tabla: sí, botón "Descargar Excel" (ver elemento correspondiente)
- Acciones por fila: no hay botones ni íconos dentro de las filas
- Selección de filas: no aplica
- Interacción por fila: click en cualquier parte de la fila navega a la Vista 2 (Detalle del financiamiento)

#### Paginación (tipo: paginación)
- Posición: centrada, debajo de la tabla
- Opciones de tamaño de página: 25, 50, 100
- Tamaño de página por defecto: 100
- Mecanismo: la tabla recibe de una sola vez la totalidad de los registros del resultado; la paginación se resuelve sobre ese conjunto completo ya cargado, sin volver a consultar al cambiar de página

#### Skeleton (tipo: loader)
- Qué lo dispara: al presionar el botón "Buscar" (inicio de ejecución de búsqueda)
- Dónde se muestra: reemplaza la tabla de resultados, el contador de resultados y el botón "Descargar Excel" — estos tres elementos no deben mostrarse mientras el skeleton está activo
- El skeleton es visual (simula la estructura de la tabla con elementos de carga)

### Interacciones
- Al presionar el botón "Buscar": se ejecuta la búsqueda con los filtros seleccionados (tipo de financiamiento según radio button, rango de fechas, moneda); aparece el skeleton reemplazando la tabla, el contador y el botón de descarga; tras obtener los resultados, el skeleton desaparece y se pintan los resultados en la tabla, se actualiza el contador con el total de registros encontrados, y aparece el botón "Descargar Excel".
- Al cambiar el radio button entre "Pendiente de pago" y "Cancelados": se actualiza el filtro interno y cambia el texto descriptivo dinámico, pero no se ejecuta automáticamente una nueva búsqueda — el usuario debe presionar "Buscar" de nuevo.
- Al hacer click en cualquier fila de la tabla: se navega a la Vista 2 (Detalle del financiamiento), mostrando el detalle del financiamiento correspondiente a esa fila.
- Al cambiar de página en la paginación: se actualiza la vista de la tabla mostrando las filas de la nueva página, y se recalcula el contador manteniendo el total constante.

### Comportamientos y estados
- **Estado inicial:** Al entrar a la vista, se muestra el formulario con los filtros por defecto (radio "Pendiente de pago" seleccionado, rango de fechas precargado con 30 días antes y 30 días después de hoy, moneda "Todas" seleccionada) y una búsqueda **ya ejecutada** con esos filtros — la tabla, el contador y el botón de descarga se muestran con los resultados del filtro por defecto, sin necesidad de que el usuario presione "Buscar" primero.
- **Estado de carga:** Al ejecutar una búsqueda (presionar "Buscar"), aparece un skeleton que reemplaza la tabla, el contador y el botón "Descargar Excel" mientras se obtienen los resultados. Una vez completada la búsqueda, el skeleton desaparece y se muestran los tres elementos con los nuevos resultados.
- **Estado vacío:** Si una búsqueda no devuelve resultados, se muestra el mensaje "No se encontraron resultados" en lugar de la tabla (el contador y el botón de descarga no se muestran en este estado).
- **Errores y validaciones:** Antes de permitir ejecutar la búsqueda, se valida que el rango de fechas esté completo (ambas fechas) o completamente vacío — no se permite enviar con solo una fecha. Si el usuario intenta ejecutar la búsqueda sin cumplir esta condición, se muestra un mensaje de error indicando que debe completar ambas fechas o dejar el rango vacío.

---

## Vista 2: Detalle del financiamiento

### Propósito
Mostrar la información detallada de un financiamiento específico (datos generales) y su tabla de cuotas, permitiendo al usuario revisar el estado de cada cuota y volver a la consulta.

### Layout (regiones y orden)
- Región superior:
  - Botón "Volver"
- Región del encabezado (debajo del botón "Volver"):
  - Fila horizontal: Título "Detalle del financiamiento" a la izquierda, botón "Descargar" a la derecha
- Región de datos:
  - Bloque de datos del financiamiento (en una columna vertical)
- Región de tabla:
  - Contador de cuotas
  - Tabla de cuotas
  - Paginación centrada debajo de la tabla

### Inventario de elementos
- Botón "Volver"
- Título de la vista
- Botón "Descargar"
- Bloque de datos del financiamiento
- Contador de cuotas
- Tabla de cuotas
- Paginación

### Detalle de elementos

#### Botón "Volver" (tipo: botón)
- Texto: "Volver"
- Estilo: color primario, tipo texto (sin borde ni color de fondo, solo texto + ícono de flecha hacia la izquierda)
- Posición: arriba de todo, antes del título
- Acción: regresa a la Vista 1 (Consulta de financiamientos)

#### Título de la vista (tipo: heading)
- Texto: "Detalle del financiamiento"
- Estilo: color primario, negrita
- Posición: debajo del botón "Volver", alineado a la izquierda, misma línea horizontal que el botón "Descargar"

#### Botón "Descargar" (tipo: botón)
- Texto: "Descargar"
- Posición: debajo del botón "Volver", en el extremo opuesto al título (derecha), misma línea horizontal que el título
- Énfasis: secundario
- Acción: hace un print de la página completa (visual, no funcional en este prototipo — ver "Alcance y supuestos")

#### Bloque de datos del financiamiento (tipo: bloque de datos agrupados)
- Contenido en card: sí
- Datos mostrados (en orden, uno debajo del otro, en una sola columna vertical):
  1. **Número del financiamiento:** [valor]
  2. **Producto:** [valor]
  3. **Tasa de interés:** [valor en formato porcentaje con dos decimales, ejemplo: `15.50%`]
  4. **Monto total:** [valor en formato de monto, ejemplo: `S/ 123,456.12` o `$ 1,200.50`]
  5. **Saldo:** [valor en formato de monto]
- Formato: pares etiqueta-valor, solo lectura

#### Contador de cuotas (tipo: contador)
- Posición: arriba de la tabla de cuotas, alineado a la izquierda
- Color: primario
- Formato: `[índice inicial]-[índice final] de **[total de registros] Cuota(s)**`, donde la porción `de [total de registros] Cuota(s)` va en negrita
- Comportamiento numérico: idéntico al contador de la Vista 1, aplicado a las cuotas

#### Tabla de cuotas (tipo: tabla)
- Columnas (en orden):
  1. **Estado** — texto, alineado a la izquierda; valores posibles: vigente, moroso, amortizado, vencido, cancelado
  2. **Nro. de cuota** — número, alineado a la derecha
  3. **Vencimiento** — fecha formato `dd/mm/aaaa`, alineado a la izquierda
  4. **Capital** — monto con formato `S/ [número]` o `$ [número]`; alineado a la derecha y en negrita
  5. **Interés** — monto con mismo formato; alineado a la derecha y en negrita
  6. **Comisión** — monto con mismo formato; alineado a la derecha y en negrita
  7. **Total cuota** — monto con mismo formato; alineado a la derecha y en negrita
- Reordenamiento de filas: no aplica
- Reordenamiento de columnas: no aplica
- Paginación: sí (ver elemento "Paginación de cuotas")
- Contador de resultados: sí (ver elemento "Contador de cuotas")
- Acciones: no aplica
- Selección de filas: no aplica

#### Paginación de cuotas (tipo: paginación)
- Posición: centrada, debajo de la tabla de cuotas
- Opciones de tamaño de página: 25, 50, 100
- Tamaño de página por defecto: 100
- Mecanismo: idéntico a la tabla de la Vista 1 — recibe la totalidad de las cuotas de una sola vez y pagina por front

### Interacciones
- Al presionar el botón "Volver": se navega de regreso a la Vista 1 (Consulta de financiamientos), manteniendo los filtros y resultados tal como estaban antes de entrar al detalle.
- Al presionar el botón "Descargar": se ejecuta un print de la página (no funcional en este prototipo).
- Al cambiar de página en la paginación de cuotas: se actualiza la vista de la tabla mostrando las cuotas de la nueva página, y se recalcula el contador.

### Comportamientos y estados
- **Estado inicial:** Al entrar a la vista desde la Vista 1, se muestran inmediatamente los datos del financiamiento seleccionado y su tabla de cuotas completa (sin estado de carga adicional, asumiendo que los datos ya están disponibles).
- **Estado de carga:** No aplica — los datos se muestran de inmediato.
- **Estado vacío:** No aplica — todo financiamiento tiene al menos una cuota.
- **Errores y validaciones:** No aplica — la vista es solo de lectura.

---

## Flujo global entre vistas
1. El usuario ingresa a la **Vista 1: Consulta de financiamientos** y ve una búsqueda ya ejecutada con los filtros por defecto (Pendiente de pago, rango de fechas de 30 días antes y 30 días después de hoy, moneda Todas), mostrando los resultados en la tabla.
2. El usuario puede ajustar los filtros (cambiar el radio button a "Cancelados", modificar el rango de fechas, seleccionar una moneda específica) y presionar "Buscar" para actualizar los resultados.
3. Durante la búsqueda, un skeleton reemplaza la tabla, el contador y el botón de descarga; una vez completada, reaparecen con los nuevos resultados.
4. Si la búsqueda no devuelve resultados, se muestra el mensaje "No se encontraron resultados".
5. El usuario hace click en cualquier fila de la tabla de resultados para navegar a la **Vista 2: Detalle del financiamiento**.
6. En la Vista 2, el usuario ve los datos del financiamiento seleccionado y su tabla de cuotas, pudiendo paginar por las cuotas si hay más de 100.
7. El usuario presiona el botón "Volver" para regresar a la Vista 1, donde los filtros y resultados se mantienen tal como estaban antes de entrar al detalle.
8. El flujo puede repetirse cuantas veces el usuario necesite: ajustar filtros, consultar, ver detalles, volver, repetir.

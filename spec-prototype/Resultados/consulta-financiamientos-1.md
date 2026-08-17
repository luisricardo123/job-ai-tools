# Especificación de prototipo: Consulta de financiamientos

## Objetivo
Permitir al usuario consultar sus financiamientos filtrando por estado de pago (pendiente o cancelado) y rango de fechas de vencimiento de cuotas, para revisar la información de cada financiamiento en una tabla paginada.

## Alcance y supuestos
- No se contemplan flujos de estados vacíos ni casos de error (unhappy paths) en este prototipo, solo el flujo principal exitoso.
- No se incluye funcionalidad de pago de financiamientos; el prototipo es solo de consulta.
- Supuesto: los datos mock generados incluirán una distribución razonable de financiamientos con diferentes estados, monedas (Soles y Dólares) y productos variados, para que los filtros funcionen de forma representativa.

## Restricciones visuales
- **Colores de fondo:** no debe haber colores de fondo en ningún elemento de la interfaz, bajo ningún motivo.
- **Colores de texto:** todos los textos deben usar el color de texto estándar (oscuro), excepto el título principal "Financiamientos" y el contador de resultados de la tabla que deben usar color primario.
- **Cards / tarjetas:** no se deben usar cards para contener los elementos, con la única excepción del formulario de filtros de búsqueda que sí debe estar contenido dentro de una card.

## Mapa de vistas y navegación
- **Vista única — Consulta de financiamientos:** contiene el título, subtítulo, formulario de filtros de búsqueda dentro de una card, contador de resultados, botón de descarga de Excel, tabla de financiamientos y paginación.
- No hay navegación entre vistas; toda la funcionalidad está en una sola vista.

## Datos de ejemplo (mock)
- 110 registros de financiamientos en total.
- Mezclados entre financiamientos en Soles (S/) y Dólares ($).
- Estados incluidos: Vencido, Moroso, Amortizado, Vigente, Cancelado.
- Productos de ejemplo: "Préstamo Personal", "Crédito Vehicular", y otros nombres similares de productos financieros.
- Distribución de estados según el filtro:
  - Cuando el radio button "Pendiente de pago" está seleccionado: los resultados deben incluir financiamientos con todos los estados excepto "Cancelado".
  - Cuando el radio button "Cancelados" está seleccionado: los resultados deben incluir solo financiamientos con estado "Cancelado".
- Números de financiamiento con formato tipo: D015001224122.
- Fechas variadas que cubran rangos dentro y fuera del filtro por defecto (±30 días desde hoy).

---

## Vista única: Consulta de financiamientos

### Propósito
Permitir al usuario filtrar y consultar sus financiamientos según estado de pago y rango de fechas de vencimiento de cuotas, y revisar los detalles de cada financiamiento en una tabla con paginación.

### Layout (regiones y orden)
- Región superior: 
  - Título principal "Financiamientos"
  - Subtítulo "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas"
- Región de filtros (contenida en una card):
  - Título "Búsqueda de financiamientos"
  - Radio buttons: "Pendiente de pago" y "Cancelados"
  - Texto instructivo "Selecciona el rango de fechas de vencimiento de las cuotas pendientes"
  - Fila horizontal con rango de fechas (dos selectores de fecha) y dropdown de moneda
  - Botón "Buscar"
- Región de resultados:
  - Fila horizontal con contador de resultados a la izquierda y botón "Descargar Excel" a la derecha
  - Tabla de financiamientos
  - Paginación debajo de la tabla

### Inventario de elementos
- Título principal ("Financiamientos")
- Subtítulo
- Card de filtros de búsqueda conteniendo:
  - Título de sección ("Búsqueda de financiamientos")
  - Radio buttons (2 opciones)
  - Texto instructivo
  - Rango de fechas (2 selectores de fecha)
  - Dropdown de moneda
  - Botón "Buscar"
- Contador de resultados
- Botón "Descargar Excel"
- Tabla de financiamientos
- Paginación
- Elemento de carga (skeleton de tabla)

### Detalle de elementos

#### Título "Financiamientos" (tipo: título principal)
- Negrita: sí.
- Color: color primario.

#### Subtítulo (tipo: texto)
- Texto: "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas".
- Posición: inmediatamente debajo del título principal.
- Estilo: peso de fuente normal, color de texto estándar.

#### Card de filtros de búsqueda (tipo: formulario dentro de card)
- Contenedor: sí, todo el formulario de filtros debe estar contenido dentro de una card.
- Contenido: ver elementos siguientes.

#### Título "Búsqueda de financiamientos" (tipo: título de sección)
- Negrita: no (fuente normal).
- Color: color de texto estándar.
- Posición: primera línea dentro de la card de filtros.

#### Radio buttons de estado (tipo: radio button)
- Opciones: "Pendiente de pago" y "Cancelados".
- Estado inicial: "Pendiente de pago" seleccionado por defecto.
- Mutuamente excluyentes (solo se puede seleccionar uno a la vez).

#### Texto instructivo (tipo: texto)
- Texto: "Selecciona el rango de fechas de vencimiento de las cuotas pendientes".
- Posición: debajo de los radio buttons.

#### Rango de fechas (tipo: selector de fecha doble)
- Dos selectores: fecha desde y fecha hasta.
- Formato de fecha: DD/MM/AAAA.
- Valores por defecto: 
  - Fecha desde: hoy menos 30 días.
  - Fecha hasta: hoy más 30 días.
- Validación: el rango debe ser válido (fecha desde debe ser anterior o igual a fecha hasta).
- Mensaje de error si el rango es inválido: "el rango de fechas es inválido".
- Posición: en la misma fila horizontal que el dropdown de moneda.

#### Dropdown de moneda (tipo: selector / dropdown)
- Opciones en orden: "Todas", "Soles", "Dólares".
- Opción seleccionada por defecto: "Todas".
- Selección única.
- Sin buscador interno.
- Posición: en la misma fila horizontal que el rango de fechas.

#### Botón "Buscar" (tipo: botón)
- Texto: "Buscar".
- Sin ícono.
- Énfasis: principal.
- Ancho ajustado al texto.
- Estado inicial: deshabilitado hasta que todos los campos del formulario sean válidos (rango de fechas completo y válido).
- Acción: ejecuta la búsqueda de financiamientos con los filtros seleccionados (ver Interacciones).

#### Contador de resultados (tipo: contador)
- Formato: "1-100 de 300 Financiamientos".
- Donde "1" es el índice de la primera fila mostrada en la página actual, "100" es el índice de la última fila mostrada en la página actual, y "300" es el total de financiamientos que cumplen con los filtros.
- Color: color primario.
- Aparece después de que se ejecuta una búsqueda exitosa.
- Se actualiza al cambiar de página en la paginación.
- Posición: alineado a la izquierda en la fila sobre la tabla.
- Visibilidad: oculto durante el estado de carga.

#### Botón "Descargar Excel" (tipo: botón)
- Texto: "Descargar Excel".
- Ícono: flecha hacia abajo a la izquierda del texto.
- Énfasis: secundario.
- Ancho ajustado al contenido.
- Acción: descarga los resultados de la búsqueda actual en formato Excel.
- Posición: alineado a la derecha en la fila sobre la tabla.
- Visibilidad: oculto durante el estado de carga.

#### Tabla de financiamientos (tipo: tabla)
- Cabeceras en orden:
  1. Producto
  2. Número de financiamiento
  3. Estado
  4. Fecha de emisión
  5. Cuota pendiente
  6. Vencimiento final
  7. Tasa
  8. Monto financiamiento
  9. Saldo financiamiento

- Alineación por columna:
  - Producto: izquierda
  - Número de financiamiento: izquierda
  - Estado: izquierda
  - Fecha de emisión: izquierda
  - Cuota pendiente: izquierda
  - Vencimiento final: izquierda
  - Tasa: derecha
  - Monto financiamiento: derecha
  - Saldo financiamiento: derecha

- Formatos de datos:
  - Producto: texto libre (ejemplo: "Préstamo Personal", "Crédito Vehicular")
  - Número de financiamiento: formato tipo D015001224122
  - Estado: uno de los valores: Vencido, Moroso, Amortizado, Vigente, Cancelado (sin estilos condicionales de color)
  - Fecha de emisión: formato DD/MM/AAAA
  - Cuota pendiente: formato DD/MM/AAAA (es una fecha)
  - Vencimiento final: formato DD/MM/AAAA
  - Tasa: formato con un decimal y símbolo de porcentaje (ejemplo: 15.5%)
  - Monto financiamiento: formato con símbolo de moneda y decimales (ejemplo: S/ 1,234.56 o $ 1,234.56)
  - Saldo financiamiento: formato con símbolo de moneda y decimales (ejemplo: S/ 1,234.56 o $ 1,234.56)

- Reordenamiento de filas: sí, todas las columnas permiten ordenar excepto "Estado", "Monto financiamiento" y "Saldo financiamiento".
- Orden por defecto: sin orden específico, los datos se muestran como vengan del origen.
- Reordenamiento de columnas: no se permite arrastrar columnas para cambiar su orden.
- Paginación: sí (ver elemento de paginación).
- Contador de resultados: sí (ver elemento de contador, arriba de la tabla).
- Estilos condicionales: no, todos los valores de todas las columnas se muestran sin colores ni estilos especiales.
- Acciones por fila: no hay acciones específicas (no hay botones ni clics en las filas).
- Selección de filas: no se permite seleccionar filas con checkboxes.

#### Paginación (tipo: paginación)
- Opciones de filas por página: 25, 50, 100.
- Valor por defecto: 100 filas por página.
- Posición: debajo de la tabla.
- Comportamiento: al cambiar de página, se actualiza solo la tabla y el contador de resultados.

#### Elemento de carga (tipo: skeleton / loader)
- Qué lo dispara: al presionar el botón "Buscar" (tanto en la carga inicial automática como en búsquedas posteriores).
- Dónde se muestra: reemplaza la tabla de financiamientos en el área donde normalmente aparecería la tabla.
- Mientras el skeleton está visible, el contador de resultados y el botón "Descargar Excel" también deben estar ocultos.
- Desaparece cuando los resultados están listos para mostrarse.

### Interacciones
- Al presionar el botón "Buscar" con todos los filtros válidos:
  1. Se ocultan el contador de resultados y el botón "Descargar Excel".
  2. Se muestra el skeleton de carga en el área de la tabla.
  3. Se ejecuta la búsqueda con los filtros seleccionados (radio button de estado, rango de fechas, moneda).
  4. Al finalizar la búsqueda, se oculta el skeleton.
  5. Se muestra la tabla con los resultados.
  6. Se muestra el contador de resultados actualizado con el total y rango de índices de la página actual.
  7. Se muestra el botón "Descargar Excel".
  
- Al cambiar la selección de los radio buttons, el dropdown de moneda o el rango de fechas, el botón "Buscar" se habilita o deshabilita según la validez del formulario (rango de fechas completo y válido).

- Al cambiar de página en la paginación:
  1. Se actualiza la tabla con los registros de la nueva página.
  2. Se actualiza el contador de resultados para reflejar los nuevos índices de fila.

- El botón "Descargar Excel" al presionarse descarga los resultados de la búsqueda actual.

- Los filtros de estado (radio buttons) determinan qué estados aparecen en los resultados:
  - "Pendiente de pago" seleccionado: resultados incluyen todos los estados excepto "Cancelado".
  - "Cancelados" seleccionado: resultados incluyen solo el estado "Cancelado".

### Comportamientos y estados
- **Estado inicial:** al entrar a la vista por primera vez, se ejecuta automáticamente una búsqueda con los valores por defecto:
  - Radio button "Pendiente de pago" seleccionado.
  - Rango de fechas: desde hoy menos 30 días hasta hoy más 30 días.
  - Moneda: "Todas".
  - Se muestra el skeleton de carga mientras se obtienen los resultados iniciales.
  - Tras la carga, la tabla ya muestra resultados, el contador está visible y el botón "Descargar Excel" está disponible.

- **Estado de carga:** mientras una búsqueda está en proceso:
  - Se muestra un skeleton en el área de la tabla.
  - El contador de resultados está oculto.
  - El botón "Descargar Excel" está oculto.
  - Los filtros en la card permanecen visibles y accesibles.

- **Estado vacío:** no se contempla en este prototipo (ver "Alcance y supuestos").

- **Errores y validaciones:**
  - Si el rango de fechas es inválido (fecha desde posterior a fecha hasta, o alguna fecha sin completar), se muestra el mensaje "el rango de fechas es inválido" y el botón "Buscar" permanece deshabilitado.
  - No se contemplan otros casos de error en este prototipo (ver "Alcance y supuestos").

---

## Flujo global entre vistas
Un tester entra a la vista de Consulta de financiamientos y observa automáticamente una búsqueda ejecutándose con los filtros por defecto (Pendiente de pago, ±30 días, Todas las monedas), ve un skeleton de carga y luego la tabla con aproximadamente 100 financiamientos. Puede cambiar los filtros (seleccionar "Cancelados", ajustar el rango de fechas o elegir una moneda específica) y presionar "Buscar" para ver nuevos resultados. Puede navegar entre páginas usando la paginación para ver más registros, y puede descargar los resultados en Excel presionando el botón correspondiente. El contador de resultados se actualiza dinámicamente al cambiar de página. Como es una vista única, no hay navegación hacia otras vistas.

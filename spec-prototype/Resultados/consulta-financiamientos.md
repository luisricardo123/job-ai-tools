# Especificación de prototipo: Consulta de financiamientos

## Objetivo
Permitir al usuario consultar financiamientos pendientes de pago o cancelados mediante filtros de fecha, estado y moneda, visualizando los resultados en una tabla paginada con información detallada de cada financiamiento y opción de descarga.

## Alcance y supuestos
- **Fuera del alcance:** No se incluye funcionalidad de pago directo desde esta vista (solo consulta).
- **Fuera del alcance:** La funcionalidad de descarga de Excel no esta contemplada, solamente debe aparecer el boton.
- **Fuera del alcance:** No se especifica el comportamiento al hacer clic en una fila de la tabla (no hay vista de detalle).
- **Supuesto:** Los valores de las columnas "Producto", "Número de financiamiento", "Fecha de emisión", "Vencimiento final", "Tasa", "Monto financiamiento" y "Saldo financiamiento" se generarán de forma aleatoria dentro de los rangos especificados en la sección de datos mock.

## Mapa de vistas y navegación
- **Vista única:** Consulta de financiamientos — permite filtrar y visualizar financiamientos pendientes o cancelados.
- No hay navegación entre vistas; toda la funcionalidad ocurre en una sola pantalla.

## Datos de ejemplo (mock)
- **Cantidad total:** 110 registros de financiamientos.
- **Distribución de estados (para filtro "Pendiente de pago"):** Distribución aleatoria entre Vencido, Moroso, Amortizado y Vigente.
- **Distribución de monedas:** Distribución aleatoria entre Soles (S/) y Dólares ($).
- **Tipos de producto:** Fec exterior, Fondo crecer, Pre embarque, Fec local, Capital de trabajo (distribuidos aleatoriamente).
- **Formato de número de financiamiento:** Patrón D0150001243 (letra D + 10 dígitos numéricos).
- **Rangos de montos:** Entre 10,000 y 100,000 (tanto para Monto financiamiento como Saldo financiamiento).
- **Tasa:** Valores entre 5% y 25% con un decimal (ej: 12.5%).
- **Fechas:**
  - Fecha de emisión: distribuidas en los últimos 2 años.
  - Cuota pendiente (fecha): distribuida dentro del rango de búsqueda por defecto (30 días antes y 30 días después de la fecha actual: 22/06/2026 a 21/08/2026).
  - Vencimiento final: fechas posteriores a la cuota pendiente.
- **Casos para probar paginación:** Los 110 registros permiten tener 2 páginas (primera con 100, segunda con 10) usando la paginación por defecto.

---

## Vista 1: Consulta de financiamientos

### Propósito
Mostrar una interfaz de búsqueda y consulta de financiamientos donde el usuario puede filtrar por estado (pendiente de pago o cancelados), rango de fechas y moneda, visualizar los resultados en una tabla paginada, y descargar los datos en formato Excel.

### Layout (regiones y orden)

- **Región superior:**
  - Título principal "Financiamientos"
  - Subtítulo "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas"

- **Región de filtros:**
  - Título de sección "Búsqueda de financiamientos"
  - Primera fila: Radio buttons (Pendiente de pago / Cancelados)
  - Segunda fila: Texto explicativo dinámico del rango de fechas
  - Tercera fila: Campos de filtro en horizontal
    - Bloque de rango de fechas (Desde / Hasta)
    - Selector de moneda
    - Botón "Buscar" alineado a la derecha

- **Región de resultados:**
  - Fila con contador de resultados (izquierda) y botón "Descargar Excel" (derecha)
  - Tabla de resultados
  - Controles de paginación (debajo de la tabla)

### Inventario de elementos

1. Título principal (texto estático)
2. Subtítulo (texto estático)
3. Título de sección de filtros (texto estático)
4. Radio buttons de tipo de financiamiento (2 opciones)
5. Texto explicativo de rango de fechas (texto dinámico)
6. Bloque de rango de fechas (2 campos de fecha)
7. Selector de moneda (dropdown)
8. Botón "Buscar"
9. Contador de resultados (texto dinámico)
10. Botón "Descargar Excel"
11. Tabla de resultados (9 columnas)
12. Controles de paginación
13. Skeleton de carga (estado temporal)
14. Mensaje de estado vacío (estado temporal)
15. Mensaje de error de validación (estado temporal)

### Detalle de elementos

#### Título principal (tipo: texto estático)
- Texto: "Financiamientos"
- Posición: Parte superior de la vista
- Énfasis: título de nivel 1

#### Subtítulo (tipo: texto estático)
- Texto: "Consulta tus financiamientos cancelados y paga los pendientes después de revisar sus cuotas"
- Posición: Inmediatamente debajo del título principal
- Énfasis: texto secundario/descriptivo

#### Título de sección de filtros (tipo: texto estático)
- Texto: "Búsqueda de financiamientos"
- Posición: Inicio de la región de filtros
- Énfasis: título de nivel 2 o 3

#### Radio buttons de tipo de financiamiento (tipo: radio button)
- Opciones disponibles: "Pendiente de pago" / "Cancelados"
- Estado inicial: "Pendiente de pago" seleccionado
- Comportamiento: Mutuamente excluyentes (selección única)
- Efecto: No ejecuta búsqueda automáticamente; requiere presionar el botón "Buscar"

#### Texto explicativo de rango de fechas (tipo: texto dinámico)
- Cuando "Pendiente de pago" está seleccionado: "Selecciona el rango de fechas de vencimiento de las cuotas pendientes"
- Cuando "Cancelados" está seleccionado: "Selecciona el rango de fechas de vencimiento final"
- Posición: Entre los radio buttons y los campos de filtro

#### Bloque de rango de fechas (tipo: selector de fechas)
- Componente único con dos campos: "Desde" y "Hasta"
- Formato de fecha: DD/MM/YYYY
- Valores iniciales:
  - Desde: 30 días antes de hoy (22/06/2026)
  - Hasta: 30 días después de hoy (21/08/2026)
- Validaciones:
  - Ambos campos son obligatorios para ejecutar la búsqueda
  - La fecha "Hasta" debe ser posterior o igual a la fecha "Desde"
  - Si la fecha "Hasta" es anterior a "Desde", mostrar mensaje de error: "La fecha ingresada es inválida"
- Comportamiento: Abre calendario emergente para selección de fecha

#### Selector de moneda (tipo: dropdown)
- Opciones disponibles (en orden):
  1. Todas
  2. Soles
  3. Dólares
- Opción seleccionada por defecto: "Todas"
- Selección única
- Sin buscador interno

#### Botón "Buscar" (tipo: botón)
- Texto: "Buscar"
- Énfasis: Principal
- Posición: Parte inferior derecha del formulario de filtros, después de los campos
- Ancho: Ajustado al contenido
- Estado inicial: Habilitado
- Estado durante carga: Deshabilitado mientras se procesan los resultados
- Acción: Ejecuta la búsqueda con los filtros seleccionados (ver sección de Interacciones)

#### Contador de resultados (tipo: texto dinámico)
- Formato: "[inicio]-[fin] de [total] resultados"
- Ejemplos:
  - Primera página: "1-100 de 110 resultados"
  - Segunda página: "101-110 de 110 resultados"
- Posición: Arriba de la tabla, alineado a la izquierda
- Actualización: Se actualiza después de cada búsqueda exitosa

#### Botón "Descargar Excel" (tipo: botón)
- Texto: "Descargar Excel"
- Ícono: Ícono de descarga a la izquierda del texto
- Énfasis: Secundario
- Posición: En la misma fila que el contador de resultados, alineado a la derecha
- Ancho: Ajustado al contenido
- Estado: Habilitado cuando hay resultados en la tabla
- Acción: Descarga los resultados visibles en formato Excel

#### Tabla de resultados (tipo: tabla)
- **Columnas (en orden):**
  1. Producto
  2. Número de financiamiento
  3. Estado
  4. Fecha de emisión
  5. Cuota pendiente (fecha)
  6. Vencimiento final
  7. Tasa
  8. Monto financiamiento
  9. Saldo financiamiento

- **Alineación de columnas:**
  - Izquierda: Producto, Número de financiamiento, Estado, Fecha de emisión, Cuota pendiente, Vencimiento final, Tasa
  - Derecha: Monto financiamiento, Saldo financiamiento

- **Formato de valores:**
  - Fechas: DD/MM/YYYY
  - Montos: Con símbolo de moneda (S/ o $), separador de miles y dos decimales. Ejemplo: S/ 10,500.00 o $ 25,300.50. **Todos los montos en negrita.**
  - Tasa: Formato porcentual con un decimal. Ejemplo: 12.5%
  - Estado: Texto simple (sin formato especial)

- **Ordenamiento:**
  - Columnas ordenables: Producto, Número de financiamiento, Fecha de emisión, Cuota pendiente, Vencimiento final, Tasa
  - Columnas NO ordenables: Estado, Monto financiamiento, Saldo financiamiento
  - Orden inicial: Sin orden predefinido; se muestra como llega la data
  - Al hacer clic en una cabecera ordenable, alterna entre ascendente/descendente

- **Paginación:** Integrada con los controles de paginación. Los valores disponibles en el selector de tamaño de página son 25, 50, 100

- **Acciones por fila:** Ninguna

- **Selección de filas:** No aplica

- **Estado vacío específico:** Cuando no hay resultados, la tabla no se muestra; aparece el mensaje de estado vacío general (ver sección de Comportamientos y estados)

#### Controles de paginación (tipo: paginación)
- Posición: Debajo de la tabla
- Tamaño de página por defecto: 100 resultados
- Opciones de tamaño de página: El usuario puede cambiar la cantidad de resultados por página (valores disponibles a criterio del implementador; sugerido: 10, 25, 50, 100)
- Comportamiento: Al cambiar de página o tamaño de página, actualiza la tabla y el contador de resultados

#### Skeleton de carga (tipo: loader)
- Qué lo dispara: Al presionar el botón "Buscar"
- Dónde se muestra: Reemplaza la tabla de resultados
- Apariencia: Esqueleto visual que simula la estructura de la tabla (cabeceras y filas)
- Duración: Hasta que los resultados estén listos para mostrarse

#### Mensaje de estado vacío (tipo: mensaje)
- Cuándo se muestra: Cuando la búsqueda no arroja resultados
- Dónde se muestra: Reemplaza la tabla de resultados
- Texto: "No se han encontrado resultados, intente cambiando su búsqueda"

#### Mensaje de error de validación (tipo: mensaje)
- Cuándo se muestra: Cuando el rango de fechas es inválido (fecha "Hasta" anterior a fecha "Desde")
- Dónde se muestra: Cerca de los campos de fecha (a criterio del implementador: debajo del bloque de fechas o como mensaje emergente)
- Texto: "La fecha ingresada es inválida"
- Tipo: Error

### Interacciones

1. **Cambio de radio button:** Cuando el usuario selecciona "Pendiente de pago" o "Cancelados", el texto explicativo del rango de fechas se actualiza dinámicamente. No se ejecuta búsqueda automática.

2. **Validación de fechas:** Cuando el usuario presiona el botón "Buscar", si la fecha "Hasta" es anterior a la fecha "Desde", se muestra el mensaje de error "La fecha ingresada es inválida" y no se ejecuta la búsqueda.

3. **Ejecución de búsqueda:** Al presionar el botón "Buscar" (con fechas válidas):
   - El botón "Buscar" se deshabilita
   - La tabla de resultados es reemplazada por el skeleton de carga
   - Se ejecuta la búsqueda con los filtros seleccionados (tipo de financiamiento, rango de fechas, moneda)
   - Una vez completada la búsqueda:
     - El skeleton de carga desaparece
     - El botón "Buscar" se habilita nuevamente
     - Si hay resultados: se muestra la tabla con los datos, el contador se actualiza, y el botón "Descargar Excel" se habilita
     - Si no hay resultados: se muestra el mensaje de estado vacío y el botón "Descargar Excel" permanece deshabilitado o no se muestra

4. **Ordenamiento de tabla:** Al hacer clic en una cabecera ordenable de la tabla, las filas se reordenan según esa columna (alternando entre ascendente y descendente en clics sucesivos).

5. **Cambio de página o tamaño de página:** Al cambiar de página o modificar el tamaño de página en los controles de paginación, la tabla se actualiza mostrando los registros correspondientes y el contador se actualiza con el nuevo rango (ej: "101-110 de 110 resultados").

6. **Descarga de Excel:** Al presionar el botón "Descargar Excel", se descarga un archivo con los resultados actuales de la tabla.

### Comportamientos y estados

- **Estado inicial:** 
  - Al cargar la vista por primera vez:
    - Radio button "Pendiente de pago" seleccionado
    - Texto explicativo: "Selecciona el rango de fechas de vencimiento de las cuotas pendientes"
    - Campo "Desde": 22/06/2026
    - Campo "Hasta": 21/08/2026
    - Selector de moneda: "Todas"
    - Botón "Buscar": habilitado
    - La búsqueda con estos filtros por defecto ya está ejecutada
    - Tabla visible con los 110 registros mock filtrados
    - Contador: "1-100 de 110 resultados"
    - Botón "Descargar Excel": habilitado
    - Paginación mostrando página 1 de 2

- **Estado de carga:** 
  - Cuándo aparece: Al presionar el botón "Buscar"
  - Qué se muestra: 
    - Botón "Buscar" deshabilitado
    - Skeleton de tabla en lugar de la tabla de resultados
    - El contador y botón "Descargar Excel" no se deben mostrar
  - Duración simulada: A criterio del implementador (suficiente para que el usuario perciba el estado de carga)

- **Estado vacío:** 
  - Cuándo aparece: Cuando la búsqueda no arroja resultados
  - Qué se muestra:
    - Mensaje: "No se han encontrado resultados, intente cambiando su búsqueda" (en lugar de la tabla)
    - Contador no se muestra o muestra "0 resultados"
    - Botón "Descargar Excel" deshabilitado o no se muestra

- **Errores y validaciones:**
  - **Validación de rango de fechas:** Antes de ejecutar la búsqueda, si la fecha "Hasta" es anterior a la fecha "Desde", se muestra el mensaje "La fecha ingresada es inválida" y la búsqueda no se ejecuta.
  - **Validación de campos obligatorios:** Ambos campos de fecha deben estar completos; si alguno está vacío, la búsqueda no se ejecuta (a criterio del implementador: deshabilitar el botón "Buscar" o mostrar mensaje de error al intentar buscar).

---

## Flujo global entre vistas

Como esta funcionalidad consta de una sola vista, el flujo completo es el siguiente:

1. El usuario ingresa a la vista "Consulta de financiamientos".
2. La vista se carga con filtros por defecto (Pendiente de pago, fechas de 30 días antes y después de hoy, moneda Todas) y muestra automáticamente los resultados de una búsqueda con estos filtros: tabla con 100 registros de la página 1, contador "1-100 de 110 resultados", botón "Descargar Excel" habilitado.
3. El usuario puede modificar los filtros:
   - Cambiar a "Cancelados" y observar que el texto explicativo cambia.
   - Modificar las fechas "Desde" y "Hasta".
   - Seleccionar una moneda específica.
4. Al presionar "Buscar", la tabla se reemplaza temporalmente por un skeleton de carga, el botón se deshabilita, y luego aparecen los nuevos resultados filtrados.
5. El usuario puede ordenar la tabla haciendo clic en las cabeceras ordenables.
6. El usuario puede navegar entre páginas o cambiar el tamaño de página para ver más o menos resultados.
7. El usuario puede descargar los resultados en Excel presionando el botón "Descargar Excel".
8. El usuario puede probar el estado vacío ingresando filtros que no arrojen resultados y observar el mensaje correspondiente.
9. El usuario puede probar la validación de rango de fechas inválido (fecha "Hasta" anterior a fecha "Desde") y observar el mensaje de error.

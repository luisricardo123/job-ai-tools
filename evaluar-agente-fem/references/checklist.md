# Checklist de evaluación del agente FEM

Este es el checklist completo a aplicar. Cada ítem se marca con uno de estos estados:

- ✅ Cumple
- ❌ No cumple
- ➖ No aplica

Cuando un criterio se marca ❌, agrega debajo una observación con este formato exacto:

> **Observación:** Describe qué hizo incorrectamente el agente y cuál fue la consecuencia.

Si no existe evidencia suficiente para validar un criterio (por ejemplo, no se pudo ejecutar el
build o los tests, o los logs no cubren ese aspecto), indícalo explícitamente en la observación
en vez de inventar un resultado. No inventes resultados bajo ninguna circunstancia.

---

## 1. Componentes BCP

- [ ] Se seleccionó el componente BCP adecuado según su propósito.
- [ ] Todos los componentes BCP utilizados existen en la versión disponible de la librería.
- [ ] No se utilizaron componentes BCP deprecados.
- [ ] No se reemplazaron innecesariamente componentes BCP por elementos HTML genéricos.
- [ ] Los sufijos de los tags de los componentes BCP son correctos.

### 1.1 Propiedades, eventos y directivas

- [ ] Todas las propiedades utilizadas existen.
- [ ] Los valores asignados a las propiedades son válidos.
- [ ] Las propiedades fueron utilizadas de manera coherente con el comportamiento esperado.
- [ ] Todos los eventos utilizados existen.
- [ ] Los eventos fueron utilizados de manera coherente.
- [ ] Todas las directivas utilizadas existen.
- [ ] Las directivas fueron utilizadas de manera coherente.

## 2. Implementación y configuración Angular

- [ ] Se detectó y respetó la versión de Angular del proyecto.
- [ ] Se respetó la arquitectura existente del proyecto.
- [ ] Se respetó si el proyecto utiliza componentes standalone o módulos.
- [ ] Se agregaron las importaciones necesarias.
- [ ] No se agregaron importaciones innecesarias.
- [ ] Se configuró correctamente `CUSTOM_ELEMENTS_SCHEMA`.
- [ ] Se respetaron las configuraciones y particularidades del canal.
- [ ] El código generado compila correctamente.

## 3. Fidelidad funcional y visual

- [ ] La implementación representa correctamente la estructura del diseño.
- [ ] Los componentes tienen el tamaño y comportamiento esperado.
- [ ] Los botones ocupan el ancho esperado cuando corresponde.
- [ ] No se utilizaron estilos personalizados para reemplazar capacidades ya disponibles en los
      componentes BCP.

### 3.1 Sistema de diseño BCP

Verificable contra la skill `bcp-design-system` — cárgala antes de evaluar estos ítems, no los
resumas de memoria. Estos ítems verifican **layout, agrupación y criterio de elección de variante**
— nunca la apariencia interna de un componente (color, borde, forma, peso), que resuelve el propio
componente y esta skill no prescribe (M4).

- [ ] El título de cada vista/sección usa el nivel de jerarquía correcto: principal de vista (C6),
      secundario/rótulo de card de formulario (C7), o de sub-sección dentro de una card de datos
      (C17).
- [ ] Los buscadores y bloques de datos de solo lectura están contenidos en una card (C1).
- [ ] El botón de búsqueda de un formulario está abajo, a la derecha (C2).
- [ ] El contador de resultados de tabla está arriba de la tabla, a la izquierda, con el formato
      `[inicial]-[final] de **[total] [Entidad]**` (C3).
- [ ] La paginación de tabla está centrada, debajo de la tabla, y se resuelve sobre la totalidad de
      los registros ya cargados (C5).
- [ ] No hay colores de fondo usados como decoración en elementos genéricos de interfaz (C8).
- [ ] Los montos siguen el formato `[símbolo] [número]` con coma de millares, punto decimal y
      siempre dos decimales (C13), alineados a la derecha y en negrita en tabla (C10).
- [ ] El énfasis de cada botón (principal/secundario/menor compromiso) corresponde a su rol en la
      vista, según V-BOTON2.
- [ ] Una columna de estado se representa con la variante de badge, con el color mapeado según el
      criterio semántico recomendado (V-BADGE2).

## 4. Calidad del código

- [ ] El código es legible.
- [ ] Los nombres de variables y métodos son claros.
- [ ] Los métodos tienen una responsabilidad definida.
- [ ] No existe código duplicado.
- [ ] No existe código muerto o sin utilizar.
- [ ] No existen comentarios innecesarios.
- [ ] No se modificaron archivos ajenos al alcance solicitado.
- [ ] No se agregaron soluciones excesivamente complejas.
- [ ] La implementación sigue el estilo existente del repositorio.
- [ ] Una segunda ejecución del agente no duplica imports, métodos, estilos o componentes.

## 5. Pruebas unitarias

- [ ] Se generaron archivos de pruebas unitarias.
- [ ] Se generaron pruebas para todos los componentes.
- [ ] Se generaron pruebas para los métodos implementados.
- [ ] Se probaron los comportamientos principales.
- [ ] Los mocks representan correctamente las dependencias reales.
- [ ] Las pruebas son independientes entre sí.
- [ ] Las pruebas se ejecutaron correctamente.
- [ ] La cobertura obtenida es igual o superior al 85%.

### 5.6 Estándares BCP para pruebas unitarias

- [ ] El `describe` principal utiliza el formato `@NombreClaseOMetodo`.
- [ ] Los `describe` internos comienzan con `Where`.
- [ ] Los `it` comienzan con `#Should`.
- [ ] Cada `it` contiene un solo `expect`.
- [ ] Los nombres de las pruebas describen claramente el escenario evaluado.
- [ ] La organización de las pruebas es consistente.
- [ ] No existen pruebas duplicadas.

## 6. Control de invenciones y transparencia

- [ ] El agente no inventó componentes.
- [ ] El agente no inventó propiedades.
- [ ] El agente no inventó eventos.
- [ ] El agente no inventó íconos.
- [ ] El agente no inventó módulos o importaciones.

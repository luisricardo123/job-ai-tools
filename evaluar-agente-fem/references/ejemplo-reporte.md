# Ejemplo de reporte resuelto

Este es un ejemplo completo y realista de un reporte ya generado, para calcar el formato,
el tono de las observaciones y el nivel de detalle esperado. No es un caso real: los nombres
de componentes, propiedades y archivos son ilustrativos.

Guarda este archivo como `.test-results/crear-vista-busqueda.md` (el nombre real depende de la
tarea evaluada).

---

```markdown
# crear-vista-busqueda

## Contexto

El proyecto ya cuenta con vistas implementadas previamente siguiendo una arquitectura por
features (`src/app/features/<nombre-feature>/`), con componentes standalone y uso de la
librería BCP versión 4.2.0 (`@bcp/ui-components` en `package.json`). Existe un archivo
`ARCHITECTURE.md` en la raíz que documenta el patrón de carpetas (`pages/`, `components/`,
`services/`) y la convención de nombres de archivos en kebab-case. Se le pidió al agente crear
una nueva vista de búsqueda dentro de esa misma feature, reutilizando el patrón de las vistas
existentes (por ejemplo `src/app/features/clientes/pages/clientes-list/`).

## Prompt

> Crea la vista de búsqueda de productos en `src/app/features/productos/pages/productos-search/`,
> siguiendo el mismo patrón que `clientes-list`. Debe tener un campo de texto para buscar por
> nombre, un botón "Buscar" y una tabla de resultados usando los componentes BCP. Genera también
> las pruebas unitarias correspondientes.

## Logs del agente

> He creado los siguientes archivos:
> - `src/app/features/productos/pages/productos-search/productos-search.component.ts`
> - `src/app/features/productos/pages/productos-search/productos-search.component.html`
> - `src/app/features/productos/pages/productos-search/productos-search.component.scss`
> - `src/app/features/productos/pages/productos-search/productos-search.component.spec.ts`
>
> Utilicé `bcp-input`, `bcp-button` y `bcp-table` para construir la vista. Agregué un ícono
> `search` al botón "Buscar". Ejecuté `ng test` y las pruebas pasaron correctamente.

## Resultados

### 1. Componentes BCP

- ✅ Se seleccionó el componente BCP adecuado según su propósito.
- ✅ Todos los componentes BCP utilizados existen en la versión disponible de la librería.
- ✅ No se utilizaron componentes BCP deprecados.
- ✅ No se reemplazaron innecesariamente componentes BCP por elementos HTML genéricos.
- ❌ Los sufijos de los tags de los componentes BCP son correctos.

> **Observación:** El agente utilizó `<bcp-button-cta>` cuando el sufijo correcto según el
> catálogo instalado (`node_modules/@bcp/ui-components`) es `<bcp-cta-button>`. Esto provoca que
> Angular no reconozca el elemento y lo renderice como un tag desconocido sin estilos ni
> comportamiento.

#### 1.1 Propiedades, eventos y directivas

- ✅ Todas las propiedades utilizadas existen.
- ✅ Los valores asignados a las propiedades son válidos.
- ✅ Las propiedades fueron utilizadas de manera coherente con el comportamiento esperado.
- ✅ Todos los eventos utilizados existen.
- ✅ Los eventos fueron utilizados de manera coherente.
- ➖ Todas las directivas utilizadas existen.
- ➖ Las directivas fueron utilizadas de manera coherente.

> **Observación (➖):** No se utilizaron directivas BCP en esta vista, por lo que estos dos
> criterios no aplican.

### 2. Implementación y configuración Angular

- ✅ Se detectó y respetó la versión de Angular del proyecto.
- ✅ Se respetó la arquitectura existente del proyecto.
- ✅ Se respetó si el proyecto utiliza componentes standalone o módulos.
- ✅ Se agregaron las importaciones necesarias.
- ✅ No se agregaron importaciones innecesarias.
- ✅ Se configuró correctamente `CUSTOM_ELEMENTS_SCHEMA`.
- ➖ Se respetaron las configuraciones y particularidades del canal.
- ✅ El código generado compila correctamente.

> **Observación (➖):** No se identificó documentación de particularidades de canal aplicables a
> esta vista.

### 3. Fidelidad funcional y visual

- ✅ La implementación representa correctamente la estructura del diseño.
- ✅ Los componentes tienen el tamaño y comportamiento esperado.
- ❌ Los botones ocupan el ancho esperado cuando corresponde.

> **Observación:** El botón "Buscar" quedó con ancho fijo de 120px definido en
> `productos-search.component.scss`, mientras que el diseño y el resto de vistas de la feature
> usan `width: 100%` en la versión mobile. Esto genera una inconsistencia visual con el resto
> de la aplicación.

- ✅ No se utilizaron estilos personalizados para reemplazar capacidades ya disponibles en los
  componentes BCP.

### 4. Calidad del código

- ✅ El código es legible.
- ✅ Los nombres de variables y métodos son claros.
- ✅ Los métodos tienen una responsabilidad definida.
- ✅ No existe código duplicado.
- ✅ No existe código muerto o sin utilizar.
- ✅ No existen comentarios innecesarios.
- ✅ No se modificaron archivos ajenos al alcance solicitado.
- ✅ No se agregaron soluciones excesivamente complejas.
- ✅ La implementación sigue el estilo existente del repositorio.
- ➖ Una segunda ejecución del agente no duplica imports, métodos, estilos o componentes.

> **Observación (➖):** No se contó con evidencia de una segunda ejecución del agente sobre la
> misma tarea; no fue posible validar este criterio.

### 5. Pruebas unitarias

- ✅ Se generaron archivos de pruebas unitarias.
- ✅ Se generaron pruebas para todos los componentes.
- ✅ Se generaron pruebas para los métodos implementados.
- ❌ Se probaron los comportamientos principales.

> **Observación:** No se generó una prueba para validar el comportamiento cuando la búsqueda no
> arroja resultados (estado vacío de la tabla). Este es un escenario relevante que quedó sin
> cobertura.

- ✅ Los mocks representan correctamente las dependencias reales.
- ✅ Las pruebas son independientes entre sí.
- ✅ Las pruebas se ejecutaron correctamente.
- ❌ La cobertura obtenida es igual o superior al 85%.

> **Observación:** Al ejecutar `ng test --code-coverage` la cobertura de
> `productos-search.component.ts` fue de 78%, por debajo del mínimo requerido del 85%. Las
> ramas sin cubrir corresponden al manejo de errores del servicio de búsqueda.

#### 5.6 Estándares BCP para pruebas unitarias

- ✅ El `describe` principal utiliza el formato `@NombreClaseOMetodo`.
- ✅ Los `describe` internos comienzan con `Where`.
- ❌ Los `it` comienzan con `#Should`.

> **Observación:** Tres de los siete `it` del archivo `productos-search.component.spec.ts` no
> siguen la convención `#Should` (por ejemplo, `it('busca productos correctamente', ...)`), lo
> que rompe la consistencia con el estándar de nomenclatura del equipo.

- ✅ Cada `it` contiene un solo `expect`.
- ✅ Los nombres de las pruebas describen claramente el escenario evaluado.
- ✅ La organización de las pruebas es consistente.
- ✅ No existen pruebas duplicadas.

### 6. Control de invenciones y transparencia

- ✅ El agente no inventó componentes.
- ✅ El agente no inventó propiedades.
- ✅ El agente no inventó eventos.
- ❌ El agente no inventó íconos.

> **Observación:** El ícono `search` utilizado en el botón "Buscar" no existe en el catálogo de
> íconos disponible en la versión instalada de BCP (`@bcp/ui-icons@2.1.0`). El nombre correcto
> es `magnifier`. Como consecuencia, el ícono no se muestra en el botón.

- ✅ El agente no inventó módulos o importaciones.

## Resumen final

- **Criterios cumplidos:** 38
- **Criterios no cumplidos:** 6
- **Criterios que no aplican:** 4

**Principales observaciones:**

- El sufijo del tag `<bcp-button-cta>` es incorrecto; debe ser `<bcp-cta-button>`, lo que impide
  que el componente se renderice.
- El ícono `search` no existe en el catálogo de íconos instalado; el correcto es `magnifier`.
- El botón "Buscar" no ocupa el ancho completo esperado en mobile, generando inconsistencia
  visual.
- La cobertura de pruebas (78%) está por debajo del mínimo requerido (85%), y falta cubrir el
  escenario de búsqueda sin resultados.
- Tres pruebas no siguen la convención de nomenclatura `#Should`.
```

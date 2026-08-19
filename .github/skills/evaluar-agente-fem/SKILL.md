---
name: evaluar-agente-fem
description: >
  Evalúa el trabajo generado por un agente FEM (Angular + componentes BCP) contra un checklist
  de calidad y genera un reporte en `.test-results/`. Úsala cuando el usuario pida "evaluar al
  agente", "evaluar agente FEM", "revisar lo que hizo el agente", "aplicar el checklist FEM",
  "generar reporte de evaluación", o después de que un agente FEM haya creado o modificado una
  vista/componente Angular con componentes BCP y se quiera validar su calidad. También cuando se
  invoque /evaluar-agente-fem.
---

# Evaluar agente FEM

Evalúa, con el rol de revisor de calidad, el trabajo que un agente FEM (agente que genera
vistas/componentes Angular usando la librería de componentes BCP) realizó en una tarea concreta,
y produce un reporte de evaluación en `.test-results/`.

**Analiza únicamente los archivos y cambios generados por el agente evaluado.** No evalúes el
resto del proyecto ni código preexistente que el agente no tocó.

## Insumos

El prompt original que se le dio al agente FEM y sus logs (su respuesta) están en la
**conversación actual**, normalmente como una sola respuesta previa del agente. No los pidas
como argumento ni los busques en archivos: localízalos en el historial de la conversación.

- Si no encuentras un prompt o unos logs claros en la conversación, pídeselos al usuario antes
  de continuar — no inventes ni asumas su contenido.
- Los "cambios generados por el agente" son los archivos que ese agente creó o modificó. Si el
  proyecto es un repositorio git, usa `git status` / `git diff` para identificarlos con
  precisión. Si no es un repo git, apóyate en lo que digan los logs del agente sobre qué archivos
  tocó, y confírmalo listando esos archivos.

## Proceso

### Paso 1 — Reunir contexto del proyecto

Antes de evaluar, entiende el terreno:

- Versión de Angular (`package.json` → `@angular/core`).
- Si el proyecto usa componentes **standalone** o **módulos** (`NgModule`).
- Arquitectura del proyecto: busca documentación (`ARCHITECTURE.md`, `README.md`, convenciones en
  `CLAUDE.md`, etc.) o, si no existe, infierla de la estructura de carpetas ya presente.
- Si el proyecto es nuevo (sin vistas previas) o ya tiene vistas construidas que sirven de
  referencia de estilo/patrón.
- Particularidades de canal si existen (configuraciones específicas documentadas en el repo).
- La **librería BCP instalada** y su versión (revisa `package.json` y, si aplica,
  `node_modules/@bcp/...` o el paquete equivalente). Esta es la fuente de verdad para el
  apartado 6 (control de invenciones): úsala para confirmar que cada componente, propiedad,
  evento, directiva, ícono y sufijo de tag que usó el agente **existe realmente** en esa versión.
  No valides invenciones "de oído": revisa los tipados/catálogo/documentación de la librería
  instalada.

### Paso 2 — Cargar el checklist

Lee `references/checklist.md` — contiene los 6 apartados completos con todos los criterios a
evaluar. Ese archivo es la fuente de verdad del checklist; no lo resumas de memoria.

### Paso 3 — Ejecutar validaciones cuando sea posible

Para respaldar con evidencia real los criterios de compilación y pruebas (apartados 2 y 5):

- Intenta compilar el proyecto (`ng build`, o el script de build definido en `package.json`).
- Intenta ejecutar las pruebas con cobertura (`ng test --code-coverage`, o el script de test del
  repo).
- Registra el resultado real (compiló o no y qué error dio; tests en verde o rojo y cuáles
  fallaron; porcentaje de cobertura obtenido vs. el 85% requerido).

Si el entorno no permite ejecutar el build o los tests (falta de dependencias, timeout, etc.),
**no inventes el resultado**. Usa lo que digan los logs del agente al respecto si son
suficientes, y si no lo son, indícalo explícitamente en la observación del criterio
correspondiente (p. ej. "No fue posible ejecutar el build en este entorno; no hay evidencia
suficiente para validar este criterio").

### Paso 4 — Evaluar cada criterio del checklist

Recorre los 6 apartados de `references/checklist.md` en orden y marca cada criterio:

- ✅ Cumple
- ❌ No cumple
- ➖ No aplica

Reglas:

- **No inventes resultados.** Si no hay evidencia suficiente (ni en los archivos, ni en los
  logs, ni en la ejecución de build/tests) para validar un criterio, dilo explícitamente en la
  observación en vez de asumir un ✅ o ❌.
- Cuando un criterio se marque ❌, agrega inmediatamente debajo una observación con este formato
  exacto:

  ```
  > **Observación:** Describe qué hizo incorrectamente el agente y cuál fue la consecuencia.
  ```

  La observación debe ser concreta: qué archivo/línea/elemento está involucrado, qué esperaba el
  criterio, y qué efecto tiene el incumplimiento (no renderiza, rompe el build, falla en runtime,
  inconsistencia visual, etc.).
- También puedes agregar una observación breve en criterios ➖ cuando ayude a justificar por qué
  no aplican (opcional, pero recomendado si no es obvio).

### Paso 5 — Generar el reporte

1. Crea la carpeta `.test-results/` en la raíz del proyecto si no existe.
2. Elige un nombre de archivo descriptivo en kebab-case relacionado con lo que se le pidió hacer
   al agente (ej. `crear-vista-busqueda.md`, `crear-componente-formulario-busqueda.md`,
   `crear-vista-detalle.md`, `crear-componente-tabla-busqueda.md`).
3. Escribe el archivo `.test-results/[nombre-descriptivo].md` con esta estructura:

```markdown
# [Nombre del archivo]

## Contexto
Describe si el proyecto es nuevo (sin vistas previas realmente hechas) o si ya tiene una base
establecida; si la arquitectura está documentada en algún archivo o se infiere de archivos ya
existentes que siguen cierto patrón; y cualquier otro dato relevante para interpretar la
evaluación (versión de Angular, standalone vs módulos, versión de BCP, canal, etc.).

## Prompt
El prompt exacto que se le dio al agente evaluado, tomado de la conversación.

## Logs del agente
Los logs/respuesta del agente evaluado, tomados de la conversación.

## Resultados
El checklist resuelto, organizado por los 6 apartados (y sus subapartados 1.1 y 5.6), cada
criterio marcado con ✅ / ❌ / ➖ y con las observaciones correspondientes debajo de cada ❌.

## Resumen final
- Cantidad de criterios cumplidos.
- Cantidad de criterios no cumplidos.
- Cantidad de criterios que no aplican.
- Principales observaciones encontradas (lista breve, no repitas todas las observaciones, solo
  las más relevantes).
```

Consulta `references/ejemplo-reporte.md` para ver un reporte completo ya resuelto y calcar el
formato exacto, el tono de las observaciones y el nivel de detalle esperado (no copies su
contenido, es solo un ejemplo ilustrativo).

## Al terminar

Confirma al usuario la ruta del archivo generado y resume brevemente en el chat el resumen final
(cumplidos / no cumplidos / no aplican y las observaciones más importantes) — el detalle completo
queda en el archivo `.test-results/`.

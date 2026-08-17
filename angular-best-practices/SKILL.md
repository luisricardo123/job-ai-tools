---
name: angular-best-practices
description: >
  Aplica las convenciones correctas de Angular 16 (NgModules, decoradores @Input()/@Output(), RxJS, *ngIf/*ngFor) o Angular 20 (standalone, signals, input()/output()/model(), nuevo control flow @if/@for) según la versión del proyecto. Úsala SIEMPRE que el usuario pida crear, generar, escribir, editar o revisar código Angular —componentes, servicios, directivas, pipes, guards, formularios, rutas o tests— sin importar cuán simple o rutinaria parezca la petición (ej. "hazme un componente de login", "créame un servicio para la API", "agrega un guard"), incluso si no menciona "Angular", la versión ni "buenas prácticas". Es indispensable porque es esencial para el buen funcionamiento del código: sin verificar cuál aplica antes de escribir código, se mezcla sintaxis vieja y nueva, y el resultado no compila o queda obsoleto en review.
---

# Buenas prácticas de Angular

Esta skill guía la generación de código Angular ya que se manejan proyectos en **varias versiones distintas** (hoy: Angular 16 y Angular 20). Las convenciones correctas dependen totalmente de la versión del proyecto — aplicar patrones de una versión más nueva en un proyecto viejo genera código que no compila, y aplicar patrones viejos en un proyecto nuevo genera código válido pero obsoleto que el equipo no quiere ver en review.

Cada versión tiene su propia carpeta de referencia, partida en un archivo por área (arquitectura, componentes, templates, reactividad, forms-routing, testing) con el detalle completo. Este archivo (`SKILL.md`) solo contiene lo compartido entre versiones y el mapa para saber a qué archivo ir.

## Paso 1: determinar la versión objetivo

Antes de generar o revisar código Angular, identifica la versión:

- Si el usuario la menciona explícitamente ("es un proyecto v16", "esto es Angular 20"), úsala.
- Si hay un `package.json` disponible, revisa la versión de `@angular/core`.
- Si hay código existente a la vista, las señales son claras: `*ngIf`/`*ngFor` y `@Input()`/`@Output()` decorados casi siempre indican v16; `@if`/`@for`, `input()`/`output()`/`model()`, o `inject()` sin constructor indican v20. Ojo: ver `signal()`/`computed()` por sí solo **no** indica v20 — también se usan con frecuencia en v16; las señales fiables de v20 son `@if`/`@for`, `input()`/`output()`/`model()` y standalone por defecto.
- Si no hay forma de saberlo y es ambiguo, pregunta al usuario en vez de asumir.

## Paso 2: abrir el índice de esa versión y solo el archivo que aplica

- **Angular 16** → abre [`references/angular-16/README.md`](references/angular-16/README.md).
- **Angular 20** → abre [`references/angular-20/README.md`](references/angular-20/README.md).

Cada índice lista un archivo por área (arquitectura, componentes, templates, reactividad,
forms-routing, testing). Abre **solo el archivo del área que toca la tarea**, no la carpeta entera —
por ejemplo, si vas a escribir un `*.spec.ts`, basta con `testing.md`; no hace falta releer
`componentes.md` si ya lo tienes en contexto de un paso anterior.

Si el proyecto mezcla versiones (ej. una librería compartida que debe compilar en ambas), prioriza la sintaxis compatible con la versión más baja y evita las APIs exclusivas de la versión más nueva, salvo que el usuario indique lo contrario.

## Prácticas comunes a todas las versiones

Estas convenciones de estilo del [Angular style guide oficial](https://angular.dev/style-guide) aplican sin importar la versión, así que no están repetidas en cada archivo de referencia:

- **Naming de archivos**: palabras separadas por guiones (`user-profile.ts`), tests con sufijo `.spec.ts`, el nombre del archivo coincide con el identificador de TypeScript principal.
- **Un concepto por archivo**: evita archivos `helpers.ts`/`utils.ts` genéricos que mezclan conceptos no relacionados.
- **Componentes/directivas**: agrupa primero las propiedades Angular-específicas (deps inyectadas, inputs, outputs, queries) y después los métodos.
- **Lifecycle hooks simples**: no metas lógica larga directo en `ngOnInit`; delega a métodos con nombre descriptivo (`this.cargarDatos()`), e implementa la interfaz correspondiente (`OnInit`, `OnDestroy`, etc.) para que TypeScript valide la firma.
- **Handlers de eventos**: nombra por lo que hacen, no por el evento que los dispara (`guardarUsuario()`, no `handleClick()`).
- **Evita lógica compleja en el template**: expresiones simples están bien; si crece, muévela a un `computed()` (v20) o a un método/getter del componente (v16).
- **Spec co-ubicado**: sufijo `.spec.ts` junto al archivo que prueba; un `describe` por unidad (componente, servicio, pipe, guard).
- **Un comportamiento por `it`**, estructurado en Arrange-Act-Assert y nombrado por lo que debe pasar ("debería mostrar el avatar por defecto cuando la URL viene vacía"), no por el método invocado.
- **Prueba comportamiento observable** (lo que el componente renderiza o emite), no miembros privados ni detalles de implementación.

## Tabla rápida de diferencias clave

| Aspecto | Angular 16 | Angular 20 |
|---|---|---|
| Arquitectura | NgModules (standalone opcional) | Standalone por defecto |
| Inputs/Outputs | `@Input()` / `@Output()` | `input()` / `output()` / `model()` |
| View/Content queries | `@ViewChild()` / `@ViewChildren()` / `@ContentChild()` / `@ContentChildren()` | `viewChild()` / `viewChildren()` / `contentChild()` / `contentChildren()` (signals) |
| Control flow | `*ngIf` / `*ngFor` / `*ngSwitch` | `@if` / `@for` / `@switch` |
| DI | Constructor (típico), `inject()` preferido | `inject()` preferido |
| Reactividad | RxJS + async pipe **y** `signal()`/`computed()`/`effect()` (ambos en uso, sin reemplazo); sin `linkedSignal()` ni signal inputs | `signal()` (estado), `computed()` (derivados), `effect()` (efectos secundarios) y `linkedSignal()` como base estable |
| Change detection | Zone.js + OnPush | Zone.js + OnPush |
| Guards/Resolvers | Funcionales (`CanActivateFn`) | Funcionales (`CanActivateFn`) |
| Lazy loading pesado | Lazy modules (`loadChildren`) | `@defer` a nivel de template + `loadComponent` |
| Testing | `declarations` + asignación directa de inputs (ojo: no dispara `ngOnChanges`) + `HttpClientTestingModule` | `imports` standalone + `setInput()` obligatorio para signal inputs + `provideHttpClientTesting()` + `TestBed.tick()` para efectos |

Detalle completo de cada fila, con ejemplos, en el archivo de referencia correspondiente (ver
[`references/angular-16/README.md`](references/angular-16/README.md) o
[`references/angular-20/README.md`](references/angular-20/README.md)).

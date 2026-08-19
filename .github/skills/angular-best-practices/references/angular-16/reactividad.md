# Angular 16 — Reactividad y RxJS

- El patrón dominante sigue siendo RxJS + `async` pipe en el template en vez de `subscribe()` manual.
- Para desuscripciones, usa `takeUntilDestroyed()` (disponible desde v16) en vez de patrones manuales con `Subject` + `ngOnDestroy`.

## Signals

- `signal()`, `computed()` y `effect()` están disponibles en v16 y son de uso frecuente en los proyectos del equipo; la API base es estable en la práctica. Son una opción tan válida como RxJS para estado de componente — **sigue el patrón que ya use el archivo/repo** en vez de imponer uno.
- Uso típico: `signal()` para estado mutable, `computed()` para derivados, `effect()` con moderación (si solo se deriva un valor, va `computed()`).
- En el template los signals se **leen llamándolos**: `{{ contador() }}`, `[valor]="contador()"`. La lectura en template se integra con `OnPush` (marca la vista como dirty).
- Actualización con `set()` / `update()`. **No uses `mutate()`**: existe en v16 pero fue eliminado en versiones posteriores, así que deja el código atado a v16.
- `effect()` necesita contexto de inyección (campo de clase, o pasar `{ injector }`); para escribir signals dentro de un effect en v16 hace falta `{ allowSignalWrites: true }`.
- Interop con RxJS: `toSignal()` / `toObservable()` de `@angular/core/rxjs-interop` (disponibles en v16), en vez de suscripciones manuales.
- RxJS + `async` pipe sigue siendo válido y dominante en el código actual; los signals no lo reemplazan, conviven con él.

### APIs de signals que NO existen en Angular 16

`input()`, `output()`, `model()`, `viewChild()` / `viewChildren()` / `contentChild()` / `contentChildren()` como signals, `linkedSignal()`, `resource()` / `httpResource()`. En v16 los inputs/outputs/queries siguen siendo los decoradores clásicos (ver [`componentes.md`](componentes.md)), aunque el estado interno del componente sí pueda ser signals.

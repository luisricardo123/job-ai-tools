# Angular 20 — Reactividad

- `signal()` para estado mutable, `computed()` para estado derivado de otros signals (se recalcula solo, sin subscripciones manuales, y cachea su valor hasta que cambie una dependencia), y `effect()` para efectos secundarios que reaccionan a cambios de signals (logging, sincronizar con algo fuera de Angular, etc.) — usa `effect()` con moderación, si el objetivo es solo derivar un valor casi siempre `computed()` es la herramienta correcta, no `effect()`.
- `linkedSignal()` para estado derivado pero editable (reemplaza patrones donde antes se necesitaba un signal + un effect manual para sincronizar).
- `resource()` / `httpResource()` (experimental en v20) como alternativa signal-based a manejar llamadas HTTP con RxJS manual — evalúa usarlos para fetching de datos nuevo, pero no fuerces una migración de código RxJS existente que funciona bien.
- Cuando conviene interoperar con RxJS existente, usa `toSignal()` / `toObservable()` del paquete `rxjs-interop` en vez de suscripciones manuales.

## Change detection

- Zone.js con `ChangeDetectionStrategy.OnPush` es la configuración de los proyectos; ver [`componentes.md`](componentes.md).

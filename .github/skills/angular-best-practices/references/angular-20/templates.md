# Angular 20 — Templates

- Usa el nuevo control flow: `@if`/`@else`, `@for` (con `track` obligatorio), `@switch`/`@case`. Las directivas `*ngIf`/`*ngFor`/`*ngSwitch` están deprecadas — no las generes en código nuevo.
- No hace falta importar `CommonModule` para usar `@if`/`@for`.
- Usa `@defer` para lazy-loading de bloques pesados del template (ej. componentes debajo del fold, contenido condicionado a interacción).
- `[class.x]` / `[style.x]` sobre `ngClass`/`ngStyle`, igual que en v16.

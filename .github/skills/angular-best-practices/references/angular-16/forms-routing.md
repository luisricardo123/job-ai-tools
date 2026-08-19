# Angular 16 — Forms y Routing

## Forms
- Reactive Forms tipados (`FormGroup<{...}>`, `FormControl<string>`) — evita forms no tipados.

## Routing
- `loadChildren` para lazy loading de módulos.
- El binding de route params a inputs del componente (`withComponentInputBinding()`) está disponible desde v16 — úsalo en vez de leer `ActivatedRoute.snapshot` manualmente cuando aplique.

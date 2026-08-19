# Angular 16 — Templates

- Usa directivas estructurales clásicas: `*ngIf`, `*ngFor` (siempre con `trackBy` en listas), `*ngSwitch`.
- Los self-closing tags (`<app-icon />`) están soportados y son preferibles a `<app-icon></app-icon>`.
- Evita `ngClass`/`ngStyle` cuando el binding es simple; usa `[class.x]` / `[style.x]` directamente.

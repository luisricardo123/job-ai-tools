# Angular 20 — Componentes

- Usa las APIs basadas en signals en vez de decoradores:
  - `input()` en vez de `@Input()`; `input.required<T>()` para inputs obligatorios.
  - `output()` en vez de `@Output() = new EventEmitter()`.
  - `model()` para two-way binding en vez de `@Input()` + `@Output()` combinados.
  - `viewChild()` / `viewChildren()` en vez de `@ViewChild()` / `@ViewChildren()`; `contentChild()` / `contentChildren()` en vez de `@ContentChild()` / `@ContentChildren()`. Devuelven signals, así que se leen como función (`this.miQuery()`) y se pueden combinar directo con `computed()`/`effect()`.
- Marca `readonly` las propiedades inicializadas por Angular: `input()`, `output()`, `model()`, y las view/content queries (`viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`).
- Usa `protected` (no `public`) en miembros de la clase que solo se usan desde el template — el resto de la API pública queda más clara.
- Prefiere `inject()` sobre inyección por parámetros de constructor — es más legible con muchas dependencias y da mejor inferencia de tipos.
- Usa `ChangeDetectionStrategy.OnPush` como default.

## Ejemplo: componente con input obligatorio y estado derivado

```typescript
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { User } from './user.model';

const DEFAULT_AVATAR_URL = 'assets/images/default-avatar.svg';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  readonly user = input.required<User>();

  protected readonly avatarUrl = computed(
    () => this.user().avatarUrl?.trim() || DEFAULT_AVATAR_URL,
  );
}
```

```html
<img [src]="avatarUrl()" [alt]="user().name + ' - avatar'" />
<h2>{{ user().name }}</h2>
```

El spec de este mismo componente está en [`testing.md`](testing.md).

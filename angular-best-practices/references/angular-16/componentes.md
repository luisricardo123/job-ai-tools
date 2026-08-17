# Angular 16 — Componentes

- Usa decoradores clásicos: `@Input()`, `@Output() = new EventEmitter()`.
- Para acceder a elementos del template o componentes hijos usa `@ViewChild()` (un elemento) y `@ViewChildren()` (varios, devuelve `QueryList`); para contenido proyectado, `@ContentChild()`/`@ContentChildren()`. Marca estas propiedades `readonly` cuando sea posible.
- Marca inputs obligatorios con `@Input({ required: true })`.
- Cambia siempre a `changeDetection: ChangeDetectionStrategy.OnPush` salvo que el componente tenga una razón explícita para no hacerlo.
- Inyección de dependencias por constructor es lo estándar; `inject()` es válido y preferente — sigue el estilo que ya tenga el archivo.

## Ejemplo: componente con input obligatorio

```typescript
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnChanges {
  @Input({ required: true }) user!: User;

  protected avatarSrc = 'assets/images/default-avatar.png';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.avatarSrc = this.user.avatarUrl?.trim() || 'assets/images/default-avatar.png';
    }
  }
}
```

```html
<img [src]="avatarSrc" [alt]="'Avatar de ' + user.name" />
<h3>{{ user.name }}</h3>
```

El spec de este mismo componente está en [`testing.md`](testing.md).

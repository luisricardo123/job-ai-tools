# Angular 20 — Pruebas unitarias

TestBed con **Jasmine/Karma** sigue siendo el runner por defecto en v20. No migres a otro runner
(ej. Vitest) por cuenta propia — sigue lo que ya tenga el repo.

> Este archivo cubre lo que cambia por ser Angular 20 (standalone, signals, control flow nuevo).
> Para setup del proyecto (karma.conf, umbrales de cobertura, helpers y mocks compartidos del banco),
> usa la skill `fem-web-angular-unit-testing`.

## Setup de TestBed

- El componente va en `imports:`, **nunca en `declarations:`** — es standalone por defecto (ver
  [`arquitectura.md`](arquitectura.md)).

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [UserProfileComponent],
  }).compileComponents();
});
```

## Signal inputs

- `fixture.componentRef.setInput('user', mock)` es **obligatorio** para inputs creados con
  `input()`/`input.required()` — `component.user = mock` **no compila**, el signal devuelto por
  `input()` es de solo lectura desde fuera del componente.
- Alternativa disponible en v20: bindear el input al crear el fixture con
  `TestBed.createComponent(Comp, { bindings: [inputBinding('user', () => mock)] })`.

## Outputs y `model()`

- `output()`: `component.guardar.subscribe((valor) => (recibido = valor))`, igual que un
  `EventEmitter`. También puedes usar `outputBinding('guardar', (valor) => (recibido = valor))` al
  crear el fixture.
- `model()`: usa `setInput()` para simular el valor que entra, y suscríbete a `xChange` (el output
  implícito que genera `model()`) para verificar lo que el componente emite hacia afuera.

## Leer y sincronizar signals

- Los signals se leen como función: `component.total()`, no `component.total`.
- Un `computed()` se recalcula al leerlo — no hace falta `detectChanges()` solo para obtener su
  valor en el test, únicamente para que el cambio se refleje en el DOM renderizado.
- Un `effect()` no corre de forma síncrona al cambiar su dependencia. Usa **`TestBed.tick()`** para
  forzar la sincronización (change detection + efectos), o `fixture.detectChanges()` si además
  necesitas que el DOM se actualice. El antiguo `TestBed.flushEffects()` fue **removido** en v20 —
  no lo generes en código nuevo.

## Dobles de prueba (mocks/spies)

- `jasmine.createSpyObj<MiServicio>('MiServicio', ['obtener'])` sigue aplicando igual que en v16.
- Si el servicio real expone un **signal** (ej. `usuarios: Signal<Usuario[]>`), el doble debe exponer
  un `signal()` real (`{ usuarios: signal<Usuario[]>([]) }`), no un valor plano — si no, un
  `computed()` del componente que dependa de ese signal no reacciona a los cambios que el test haga
  con `.set()`.

## HTTP

- `provideHttpClient()` + `provideHttpClientTesting()` en `providers` de `TestBed.configureTestingModule`.
- `HttpClientTestingModule` está **deprecado** — no lo generes en código v20.
- El resto es igual que en v16: `HttpTestingController`, `expectOne(url)` → `req.flush(data)`,
  `httpMock.verify()` en `afterEach`.

```typescript
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

## Guards y resolvers funcionales

- Como usan `inject()`, invócalos dentro de un contexto de inyección:
  `TestBed.runInInjectionContext(() => miGuard(route, state))`.

## `@defer`

- `fixture.getDeferBlocks()` para obtener los bloques, y `render(DeferBlockState.Complete)` (o
  `Loading`/`Error`, según el caso) para forzar su estado.
- Configura `deferBlockBehavior: DeferBlockBehavior.Manual` en `TestBed.configureTestingModule` para
  controlar el estado del `@defer` explícitamente en vez de que resuelva solo.

## Asincronía, routing y forms

Sin cambios respecto a v16 — mismos patrones (`of()`, `fakeAsync`/`tick`, `waitForAsync`, mock de
`ActivatedRoute`, forms tipados). Ver [`angular-16/testing.md`](../angular-16/testing.md) si hace
falta el detalle.

## Consultas al DOM

- `fixture.debugElement.query(By.css('[data-testid="avatar"]'))` — `data-testid` (o el id del
  estándar del banco si `frontend-id-standard` aplica), nunca clases CSS.

## Ejemplo completo

Spec del `UserProfileComponent` de [`componentes.md`](componentes.md):

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserProfileComponent } from './user-profile.component';
import { User } from './user.model';

describe('UserProfileComponent', () => {
  let fixture: ComponentFixture<UserProfileComponent>;

  const mockUser: User = { name: 'Ana Torres', avatarUrl: '' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
  });

  it('debería mostrar el avatar por defecto cuando la URL viene vacía', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.src).toContain('default-avatar.svg');
  });

  it('debería usar la URL del usuario cuando viene informada', () => {
    fixture.componentRef.setInput('user', { ...mockUser, avatarUrl: 'https://cdn/ana.png' });
    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.src).toBe('https://cdn/ana.png');
  });
});
```

Spec de un guard funcional:

```typescript
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  it('debería redirigir a login cuando no hay sesión', () => {
    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', [], {
      estaAutenticado: signal(false),
    });
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
```

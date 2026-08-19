# Angular 16 — Pruebas unitarias

TestBed clásico con **Jasmine/Karma**. Tests co-ubicados junto al archivo que prueban (`*.spec.ts`).

> Este archivo cubre lo que cambia por ser Angular 16 (NgModules, decoradores). Para setup del
> proyecto (karma.conf, umbrales de cobertura, helpers y mocks compartidos del banco), usa la skill
> `fem-web-angular-unit-testing`.

## Setup de TestBed

- `declarations: [MiComponente]` para componentes de NgModule. `imports:` es para módulos (y para
  componentes standalone solo si el proyecto ya los adoptó explícitamente, ver
  [`arquitectura.md`](arquitectura.md)).
- Usa `waitForAsync` (o `async/await` con `TestBed.configureTestingModule(...).compileComponents()`)
  cuando el componente tiene `templateUrl`/`styleUrl` externos, para que se resuelvan antes de
  `createComponent`.

```typescript
beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
    declarations: [UserProfileComponent],
  }).compileComponents();
}));
```

## Inputs y Outputs

- `component.user = mock` **funciona pero no dispara `ngOnChanges`**. Si el componente tiene lógica
  en `ngOnChanges` (como el ejemplo de [`componentes.md`](componentes.md)), usa
  `fixture.componentRef.setInput('user', mock)` — dispara `ngOnChanges` y el ciclo de detección de
  cambios correctamente, disponible desde v14.1 — en vez de asignar la propiedad directamente.
- **OnPush**: mutar una propiedad del componente desde el test no lo marca como dirty. Usa
  `setInput()`, o envuelve el componente en un *host component* de prueba y verifica cómo lo
  consume el padre (bindings reales, no asignación directa).
- Para outputs, suscríbete antes de disparar la acción:
  `component.guardar.subscribe((valor) => (recibido = valor));`.

## Dobles de prueba (mocks/spies)

- `jasmine.createSpyObj<MiServicio>('MiServicio', ['obtener'])` y
  `spy.obtener.and.returnValue(of(mock))`, provisto con `{ provide: MiServicio, useValue: spy }`.
- Nunca uses la implementación real de un servicio que pega a HTTP o depende de estado externo.

## HTTP

- `HttpClientTestingModule` en `imports` + `HttpTestingController` inyectado.
- `httpMock.expectOne(url)` para capturar la petición, `req.flush(data)` para responder.
- `httpMock.verify()` en `afterEach` para confirmar que no quedaron peticiones sin atender.

## Asincronía

- `of(mock)` para observables síncronos — cubre la mayoría de los casos con dobles de servicios.
- `fakeAsync` + `tick(ms)` para código con `setTimeout`/`debounceTime`/delays.
- `waitForAsync` + `await fixture.whenStable()` para promesas.
- `done` (callback de Jasmine) solo como último recurso, cuando no aplican los anteriores.
- Para probar la baja de una suscripción con `takeUntilDestroyed()`, llama `fixture.destroy()` y
  verifica que el observable/spy ya no reciba más emisiones.

## Routing y guards

- `RouterTestingModule.withRoutes([])` en `imports` para componentes que inyectan `Router` o
  `ActivatedRoute`.
- Mockea `ActivatedRoute` con `{ paramMap: of(convertToParamMap({ id: '1' })) }` o
  `{ params: of({ id: '1' }) }` según lo que lea el componente.
- Guards de clase: `TestBed.inject(MiGuard)` y llama `guard.canActivate(route, state)` directamente,
  sin pasar por el router real.

## Forms

- `component.form.controls.email.setValue('a@b.com')` y aserciones sobre
  `component.form.valid` / `component.form.controls.email.errors`.

## Pipes puros

- Instáncialos directo, sin TestBed: `new MiPipe().transform(valor)`.

## Consultas al DOM

- Llama `fixture.detectChanges()` después de cambiar estado y antes de leer el DOM.

## Ejemplo completo

Spec del `UserProfileComponent` de [`componentes.md`](componentes.md):

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserProfileComponent } from './user-profile.component';
import { User } from './user.model';

describe('UserProfileComponent', () => {
  let fixture: ComponentFixture<UserProfileComponent>;
  let component: UserProfileComponent;

  const mockUser: User = { name: 'Ana Torres', avatarUrl: '' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('debería mostrar el avatar por defecto cuando la URL viene vacía', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();

    expect(component.avatarSrc).toBe('assets/images/default-avatar.png');
    const img = fixture.debugElement.query(By.css('img'));
    expect(img.nativeElement.src).toContain('default-avatar.png');
  });

  it('debería usar la URL del usuario cuando viene informada', () => {
    fixture.componentRef.setInput('user', { ...mockUser, avatarUrl: 'https://cdn/ana.png' });
    fixture.detectChanges();

    expect(component.avatarSrc).toBe('https://cdn/ana.png');
  });
});
```

Spec de un servicio HTTP:

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería obtener el usuario por id', () => {
    let recibido: User | undefined;
    service.obtenerPorId('1').subscribe((user) => (recibido = user));

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush({ name: 'Ana Torres', avatarUrl: '' });

    expect(recibido?.name).toBe('Ana Torres');
  });
});
```

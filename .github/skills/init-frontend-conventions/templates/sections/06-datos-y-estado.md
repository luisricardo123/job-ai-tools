### Estado (signals)

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureStateService {
  private readonly _state = signal<FeatureState | null>(null);
  readonly state = this._state.asReadonly();
  readonly isLoading = computed(() => this._state()?.loading ?? false);

  setState(newState: FeatureState): void { this._state.set(newState); }
  updateState(partial: Partial<FeatureState>): void {
    this._state.update(current => current ? { ...current, ...partial } : null);
  }
}
```

Sirve para persistir los datos de una vista aunque el componente se destruya — por ejemplo, si el
usuario navega fuera y vuelve dentro de la misma sesión. Con un solo servicio de estado por
feature (el caso más común) va plano, directo en `state/`, sin subcarpeta. Si alguna vez hace
falta más de uno, agrúpalo: cada servicio con su spec
en su propia carpeta.

### Servicios de API (`data-access/api/`)

Un servicio por origen de datos, con su spec al lado. Archivos sueltos en `api/`, sin carpeta por
servicio:

```
data-access/api/
├── example-api.service.ts
└── example-api.service.spec.ts
```

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleApiService {
  private readonly http = inject(HttpClient);

  async getData(): Promise<Data[]> {
    return firstValueFrom(this.http.get<Data[]>(API_ENDPOINTS.example));
  }
}
```

- Expone el modelo del feature — la forma exacta depende del perfil de arquitectura (ver "Perfil de
  arquitectura" y "Arquitectura" arriba). Ningún componente ve `HttpErrorResponse` ni un DTO.
- `providedIn: 'root'`: no hay que registrar nada en `app.config.ts`.
- Para trabajar sin backend, la data simulada vive en `mock-db/` y la sirve el servidor local de
  mocks (skill `{{SKILL_MOCK_SERVE}}`): el environment `local` apunta a ese servidor y el servicio
  se consume igual que contra el backend real.

### Asincronía

`Promise` en la superficie pública, `Signal` para lectura en plantilla. `Observable` solo para
streams reales (`valueChanges`, eventos, EventBus) y siempre con `takeUntilDestroyed()`.
`Promise.all` para llamadas paralelas independientes.

{{ARQ_DATA_ACCESS_SECCION}}

### Constantes

```typescript
// Patrón 1: constante + tipo derivado (PascalCase)
export const CurrencyOptionCode = { ALL: 'ALL', PEN: 'PEN', USD: 'USD' } as const;
export type CurrencyOptionCode = (typeof CurrencyOptionCode)[keyof typeof CurrencyOptionCode];

// Patrón 2: union type literal (para tipos simples)
export type SearchStatusId = 'PENDING_PAYMENTS' | 'CANCELLED';

// Patrón 3: mapeo con validación (satisfies)
export const StatusDescription = {
  MOR: 'Moroso', VCD: 'Vencido', VIG: 'Vigente',
} as const satisfies Record<StatusCode, string>;
```

**Casing**: `PascalCase` cuando existe un tipo derivado con el mismo nombre;
`UPPER_SNAKE_CASE` para configuración plana sin tipo derivado (`ROUTES`, `API_ENDPOINTS`, `CONFIG`).

Archivos separados por preocupación en `shared/constants/`.


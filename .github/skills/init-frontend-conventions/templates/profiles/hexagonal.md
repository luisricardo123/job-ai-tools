<!-- Perfil de arquitectura: Hexagonal, con capa anticorrupción. Es el único perfil — se lee
     siempre, sin preguntar. Cada "## ARQ_X" es una sección que la skill copia tal cual dentro del
     placeholder {{ARQ_X}} del mismo nombre en templates/sections/. No cambiar los nombres de
     encabezado — tienen que coincidir exacto con los de templates/sections/. -->

## ARQ_PERFIL_DESC

Hexagonal, con capa anticorrupción — la traducción del contrato del backend es una capa explícita: tipos DTO que espejan el contrato y funciones puras `mapXToY` con su propio spec.

## ARQ_ESTRUCTURA_FEATURE

```
features/{feature-name}/
├── data-access/
│   ├── api/                  # servicios HTTP del feature (ver Convenciones)
│   ├── dtos/                 # contratos del backend, tal cual
│   └── mapper/               # funciones puras DTO ↔ Modelo
├── models/                   # tipos de dominio del feature
├── page/                     # componente página principal
│   └── components/           # cada componente en su propia carpeta
├── state/                    # [opcional] persiste los datos de la vista aunque se destruya
└── export/                   # [opcional] exportación Excel, PDF, etc.
```

**Dirección de dependencias**: `page → state → api → mapper → dtos`. Nunca al revés.

## ARQ_DATA_ACCESS_SECCION

### Data access, DTOs y mappers

DTOs reflejan el contrato del backend **exactamente**; no se corrigen ahí. Los modelos son lo que
consume la UI. Ningún DTO cruza hacia componentes o plantillas.

```typescript
export const mapFiltersToRequestDto = (filters: SearchFilters): RequestDto => { /* ... */ };
export const mapResponseDtoToRecords = (dto: ResponseDto): Record[] => { /* ... */ };
```

- Patrón de nombre: `mapXToY`. Funciones puras, exportadas como `const` con arrow function.
- **Un solo archivo mapper por feature.** Si supera 200 líneas, dividir por responsabilidad
  (`{feature}-request.mapper.ts`, `{feature}-response.mapper.ts`).

**Cuándo un feature no necesita esta capa.** Este es el default del proyecto, no una obligación
ciega. Si en un feature concreto la traducción se reduce a renombrar un par de campos de un solo
endpoint, los DTOs terminan siendo copias literales de los modelos y el mapper, una función
identidad con otro nombre — puro costo de mantenimiento. En ese caso ese feature puede quedarse
con el perfil Repository: sin `dtos/` ni `mapper/`, y la traducción adentro de la implementación
HTTP como detalle privado. Es la excepción justificada, se documenta en el feature, y no cambia el
perfil del resto del micro-frontend.

## ARQ_NOMENCLATURA_FILAS

| Mapper | `{feature}.mapper.ts` | `mapXToY` |
| DTO | `{name}.dto.ts` | `{Name}Dto` |

## ARQ_CHECKLIST_ITEM

- [ ] Ningún DTO fuera de `data-access/`; mapper con pruebas.

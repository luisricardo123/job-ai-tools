## Arquitectura

Arquitectura basada en **features** (una vista/funcionalidad concreta — recuerda que el propio
micro-frontend ya es una funcionalidad dentro de la banca de empresas, así que normalmente hay
pocos features, no decenas).

```
src/app/
├── app.ts                    # raíz, extends BcpMicroFrontendComponent
├── app.config.ts
├── app.routes.ts
├── core/                     # guards, interceptors, componentes core
├── features/                 # ver estructura de feature
├── layout/
└── shared/                   # components, constants, models, services, utils, validators
```

### Estructura de cada feature (EXACTA)

{{ARQ_ESTRUCTURA_FEATURE}}

`shared/` y `core/` no importan de `features/`. Un feature no importa de otro feature.

`shared/` se organiza por tipo (`components/`, `services/`, etc.), a propósito — es la excepción a
"estructura por feature": no tiene features propios que agrupar, así que agrupar por tipo es lo que
mantiene navegable el contenido transversal. La regla de organizar por feature aplica dentro de
`features/`.

---


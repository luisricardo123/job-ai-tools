### Routing

Lazy loading con `loadComponent` (requiere `export default` en la página). Rutas centralizadas en
`shared/constants/routes.constants.ts`. El componente `Empty` maneja `path: '**'`. Configuración
con `provideBcpMicroFrontendRouter(routes)`.

**Estructura obligatoria de `app.routes.ts`.** Como esto es un micro-frontend montado dentro de la
shell, todas las rutas propias cuelgan de `{{RUTA_BASE}}` (el campo `path` de
`micro-frontend-metadata.json`). No es opcional ni cosmético: si las rutas se declaran planas en la
raíz, la shell no las resuelve. La forma es exactamente esta:

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: '{{RUTA_BASE}}',
    pathMatch: 'full',
  },
  {
    path: '{{RUTA_BASE}}',
    component: Layout, // solo si el micro-frontend tiene layout propio
    children: [
      {
        path: '',
        loadComponent: () => import('./features/.../page/inicial.page'),
      },
      // Las demás pantallas van aquí dentro, como hermanas de la inicial:
      {
        path: 'detalle/:id',
        loadComponent: () => import('./features/.../page/detalle.page'),
      },
      {
        path: 'pago/:id',
        loadComponent: () => import('./features/.../page/pago.page'),
      },
    ],
  },
  // aquí las rutas por defecto del scaffold (Empty para '**', etc.)
];
```

Reglas que se derivan de eso:

- El `redirectTo` de la ruta vacía y el `path` del bloque padre usan **el mismo valor**:
  `{{RUTA_BASE}}`. Si cambia en `micro-frontend-metadata.json`, cambian los dos.
- La pantalla inicial es el hijo con `path: ''`, no una ruta aparte.
- Toda pantalla nueva se agrega como un hijo más dentro de `children`, con path relativo (`'detalle/:id'`,
  no `'{{RUTA_BASE}}/detalle/:id'`).
- Las rutas por defecto que trae el scaffold se dejan al final, después del bloque padre.

### Nomenclatura

**Código en inglés, lenguaje natural en español.** Archivos, carpetas, variables, métodos, clases,
interfaces y tipos en inglés. Comentarios, documentación, mensajes de error, textos y logs en español.

**Nota**: los nombres de archivo llevan sufijo de tipo (`.component.ts`, `.service.ts`, etc.)
a propósito — diverge del schematic sin sufijo que usa Angular {{ANGULAR_VERSION}}+ por defecto.
No lo "corrijas" hacia el estilo sin sufijo: aquí se prioriza poder filtrar por tipo
(`**/*.service.ts`, `eslint-plugin-check-file`) en un monorepo con varios equipos.

| Rol | Archivo | Símbolo |
|---|---|---|
| Componente | `{name}.component.ts` | `{Name}Component`, selector `app-{name}` |
| Página | `{name}.page.ts` | `export default class {Name}Page` |
| Servicio API | `{name}-api.service.ts` | `{Name}ApiService` |
| Estado | `{name}.state.service.ts` | `{Name}StateService` |
{{ARQ_NOMENCLATURA_FILAS}}
| Modelo | `{name}.model.ts` | `{Name}` (sin prefijo `I`) |
| Tipos (compartidos o de un componente) | `{name}.types.ts` | `{Name}Type` |
| Constantes | `{name}.constants.ts` | |
| Guard / Interceptor | `{name}.guard.ts` / `{name}.interceptor.ts` | |
| Pruebas | `{name}.spec.ts` | espejo del archivo probado |

---


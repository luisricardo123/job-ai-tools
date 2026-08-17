## Configuración del micro-frontend

- `micro-frontend.config.json` → `name`, `share` (dependencias compartidas con el host)
- `micro-frontend-metadata.json` → `remoteName`, `elementName`, `path`, `remoteEntry`
- `bootstrap.ts` → `bcpCreateMicroFrontend({ appConfig, bootstrapComponent: App, elementName })`
- Ambientes: `local`, `development`, `cert`, `production` en `src/environments/`
- Builder: `@bcp/ng-builder`

---


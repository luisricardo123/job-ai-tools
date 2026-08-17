# Angular 16 — Arquitectura

Proyecto típico basado en **NgModules**. Los signals están disponibles y se usan con frecuencia; conviven con RxJS sin reemplazarlo (detalle en [`reactividad.md`](reactividad.md)).

- Organiza por feature modules (`FeatureModule` con su propio routing module si aplica lazy loading).
- Los standalone components son opcionales en v16: solo úsalos si el proyecto ya los adoptó explícitamente; por defecto, sigue el patrón de módulos existente en el repo para no mezclar estilos.

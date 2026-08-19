## Manejo de errores

- Los errores HTTP se traducen a un error de dominio tipado **en el servicio de API**.
  Ningún componente ve `HttpErrorResponse`.
- Prohibido `catch` vacío o que solo loguea.

## Estados visuales

Toda pantalla con datos contempla: `idle | loading | success | empty | error`.
Un solo campo `status`, no banderas sueltas (`isLoading` + `hasError`).
Formularios, tablas y botones derivan su estado con `computed()`, no con flags manuales.

## Seguridad

- Sin secretos en `environments/`; entran por configuración de despliegue.

---


## Problemas comunes

<!-- ACUMULATIVO: agrega aquí cada error real que el agente cometa y hayas corregido -->

{{PROBLEMAS_CONOCIDOS}}

---

## Checklist de salida

- [ ] Cargué las skills que aplicaban a esta tarea.
- [ ] Ninguna prohibición dura violada.
- [ ] Toda propiedad no reasignada es `readonly`; DI con `inject()`.
- [ ] Componentes con OnPush, orden interno respetado, páginas con `export default`, cada
      componente en su propia carpeta.
- [ ] Servicios nuevos de `data-access/api/`: una clase con `providedIn: 'root'` y su spec.
- [ ] API pública devuelve `Promise` o `Signal`.
- [ ] Cada vista nueva es su propio feature; ningún feature quedó con dos `.page.ts`.
{{ARQ_CHECKLIST_ITEM}}
- [ ] La pantalla cubre `idle / loading / success / empty / error`.
- [ ] Reporta explícitamente cualquier regla que no pudiste cumplir y por qué.

---

## Decisiones pendientes

Mientras algo esté aquí, **pregunta** en lugar de asumir.

{{DECISIONES_PENDIENTES}}

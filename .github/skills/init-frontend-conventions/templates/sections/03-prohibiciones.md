## Prohibiciones duras

Aplican siempre, aunque la skill correspondiente no se haya cargado.

- ❌ `enum` y `const enum` → objeto `as const` + tipo derivado
- ❌ `any` → usa `unknown` cuando el tipo sea incierto
- ❌ Métodos y funciones sin tipo de retorno explícito → siempre `metodo(): Tipo {}`, nunca `metodo() {}` (tipo inferido)
- ❌ `.toPromise()` → `firstValueFrom`
- ❌ `subscribe()` sin `takeUntilDestroyed()`

---


# Template para una especificación útil

Este archivo es la referencia que la skill `/spec` consulta al generar especificaciones. Cada sección incluye su propósito y un ejemplo mínimo. **No es texto para copiar literalmente** — es la forma que la skill debe respetar.

---

## Encabezado

Toda especificación empieza con metadata en formato de blockquote (sin tablas, sin bloques, simple como se muestra abajo):

```markdown
# SPEC NN — Título corto y descriptivo

> **Status:** Draft
> **Depends on:** SPEC 01, SPEC 02
> **Date:** YYYY-MM-DD
> **Objective:** Una sola oración. Si necesitas dos oraciones, la funcionalidad es demasiado grande.
```

**Estados válidos:** `Draft`, `In review`, `Approved`, `Implemented`, `Obsolete`.

> Las etiquetas de arriba son los valores por defecto en inglés. Las skills también aceptan equivalentes en cualquier idioma (por ejemplo, en español `Borrador` / `En revisión` / `Aprobado` / `Implementado` / `Obsoleto`). Elige un conjunto por repositorio y mantén la consistencia.

**Regla del objetivo:** una oración que un humano lea en 5 segundos y entienda qué se va a construir. Si no cabe en una oración, divide la funcionalidad.

---

## Sección 1 — Por qué existe esta especificación (opcional)

Para especificaciones que toman decisiones no obvias o rompen patrones del proyecto, una sección breve que explique el **por qué** del trabajo. No el qué — el qué viene después.

Para especificaciones simples, omítela.

---

## Sección 2 — Alcance

Dos sub-bloques explícitos. **Ambos son obligatorios.**

```markdown
## Alcance

**Incluye:**

- Cosa concreta uno.
- Cosa concreta dos.

**Fuera de alcance (para futuras especificaciones):**

- Algo que podría hacerse, pero no ahora.
- Algo que surgió en la conversación, pero no está incluido.
```

**Por qué importa el "fuera":** captura las cosas que el usuario mencionó durante la fase de preguntas pero que se decidió diferir. Sin ese registro, durante la implementación existirá la tentación de meterlas "ya que estamos en eso".

---

## Sección 3 — Modelo de datos

Las estructuras concretas que aparecen o cambian. Usa código real, no pseudocódigo abstracto.

```markdown
## Modelo de datos

\`\`\`js
// Estado del juego
const state = {
level: 1,
score: 0,
highScores: [/* { score, level, date } */],
};
\`\`\`

Convenciones:

- Coordenadas: origen arriba a la izquierda.
- Velocidades en píxeles/frame.
```

Si la funcionalidad no introduce nuevos datos, escríbelo explícitamente: *"Esta funcionalidad no introduce nuevas estructuras de datos. Reutiliza el modelo de SPEC 01."*

---

## Sección 4 — Plan de implementación

Pasos numerados. Cada paso debe dejar el sistema en un estado **funcional y ejecutable**. Nada de "implementar la mitad y continuar mañana".

```markdown
## Plan de implementación

1. Crear el archivo X con un esqueleto vacío.
2. Implementar la función A en X. Prueba manual: ejecutar Y, ver Z.
3. Conectar X al módulo existente W.
4. ...
```

**Reglas:**

* Cada paso debe poder commitearse por separado.
* Si un paso requiere más de 30–50 líneas de código, divídelo.
* El último paso del plan **no** es "probar todo" — eso corresponde a los criterios de aceptación.

---

## Sección 5 — Criterios de aceptación

Checklist booleano. Cada ítem puede verificarse con sí o no.

```markdown
## Criterios de aceptación

- [ ] El juego carga sin errores en la consola.
- [ ] Romper un ladrillo agrega exactamente 10 puntos.
- [ ] Recargar la página conserva los high-scores.
```

**Antipatrones a evitar:**

* ❌ "Que funcione bien." → no es verificable.
* ❌ "Buena UX." → subjetivo.
* ❌ "Sin bugs." → no es operacional.
* ✅ "Presionar Esc pausa el juego y muestra el menú." → verificable, booleano.

---

## Sección 6 — Decisiones tomadas y descartadas

La sección que tiene más valor dentro de 3 meses. Captura **lo que consideraste**, no solo lo que elegiste.

```markdown
## Decisiones

- **Sí:** localStorage para persistencia. Cabe en <5MB y no necesitamos consultas.
- **No:** IndexedDB. Es overengineering para este caso.
- **Sí:** clave versionada (`save:v1`). Nos permite migrar el esquema después sin romper.
- **No:** sincronización en la nube. Va en otra especificación si alguna vez llega.
```

Cada decisión idealmente tiene una razón breve. Las decisiones sin razón son las primeras que se cuestionan después.

---

## Sección 7 — Riesgos identificados (opcional)

Solo cuando hay riesgos no obvios. Tabla simple:

```markdown
## Riesgos

| Riesgo                                      | Mitigación                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------- |
| localStorage deshabilitado en modo privado  | Fallback a objeto en memoria. El juego sigue funcionando, solo no persiste.     |
| Esquema incompatible en el futuro           | La clave incluye `:v1`. La migración está documentada en `persistence.js`.       |
```

Para especificaciones pequeñas o muy contenidas, omítela.

---

## Sección final — Qué NO está incluido

Repite explícitamente al final lo que **no** se hará en esta especificación. Esta repetición es deliberada — la sección de Alcance ya lo dice, pero al final del documento sirve como recordatorio cuando alguien lee solo las últimas líneas.

```markdown
## Qué **no** está incluido en esta especificación

- Editor visual (otra especificación si alguna vez llega).
- Multiplayer.
- Versión móvil.

Cada una de esas cosas, si llega, va en su propia especificación.
```

---

## Reglas globales sobre todo el documento

* **Una oración por idea.** Si una oración tiene dos comas y un punto y coma, divídela.
* **Nombres concretos.** Si dices "el módulo de niveles", di `src/levels.js`. Si dices "una clave", da el string exacto.
* **Sin TODOs.** Un TODO en una especificación significa que la decisión no se tomó. Tómala o anótala como una decisión pendiente con una razón.
* **Sin código ejecutable largo.** La especificación describe; el código se escribe después. Snippets cortos para ilustrar estructuras de datos están bien; funciones completas no.
* **Markdown estándar.** Nada de extensiones raras. Debe renderizar en GitHub sin sorpresas.

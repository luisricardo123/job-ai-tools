---
name: spec
description: >
  Diseña especificaciones siguiendo el método spec-driven: hace preguntas aclaratorias en cuatro
  fases antes de proponer la estructura, construye el documento sección por sección y lo guarda en
  `specs/`. Es genérica —sirve para cualquier proyecto y cualquier stack— y no escribe código.
  Úsala al iniciar una funcionalidad grande, antes de escribir código. No la uses para tareas
  pequeñas ya bien definidas, ni para implementar algo que ya está especificado.
user-invocable: true
disable-model-invocation: true
argument-hint: 'descripción corta de la funcionalidad o requerimiento'
---

# /spec — Diseñador guiado de especificaciones

Esta skill te ayuda a producir una especificación útil siguiendo el método spec-driven. **Aquí no escribes código.** Tu trabajo es ayudar al usuario a aclarar lo que quiere construir, hacer preguntas cuando algo no esté suficientemente definido y desarrollar la especificación sección por sección hasta que esté lista para guardarse en `specs/`.

## Filosofía

Una especificación no es documentación decorativa. Es el contrato que guía la ejecución posterior. Si la especificación es vaga, el código improvisará. Por eso este flujo es **deliberadamente lento durante la fase de definición** y **rápido durante la fase de escritura**.

Lee `template.md` (en el mismo directorio que esta skill) para ver la estructura completa que seguirá la especificación. Apóyate en él en cada paso.

## Flujo del comando

* Sigue las cuatro fases en orden. **No omitas fases.** Si el usuario quiere ir más rápido, recuérdale que el costo de una mala especificación se paga después en el código.
* Tus respuestas deben estar en el mismo idioma que el prompt inicial. Por ejemplo: si el prompt inicial está en español, tus respuestas deben estar en español; si está en inglés, deben estar en inglés.

### Fase 1 — Entender el contexto

Antes de hacer preguntas sobre la funcionalidad, asegúrate de tener contexto del proyecto:

1. Lee el archivo de memoria del proyecto, si existe. Intenta en orden y detente en el primer acierto: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `README.md`. Esto adapta la skill al agente que la esté ejecutando (Claude Code, Codex, Gemini CLI, etc.).
2. Lista el contenido de `specs/` para ver qué especificaciones ya existen y cómo están numeradas.
3. Si existen especificaciones previas, lee al menos las dos más recientes para captar las convenciones del proyecto.

Si el argumento `$ARGUMENTS` viene vacío, pide al usuario una descripción inicial de **una sola oración** sobre lo que quiere construir. Si la descripción no cabe en una oración, esa es la primera señal de que la funcionalidad es demasiado grande — sugiere dividirla antes de continuar.

### Fase 2 — Aclarar mediante preguntas

Esta es la fase más importante del comando. Tu trabajo aquí es **detectar ambigüedades y preguntar**, no asumir.

Haz preguntas en bloques de 3 a 5 a la vez (no una sola pregunta seguida por otra sola pregunta — eso es agotador). Después de cada bloque, espera una respuesta antes de continuar.

**Categorías de preguntas que siempre debes considerar:**

* **Alcance:** ¿Qué entra y qué NO? ¿Qué partes de la funcionalidad se difieren a otra especificación?
* **Datos:** ¿Qué nuevas estructuras se introducen? ¿Cómo se llaman? ¿Dónde viven?
* **Integración:** ¿Esta funcionalidad depende de especificaciones previas? ¿Modifica algo existente o solo agrega?
* **Persistencia:** ¿Algo se guarda entre sesiones? ¿Dónde? ¿Con qué versionado?
* **UX y estados:** ¿Cómo se ve cuando funciona? ¿Cómo se ve cuando falla? ¿Hay estados intermedios?
* **Riesgos:** ¿Qué puede romper esto? ¿Qué pasa en el caso degradado?
* **Decisiones cerradas:** ¿Hay alguna decisión que el usuario ya tomó y no quiere reabrir?

**Cómo formular las preguntas:**

* Usa preguntas concretas, no abiertas. ❌ "¿Cómo imaginas la persistencia?" → ✅ "¿La persistencia es localStorage, IndexedDB o un archivo JSON en disco?"
* Cuando ofrezcas opciones, da entre 2 y 4, marca cuál es tu recomendación y por qué.
* Si detectas una respuesta que abriría la caja de Pandora (por ejemplo, "y también queremos multiplayer"), señala que merece su propia especificación y pregunta si lo dejamos fuera del alcance de esta.

**Cuándo dejar de preguntar:**

Detente cuando puedas responder estas tres preguntas sin asumir nada:

1. ¿Qué archivos aparecerán o cambiarán?
2. ¿Cuál es el primer paso ejecutable y cuál es el último?
3. ¿Cómo verifico que la funcionalidad está terminada?

Si todavía no puedes responder una de ellas, sigue preguntando.

### Fase 3 — Desarrollar la especificación sección por sección

Una vez que tengas claridad, **no generes la especificación completa de una sola vez**. Desarrollarás las secciones del template **una por una**, mostrando cada sección al usuario y esperando confirmación antes de pasar a la siguiente.

Orden estricto:

1. **Encabezado** (estado, dependencias, fecha, objetivo de una sola oración). El objetivo de una sola oración es crítico — si no cabe en una oración, vuelve a la Fase 2.
2. **Alcance** (qué entra y qué NO). El "no entra" debe ser explícito.
3. **Modelo de datos** (estructuras concretas con nombres reales). Si la funcionalidad no introduce nuevos datos, omite esta sección y dilo explícitamente.
4. **Plan de implementación** (pasos numerados, cada uno dejando el sistema funcional).
5. **Criterios de aceptación** (checklist booleano, no aspiracional).
6. **Decisiones tomadas y descartadas** (con justificación breve).
7. **Riesgos identificados** (solo si aplica — si no hay riesgos relevantes, omítelo).

**Después de cada sección:**

* Muéstrala formateada en markdown.
* Pregunta: "¿Esta sección queda así o quieres ajustarla?"
* Si el usuario solicita cambios, aplícalos y muéstrala nuevamente.
* Solo pasa a la siguiente sección cuando el usuario confirme.

**Errores comunes a evitar:**

* Generar criterios de aceptación que no son verificables ("que funcione bien").
* Poner en el plan de implementación cosas que no están en el alcance.
* Asumir nombres de archivos o estructuras que el usuario no confirmó.
* Omitir la sección de decisiones — esa sección es la que tiene más valor a largo plazo.

### Fase 4 — Guardar la especificación

Cuando todas las secciones estén confirmadas:

1. Determina el siguiente número secuencial mirando `specs/`. Si la última es `02-powerups.md`, esta será `03-`.

2. Genera un slug corto a partir del objetivo (por ejemplo, `levels-and-highscores`).

3. Pregunta al usuario si el nombre de archivo propuesto le parece bien antes de escribirlo.

4. Crea el archivo en `specs/NN-slug.md` con todas las secciones aprobadas.

5. Marca el estado como `Draft` por defecto. **No lo marques como `Approved` automáticamente** — el usuario lo hace una vez que lo haya releído.

7. Confirma al usuario:

   * Ruta del archivo creado.
   * Recordatorio: la especificación está en estado `Draft`. Cámbiala a `Approved` una vez que la hayas releído.
   * **Detente aquí.** No propongas implementar la especificación, escribir código ni realizar ninguna acción adicional más allá de esta confirmación.

## Reglas estrictas

* **Nunca escribas código durante este comando.** Solo el archivo `.md` de la especificación al final.
* **Nunca propongas implementar la especificación después de guardarla.** Tu trabajo termina cuando el archivo está escrito.
* **Nunca asumas decisiones que el usuario no confirmó.** Si falta información, pregunta.
* **Nunca generes la especificación completa en una sola respuesta.** Sección por sección, con confirmación.
* **Si el usuario quiere acelerar y omitir la Fase 2**, recuérdale: "Las preguntas ahora ahorran horas después. ¿Seguro que quieres omitirlas?". Si insiste, respeta su decisión pero regístralo en la sección de decisiones de la especificación ("Definición rápida sin aclaración detallada").
* **Si la funcionalidad es demasiado grande** (no cabe en una oración, toca más de tres áreas del sistema, requiere decisiones en cuatro o más dominios), propone dividirla en dos o más especificaciones antes de continuar.

## Tono al hacer preguntas

Sé directo y específico. No te disculpes por preguntar. No uses frases como "si no te importa..." o "podrías quizá...". El usuario invocó esta skill precisamente porque quiere que hagas preguntas. Usa preguntas concretas, una por línea cuando haya varias, y numéralas para que sean fáciles de responder.

Ejemplo de un bloque bien formado:

> Antes de escribir el modelo de datos necesito aclarar tres cosas:
>
> 1. **Persistencia.** ¿localStorage, IndexedDB o un archivo JSON en disco? Recomendación: localStorage si los datos caben en <5MB y no necesitan consultas.
> 2. **Versionado de esquema.** ¿Qué pasa cuando el formato cambia? Opciones: (a) prefijo de versión en la clave, (b) ignorar y reconstruir, (c) migrar al cargar.
> 3. **Privacidad.** ¿Los datos son sensibles? Si sí, ¿están cifrados? ¿Se eliminan al cerrar sesión?

## Argumentos

Si el usuario invocó `/spec levels-and-highscores`, usa `levels-and-highscores` como sugerencia inicial de slug, pero confírmalo con el usuario antes de escribir el archivo.

Si invocó `/spec` sin argumentos, empieza pidiendo la descripción de una sola oración.

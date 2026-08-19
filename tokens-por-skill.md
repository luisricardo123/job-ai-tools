# Consumo de tokens por skill

Medición del contenido en markdown de cada skill de `.github/skills/`, para estimar cuánto
contexto consume cada una cuando se usa (por ejemplo, desde GitHub Copilot Chat en VSCode).

## Metodología

- Conteo real de tokens con el tokenizer `cl100k_base` (`js-tiktoken`), el mismo que usan los
  modelos GPT-4/4o/4.1 — el motor por defecto de Copilot. Si en Copilot se selecciona un modelo
  Claude, el conteo real puede variar ±5-10 % respecto a estos números, pero sirve como referencia
  fiel.
- **SKILL.md (base)**: tokens del enrutador de la skill, que se cargan siempre que la skill se
  activa.
- **+ references (peor caso)**: tokens adicionales de todo lo que hay en `references/` (y
  `templates/` en `init-frontend-conventions`). En uso real casi nunca se cargan todos los archivos
  de referencia a la vez — solo los que la tarea concreta necesita — así que el consumo del día a
  día suele estar más cerca de la columna base que del total.
- Fecha de medición: 2026-08-19.

## Tabla de resultados

| Skill | SKILL.md (base, siempre) | + references (peor caso) | TOTAL máximo |
|---|---:|---:|---:|
| frontend-id-standard | 10.829 | 4.595 | **15.424** |
| spec-prototype | 5.554 | 9.607 | **15.161** |
| process-openapi | 2.736 | 5.870 | **8.606** |
| bcp-design-system | 1.803 | 6.628 | **8.431** |
| init-frontend-conventions | 2.823 | 5.336 | **8.159** |
| angular-best-practices | 1.771 | 5.967 | **7.738** |
| evaluar-agente-fem | 1.931 | 3.711 | **5.642** |
| spec | 2.488 | 1.692 | **4.180** |
| mock-serve | 2.662 | 0 | **2.662** |
| **TOTAL repo (las 9 skills)** | **32.597** | **43.406** | **76.003** |

## Lectura rápida

- `frontend-id-standard` es la más pesada como router puro: ~10,8k tokens solo con `SKILL.md`, sin
  abrir nada más.
- `spec-prototype` es la que más puede crecer si carga todo su detalle: hasta ~15,2k tokens.
- `mock-serve` no tiene `references/`, así que su costo es fijo: siempre ~2,7k tokens.
- Si se cargara absolutamente todo el contenido de las 9 skills a la vez, el total sería 76.003
  tokens.

---
name: init-frontend-conventions
description: Genera el archivo AGENTS.md de convenciones para un micro-frontend Angular nuevo del BCP, combinando una plantilla base con el perfil de arquitectura Hexagonal (con capa anticorrupción), fijo para todos los proyectos, más una breve entrevista. Úsala una sola vez, justo después del scaffolding con FEM y antes de pedir la primera generación de código en el repo.
user-invocable: true
disable-model-invocation: true
---

# Generar AGENTS.md para un micro-frontend nuevo

Esta skill genera el `AGENTS.md` de la raíz del repo combinando **dos fuentes**:

- [`templates/sections/`](./templates/sections/) — todo lo que es igual siempre (componentes,
  estado, nombres, prohibiciones, checklist, etc.), partido en 10 archivos numerados por grupo de
  convenciones. Concatenados en orden numérico forman exactamente lo que antes era
  `base.template.md`; se separaron solo para que cada grupo sea más fácil de ubicar y mantener —
  no cambia nada de lo que termina en el `AGENTS.md` generado. Entre ellos hay 5 placeholders
  `{{ARQ_*}}` donde va lo que depende de la arquitectura.
- [`templates/profiles/hexagonal.md`](./templates/profiles/hexagonal.md) — el único perfil de
  arquitectura. Se lee siempre, sin preguntar: no hay elección que hacer.

`templates/profiles/` sigue existiendo como carpeta aparte (en vez de meter el perfil directo en
`templates/sections/`) por si algún día se agrega un segundo perfil de arquitectura — tendría dónde
vivir sin reorganizar nada más.

### Los archivos de `templates/sections/`, en orden

| Archivo | Grupo de convenciones |
|---|---|
| `01-proyecto.md` | Instrucciones, descripción del proyecto, comandos, stack |
| `02-skills.md` | Skills y agentes que se pueden usar |
| `03-prohibiciones.md` | Prohibiciones duras |
| `04-arquitectura.md` | Arquitectura de carpetas, estructura de feature (`{{ARQ_ESTRUCTURA_FEATURE}}`) |
| `05-ui.md` | Componentes, formularios |
| `06-datos-y-estado.md` | Estado (signals), servicios de API, asincronía (`{{ARQ_DATA_ACCESS_SECCION}}`), constantes |
| `07-routing-nomenclatura.md` | Routing, nomenclatura (`{{ARQ_NOMENCLATURA_FILAS}}`) |
| `08-errores-estados-seguridad.md` | Manejo de errores, estados visuales, seguridad |
| `09-configuracion.md` | Configuración del micro-frontend |
| `10-cierre.md` | Problemas comunes, checklist de salida (`{{ARQ_CHECKLIST_ITEM}}`), decisiones pendientes |

Si algún día se edita una convención, se edita en su archivo de grupo — nunca hace falta tocar más
de uno para un cambio puntual.

Las convenciones de código y las prohibiciones duras son fijas. No inventes alternativas a lo que
ya traen (otro naming, otro patrón de servicios, otro perfil de arquitectura, etc.).

## El perfil de arquitectura: Hexagonal, siempre

Todo micro-frontend del BCP usa **Hexagonal con capa anticorrupción**: la traducción del contrato
del backend vive en una capa explícita — tipos DTO que espejan el contrato + funciones puras
`mapXToY` con su propio spec — en vez de vivir escondida dentro de la implementación HTTP.

No se pregunta ni se evalúa por proyecto. La mayoría de los backends que consume un
micro-frontend de banca empresarial son compartidos o legacy y el equipo del frontend no los
controla — justo el caso donde la capa anticorrupción paga: un cambio del backend se absorbe en
un archivo en vez de perseguirse por todos los componentes que lo consumían directo. Tratarlo
como el default parejo, en lugar de decidirlo pantalla por pantalla, mantiene la estructura
predecible entre repos y evita que cada proyecto reabra la misma discusión.

### La capa no es obligatoria feature por feature

El perfil del proyecto es Hexagonal, pero eso no obliga a crear DTOs y mapper cuando la
traducción de un feature concreto es trivial (un endpoint, cuatro campos renombrados, un monto
formateado). `hexagonal.md` documenta esa válvula de escape ("Cuándo un feature no necesita esta
capa"): ese feature puede saltarse `dtos/` y `mapper/` y traducir adentro del http service, como
excepción puntual y documentada — sin que eso cambie el perfil del resto del proyecto.

## Los 5 placeholders de arquitectura

Entre todos los archivos de `templates/sections/` aparecen exactamente estos 5 placeholders (ver
tabla de arriba para en cuál vive cada uno). `hexagonal.md` tiene una sección `## ARQ_X` por cada
uno de ellos:

| Placeholder | Qué contiene |
|---|---|
| `{{ARQ_PERFIL_DESC}}` | La frase que describe el perfil, dentro de "Descripción del proyecto". |
| `{{ARQ_ESTRUCTURA_FEATURE}}` | El árbol de carpetas de la feature completo, con su explicación y la dirección de dependencias. |
| `{{ARQ_DATA_ACCESS_SECCION}}` | La sección de data access: la capa de DTOs y mappers, dónde vive la traducción del contrato. |
| `{{ARQ_NOMENCLATURA_FILAS}}` | Filas extra de la tabla de nombres — Mapper, DTO. |
| `{{ARQ_CHECKLIST_ITEM}}` | Ítem extra del checklist de salida (DTOs/mapper con pruebas). |

## Configuración fija del banco

Estos valores son los mismos para todos los micro-frontends del ecosistema y **no se preguntan en
la entrevista**.

| Placeholder | Valor |
|---|---|
| `{{FEDERATION}}` | Native Federation |
| `{{SKILL_SPEC}}` | `spec` |
| `{{SKILL_IDS}}` | `frontend-id-standard` |
| `{{SKILL_TESTING}}` | `fem-web-angular-unit-testing` |
| `{{SKILL_ANGULAR}}` | `angular-best-practices` |
| `{{SKILL_OPENAPI}}` | `process-openapi` |
| `{{SKILL_MOCK_SERVE}}` | `mock-serve` |
| `{{SKILL_DESIGN_SYSTEM}}` | `bcp-design-system` |
| `{{AGENTE_DESIGN_TO_CODE}}` | `fem-web.design-to-code` |

Ninguno de estos valores está pendiente: todos tienen su nombre real, incluido el del agente de
diseño. **No preguntes ninguno en la entrevista** — si alguno quedara desactualizado, se corrige en
esta tabla, no proyecto a proyecto.

## Procedimiento

1. **Verifica que no exista ya un `AGENTS.md`** en la raíz del repo. Si existe, 
  pregúntale al usuario si quiere sobrescribirlo, fusionarlo a mano, o cancelar la ejecución. Nunca sobrescribas sin
  confirmación explícita del usuario.

2. **Abre `templates/profiles/hexagonal.md`.** Es el único perfil; no hay nada que preguntarle al
   usuario sobre arquitectura en este paso.

3. **Detecta lo que puedas del propio scaffold**, en vez de preguntarlo:
   - `package.json` → versión instalada de `@angular/core` (`{{ANGULAR_VERSION}}`), de
     `typescript` (`{{TS_VERSION}}`), de `rxjs` (`{{RXJS_VERSION}}`).
   - `micro-frontend.config.json` → campo `name` como candidato a `{{MF_NOMBRE}}`.
   - `micro-frontend-metadata.json` → `elementName` → `{{ELEMENT_NAME}}`; `path` →
     `{{RUTA_BASE}}`.
   - Si alguno de estos archivos no existe, o el campo no está, pásalo a la entrevista del
     paso 4 — no asumas un valor.

4. **Pregunta solo lo que no se pudo detectar.** Esto es corto a propósito — son dos cosas:
   - **Dominio funcional** (`{{DOMINIO}}`): una frase — qué hace este micro-frontend, para quién.
     No es inferible del scaffold.
   - Confirma con el dev los valores detectados en el paso 3 antes de continuar; no los des por
     buenos en silencio, muéstraselos.

   No preguntes nada más. En particular: **no preguntes por scripts de `npm` adicionales** — el
   bloque de comandos documenta los seis estándar y punto; si el proyecto tiene otros, el dev los
   agrega a mano después. Tampoco preguntes por las skills ni por la cobertura: salen de la tabla
   de configuración fija.

5. **Genera el archivo:**
   - Toma los 10 archivos de `templates/sections/` **en orden numérico** (`01-proyecto.md` →
     `10-cierre.md`) y concaténalos tal cual, uno tras otro, sin agregar ni quitar líneas en blanco
     entre ellos — ya vienen con la separación correcta. El resultado de esa concatenación es el
     documento base sobre el que se aplican los siguientes reemplazos.
   - Por cada `{{ARQ_X}}` que aparezca en ese documento, busca la sección `## ARQ_X` en
     `hexagonal.md` (el texto entre ese encabezado y el siguiente `## ` o el final del archivo) y
     pégalo tal cual en el lugar del placeholder. Cada `{{ARQ_X}}` ocupa su propia línea completa
     — reemplaza esa línea por el contenido de la sección.
   - No reordenes secciones ni cambies redacción de ninguno de los archivos fuera de esto.
   - Reemplaza los `{{PLACEHOLDERS}}` restantes con los valores de los pasos 3 y 4.
   - `{{PROBLEMAS_CONOCIDOS}}` y `{{DECISIONES_PENDIENTES}}` quedan **vacíos**: borra el
     placeholder pero conserva el comentario HTML que describe qué va ahí. Se llenan con el
     tiempo, a mano, con casos reales — no los inventes ni los prellenes.
   - Borra las dos primeras líneas de comentario HTML de `01-proyecto.md` (las que empiezan con
     `<!-- HUECO:` y `<!-- ARQ:`): son instrucciones para quien mantiene la plantilla, no para el
     agente que lea el `AGENTS.md`. El comentario `<!-- ACUMULATIVO:` de "Problemas comunes` sí se
     queda.
   - Verifica al final que no haya quedado ningún `{{` suelto ni ningún encabezado `## ARQ_` en
     el archivo generado.

6. **Escribe el resultado** en `AGENTS.md`, en la raíz del repo (mismo nivel que `package.json`).

7. **Muestra un resumen breve** al dev: qué valores se detectaron automáticamente y cuáles se
   preguntaron.

## Qué NO hacer

- No inventes un segundo perfil de arquitectura ni ofrezcas elegir entre variantes.
- No agregues secciones nuevas al `AGENTS.md` generado más allá de lo que ya traen los dos
  archivos.
- No dejes placeholders `{{ARQ_*}}` ni encabezados `## ARQ_*` sin resolver en el archivo final.
- No completes `{{PROBLEMAS_CONOCIDOS}}` ni `{{DECISIONES_PENDIENTES}}` con suposiciones.
- No sobrescribas un `AGENTS.md` existente sin confirmación explícita.

## Skills que se pueden usar

Intenta usar las skills y agentes que se indican en la tabla, pero si no están disponibles, avisa al usuario y propón una alternativa.

Cuando una regla de este `AGENTS.md` choque con lo que diga una skill, **gana este archivo**: las
skills traen el estándar general de Angular, este archivo trae las decisiones de este proyecto.

| Skill | Para qué sirve | Cárgala cuando |
|---|---|---|
| `{{SKILL_SPEC}}` | Convierte un pedido en una especificación cerrada antes de escribir código. | Quieras una planificación completa y detallada de la tarea. |
| `{{SKILL_IDS}}` | Aplica el estándar de IDs y accesibilidad del banco a los elementos. | Generes markup con elementos interactivos. |
| `{{SKILL_ANGULAR}}` | Aplica las prácticas de Angular {{ANGULAR_VERSION}} (signals, control flow, DI moderna). | Escribas cualquier código Angular. |
| `{{SKILL_TESTING}}` | Escribe las pruebas unitarias con la configuración del banco. | Crees una pantalla o servicio nuevo — sin specs no está terminado. |
| `{{SKILL_MOCK_SERVE}}` | Levanta el backend local ficticio y arma los JSON de mocks. | Necesites datos simulados: el backend todavía no existe, o quieres reproducir un escenario de error concreto. |
| `{{SKILL_OPENAPI}}` | Traduce un contrato `openapi.yaml` a los tipos del proyecto. | Recibas un contrato del backend, antes de crear `dtos/`/`models/`. |
| `{{SKILL_DESIGN_SYSTEM}}` | Fuente del lenguaje visual de BCP: convenciones de layout, anatomía de página y variantes de componente con su criterio de uso. | Necesites saber cómo debe verse o comportarse visualmente una pantalla, o qué variante de un componente corresponde a un caso concreto. |

| Agente | Para qué sirve | Cárgala cuando |
|---|---|---|
| `{{AGENTE_DESIGN_TO_CODE}}` | Genera interfaces UI con las librerías del banco. | Partes de un diseño de Figma o de una descripción de la UI que quieras implementar. |

---


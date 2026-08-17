# Catálogo oficial de tipos de control

Esta es la lista **cerrada y completa** de abreviaturas permitidas para el segundo bloque del ID
(`tipo_control`). No es un punto de partida ni un ejemplo: es la totalidad de los tipos que la
skill puede usar. No crees nuevas, no elimines, no cambies, no crees sinónimos y no alteres su
significado. Todas las abreviaturas se escriben en minúsculas y en `snake_case`, igual que los
otros dos bloques del ID.

| Elemento o componente                                        | Tipo oficial |
| -------------------------------------------------------------- | ------------ |
| Botones                                                         | `btn`        |
| Campos de texto                                                 | `txt`        |
| Campos de contraseña                                            | `pwd`        |
| Checkboxes                                                      | `chk`        |
| Radiobuttons                                                    | `rbn`        |
| Links o enlaces                                                 | `lnk`        |
| Dropdowns o desplegables                                        | `dwn`        |
| Textareas                                                       | `txa`        |
| Iconos interactivos                                             | `ico`        |
| Pop-ups o modales                                               | `pop`        |
| Tablas, filas específicas o celdas específicas                  | `tbl`        |
| Etiquetas de error o validación, y textos de solo lectura (títulos, subtítulos, párrafos, montos, fechas, saldos, resultados) | `lbl` |
| Menús de navegación                                             | `nav`        |
| Imágenes con una acción asociada                                | `img`        |
| Sliders                                                         | `sli`        |
| Elementos interactivos de gráficos (barras, puntos, etc.)       | `ele_chr`    |
| Paginadores                                                     | `pag`        |
| Elementos de carga, spinners o loaders                          | `ele_load`   |
| Formularios completos                                           | `frm`        |
| Contenedores principales de secciones clave                     | `cnt`        |
| Botones para cerrar modales o pop-ups                           | `btn_close`  |
| Elementos drag-and-drop                                         | `ele_dnd`    |
| Tabs o pestañas                                                 | `tab`        |

## Tipos con guion bajo interno

Estos cuatro tipos contienen un guion bajo dentro de su propia abreviatura. Al construir o
parsear un ID, reconócelos como una unidad — nunca dividas el string asumiendo que el tipo es
solo lo que está entre el primer y segundo `_`:

- `ele_chr`
- `ele_load`
- `btn_close`
- `ele_dnd`

Con el bloque 3 del ID también en `snake_case` (ver `SKILL.md`), el ID completo contiene muchos más
`_` que antes. Por eso es obligatorio identificar el bloque 2 por coincidencia más larga contra
esta tabla, buscando inmediatamente después del bloque 1 ya conocido por contexto — nunca partiendo
el string ni buscando la última coincidencia que aparezca.

## Abreviaturas explícitamente prohibidas

No uses estas ni ninguna otra abreviatura no documentada arriba, aunque parezcan razonables. La
mayoría de estos casos ya están cubiertos por `lbl` (ver la fila de la tabla): no crees una
abreviatura nueva para ellos.

```
ttl
pgh
val
txt_value
text
amount
card
sec
msg
```

Si un `data-id` **existente** usa alguna de estas abreviaturas, es un ID no conforme (ver
"Tratamiento de IDs existentes" en `SKILL.md`) y se corrige automáticamente en modo aplicación —
no es un caso de consulta al usuario.

## Elementos que requieren consulta al usuario

Cuando un elemento sea funcionalmente relevante pero no sea claro si encaja en `lbl` (relevancia
dudosa) o en ninguna otra fila de la tabla (tipo no claro), **no le asignes ID por tu cuenta**.
Repórtalo en "Casos que requieren consulta al usuario" en `SKILL.md`. En modo aplicación, este
elemento no se toca hasta que el usuario responda en el "Punto de parada obligatoria" (`SKILL.md`)
— se agrupa ahí con el resto de casos dudosos, las mejoras sugeridas y las ambigüedades
bloqueantes, después de haber aplicado ya todos los IDs inequívocos. No fuerces la clasificación
con `txt`, `cnt` ni con una abreviatura inventada.

#!/usr/bin/env node
// extraer-openapi.mjs
//
// Procesa un openapi.yaml/json (v3 o swagger 2.0) y produce un contrato de API
// legible por un agente: README.md (índice), un .md por dominio/tag, modelos.md
// (schemas aplanados con su tipo TS) y _meta.json.
//
// Uso:
//   node extraer-openapi.mjs <spec.yaml|spec.json> --out .api-contracts/<nombre> [opciones]
//
// Opciones:
//   --out <dir>       Carpeta de salida (obligatorio).
//   --nombre <api>    Nombre del API para el título del README (default: info.title).
//   --tag <t>         Filtra: solo incluye este tag. Repetible.
//   --path <patrón>   Filtra: solo incluye rutas que contengan este substring. Repetible.
//   --json            Además de los .md, escribe openapi.normalizado.json (spec ya
//                      normalizada/resuelta) para depuración.
//
// Sale con código 0 y un resumen por stdout si todo va bien.
// Sale con código distinto de cero y un mensaje explicando el motivo si no puede
// leer/parsear el YAML — en ese caso la skill debe usar el fallback manual descrito
// en references/casos-borde.md.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { _: [], tag: [], path: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a === '--nombre') args.nombre = argv[++i];
    else if (a === '--tag') args.tag.push(argv[++i]);
    else if (a === '--path') args.path.push(argv[++i]);
    else if (a === '--json') args.json = true;
    else args._.push(a);
  }
  return args;
}

function fail(msg) {
  console.error(`[extraer-openapi] ERROR: ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Carga de YAML/JSON
// ---------------------------------------------------------------------------

function loadYamlModuleFrom(cwd) {
  let req;
  try {
    req = createRequire(path.join(cwd, 'package.json'));
  } catch {
    req = createRequire(path.join(cwd, 'noop.cjs'));
  }
  for (const name of ['js-yaml', 'yaml']) {
    try {
      const resolved = req.resolve(name);
      const mod = req(resolved);
      return { name, mod };
    } catch {
      // sigue con el siguiente candidato
    }
  }
  return null;
}

function parseYamlWithLocalModule(text, cwd) {
  const found = loadYamlModuleFrom(cwd);
  if (!found) return null;
  if (found.name === 'js-yaml') return found.mod.load(text);
  if (found.name === 'yaml') return found.mod.parse(text);
  return null;
}

// `npx -p js-yaml node <script>` añade js-yaml al PATH (su carpeta .bin), pero NO lo hace
// resoluble por `require('js-yaml')` dentro del script (npx no toca NODE_PATH). Este resolver
// deriva la carpeta node_modules real de la instalación temporal de npx a partir del PATH que
// npx sí modifica, y hace require() por ruta absoluta. Se escribe a un archivo temporal en vez
// de pasarse inline con `-e` porque, al invocar todo a través de un shell (necesario en Windows
// para ejecutar `npx.cmd`), una ruta con espacios (frecuente en `AppData\...\<Usuario>\...`)
// dentro de un argumento -e se corrompe con el quoting del shell.
const NPX_RESOLVER_SCRIPT = `
const fs = require('fs');
const path = require('path');
const sep = process.platform === 'win32' ? ';' : ':';
const entries = (process.env.PATH || '').split(sep);
const binEntry = entries.find((e) => /npx/i.test(e)) || entries[0];
const nodeModulesDir = binEntry.replace(/[\\\\/]\\.bin$/, '');
let yaml;
try {
  yaml = require(path.join(nodeModulesDir, 'js-yaml'));
} catch (e) {
  process.stderr.write('no se pudo resolver js-yaml desde ' + nodeModulesDir + ': ' + e.message);
  process.exit(1);
}
const doc = yaml.load(fs.readFileSync(process.env.EXTRAER_OPENAPI_INPUT, 'utf8'));
process.stdout.write(JSON.stringify(doc));
`;

function shellQuote(s) {
  return `"${String(s).replace(/"/g, '\\"')}"`;
}

function parseYamlWithNpx(absFilePath) {
  const tmpScript = path.join(os.tmpdir(), `extraer-openapi-yaml2json-${process.pid}.cjs`);
  fs.writeFileSync(tmpScript, NPX_RESOLVER_SCRIPT, 'utf8');
  try {
    const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    // Se arma un único string de comando (en vez de {command, args}) y se cita cada parte a
    // mano: con shell:true, Node solo concatena los args con espacios sin escaparlos, así que
    // una ruta con espacios pasada como elemento de "args" se parte en varios tokens.
    const cmd = [npxBin, '--yes', '-p', 'js-yaml', 'node', shellQuote(tmpScript)].join(' ');
    const result = spawnSync(cmd, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 100,
      shell: true,
      env: { ...process.env, EXTRAER_OPENAPI_INPUT: absFilePath },
    });
    if (result.error || result.status !== 0) return null;
    try {
      return JSON.parse(result.stdout);
    } catch {
      return null;
    }
  } finally {
    fs.rmSync(tmpScript, { force: true });
  }
}

function loadSpec(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) fail(`no se encontró el archivo: ${abs}`);
  const text = fs.readFileSync(abs, 'utf8');
  const ext = path.extname(abs).toLowerCase();

  if (ext === '.json') {
    try {
      return JSON.parse(text);
    } catch (e) {
      fail(`el archivo .json no es válido: ${e.message}`);
    }
  }

  // .yaml / .yml (o sin extensión clara): intenta módulo local, luego npx.
  const cwd = process.cwd();
  const viaLocal = parseYamlWithLocalModule(text, cwd);
  if (viaLocal !== null && viaLocal !== undefined) return viaLocal;

  const viaNpx = parseYamlWithNpx(abs);
  if (viaNpx !== null && viaNpx !== undefined) return viaNpx;

  fail(
    'no se pudo parsear YAML: no hay "js-yaml"/"yaml" instalado en el proyecto y ' +
      '"npx --yes -p js-yaml" falló (probablemente sin acceso a red). ' +
      'Activa el fallback manual descrito en references/casos-borde.md.'
  );
}

// ---------------------------------------------------------------------------
// Utilidades de nombres
// ---------------------------------------------------------------------------

function toKebabCase(str) {
  return String(str)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toPascalCase(str) {
  return String(str)
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function deriveOperationId(method, routePath) {
  const parts = routePath
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.replace(/[{}]/g, ''));
  return (
    method.toLowerCase() +
    parts.map((p) => p.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase())).join('')
  );
}

// ---------------------------------------------------------------------------
// Normalización Swagger 2.0 -> forma similar a OpenAPI 3
// ---------------------------------------------------------------------------

// Reescribe recursivamente cualquier "$ref": "#/definitions/X" (swagger 2.0) a
// "$ref": "#/components/schemas/X" (forma v3 que el resto del script entiende). Otros $ref de
// swagger 2.0 (#/parameters/..., #/responses/...) no se reescriben aquí: quedan como $ref
// internos "desconocidos" y se resuelven igual vía resolveParamOrBodyRef siguiendo el mismo path,
// que sigue siendo válido porque solo se renombró el segmento "definitions".
function rewriteDefinitionsRefsDeep(node) {
  if (Array.isArray(node)) {
    for (const item of node) rewriteDefinitionsRefsDeep(item);
    return;
  }
  if (node && typeof node === 'object') {
    if (typeof node.$ref === 'string' && node.$ref.startsWith('#/definitions/')) {
      node.$ref = node.$ref.replace('#/definitions/', '#/components/schemas/');
    }
    for (const value of Object.values(node)) rewriteDefinitionsRefsDeep(value);
  }
}

function normalizeSwagger2(doc, holes) {
  rewriteDefinitionsRefsDeep(doc);
  const scheme = (doc.schemes && doc.schemes[0]) || 'https';
  const host = doc.host || 'HOST_NO_DEFINIDO';
  const basePath = doc.basePath || '';
  const servers = [{ url: `${scheme}://${host}${basePath}` }];

  const components = {
    schemas: doc.definitions || {},
    securitySchemes: {},
  };
  for (const [name, def] of Object.entries(doc.securityDefinitions || {})) {
    let type = def.type;
    if (type === 'basic') type = 'http';
    components.securitySchemes[name] = { ...def, type };
  }

  const paths = {};
  for (const [routePath, methods] of Object.entries(doc.paths || {})) {
    paths[routePath] = {};
    for (const [method, rawOp] of Object.entries(methods)) {
      if (!['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'].includes(method)) {
        paths[routePath][method] = rawOp; // parameters a nivel de path u otros
        continue;
      }
      const op = { ...rawOp };
      const params = [];
      for (const p of rawOp.parameters || []) {
        if (p.in === 'body') {
          op.requestBody = {
            required: !!p.required,
            content: { 'application/json': { schema: p.schema || {} } },
          };
        } else if (p.in === 'formData') {
          holes.push(
            `${method.toUpperCase()} ${routePath}: parámetro formData "${p.name}" (swagger 2.0) no tiene equivalente directo — revisar manualmente.`
          );
          params.push(p);
        } else {
          params.push(p);
        }
      }
      op.parameters = params;

      const responses = {};
      for (const [code, resp] of Object.entries(rawOp.responses || {})) {
        const r = { description: resp.description || '' };
        if (resp.schema) {
          r.content = { 'application/json': { schema: resp.schema } };
        }
        if (resp.headers) r.headers = resp.headers;
        responses[code] = r;
      }
      op.responses = responses;
      paths[routePath][method] = op;
    }
  }

  return {
    openapi: '3.0.0 (normalizado desde swagger 2.0)',
    info: doc.info || {},
    servers,
    security: doc.security,
    components,
    paths,
    tags: doc.tags,
  };
}

// ---------------------------------------------------------------------------
// Resolución de $ref internos y tipos TS
//
// Regla clave para evitar ciclos infinitos: un $ref a un schema NOMBRADO
// (components/schemas/X) nunca se expande recursivamente más allá de leer sus
// propias propiedades/allOf una vez. Cualquier $ref que aparezca DENTRO de esa
// lectura se deja como referencia por nombre (tipo TS = nombre del schema),
// nunca se vuelve a expandir. Los schemas anónimos/inline sí se expanden
// recursivamente por completo, porque no pueden formar ciclos por nombre.
// ---------------------------------------------------------------------------

function isInternalSchemaRef(ref) {
  return typeof ref === 'string' && ref.startsWith('#/components/schemas/');
}

function refName(ref) {
  const parts = ref.split('/');
  return parts[parts.length - 1];
}

function resolveParamOrBodyRef(ref, doc, holes) {
  if (!ref.startsWith('#/')) {
    holes.push(`$ref externo no resuelto: ${ref}`);
    return {};
  }
  const parts = ref.replace(/^#\//, '').split('/');
  let node = doc;
  for (const p of parts) {
    node = node && node[p];
  }
  if (node === undefined) {
    holes.push(`$ref interno no encontrado: ${ref}`);
    return {};
  }
  return node;
}

// Devuelve { properties, required, type } combinando allOf de forma superficial
// (un solo hop por cada miembro nombrado), con guarda de profundidad.
function mergeAllOfShallow(schema, doc, holes, depth = 0) {
  if (depth > 20) {
    holes.push('allOf con profundidad excesiva (>20) — posible ciclo, se truncó.');
    return { properties: {}, required: [] };
  }
  if (schema.$ref) {
    if (!isInternalSchemaRef(schema.$ref)) {
      holes.push(`$ref externo no resuelto dentro de allOf: ${schema.$ref}`);
      return { properties: {}, required: [] };
    }
    const target = doc.components?.schemas?.[refName(schema.$ref)];
    if (!target) {
      holes.push(`$ref interno no encontrado dentro de allOf: ${schema.$ref}`);
      return { properties: {}, required: [] };
    }
    return mergeAllOfShallow(target, doc, holes, depth + 1);
  }
  if (Array.isArray(schema.allOf)) {
    const acc = { properties: {}, required: [] };
    for (const member of schema.allOf) {
      const part = mergeAllOfShallow(member, doc, holes, depth + 1);
      Object.assign(acc.properties, part.properties);
      acc.required.push(...(part.required || []));
    }
    Object.assign(acc.properties, schema.properties || {});
    acc.required.push(...(schema.required || []));
    return acc;
  }
  return { properties: schema.properties || {}, required: schema.required || [] };
}

function mapStringFormat(format) {
  switch (format) {
    case 'date-time':
      return 'string /* ISO 8601 date-time */';
    case 'date':
      return 'string /* ISO 8601 date */';
    case 'uuid':
      return 'string /* uuid */';
    case 'byte':
      return 'string /* base64 */';
    case 'binary':
      return 'string /* binary */';
    case 'password':
      return 'string';
    default:
      return 'string';
  }
}

function schemaToTsType(schema, doc, holes, depth = 0) {
  if (!schema || depth > 40) return 'unknown';

  if (schema.$ref) {
    if (isInternalSchemaRef(schema.$ref)) {
      return toPascalCase(refName(schema.$ref));
    }
    holes.push(`$ref externo no resuelto: ${schema.$ref}`);
    return 'unknown /* $ref externo no resuelto */';
  }

  if (Array.isArray(schema.allOf)) {
    const merged = mergeAllOfShallow(schema, doc, holes);
    return objectTypeToTs({ ...schema, properties: merged.properties, required: merged.required, allOf: undefined }, doc, holes, depth);
  }

  if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
    const list = schema.oneOf || schema.anyOf;
    const members = list.map((s) => schemaToTsType(s, doc, holes, depth + 1));
    const union = members.length ? members.join(' | ') : 'unknown';
    return schema.nullable ? `(${union}) | null` : union;
  }

  if (Array.isArray(schema.enum)) {
    const literals = schema.enum.map((v) => (typeof v === 'string' ? JSON.stringify(v) : String(v)));
    const union = literals.length ? literals.join(' | ') : 'unknown';
    return schema.nullable ? `(${union}) | null` : union;
  }

  let base;
  switch (schema.type) {
    case 'string':
      base = mapStringFormat(schema.format);
      break;
    case 'integer':
    case 'number':
      base = schema.format === 'int64' ? 'number /* int64 */' : 'number';
      break;
    case 'boolean':
      base = 'boolean';
      break;
    case 'array':
      base = `${schemaToTsType(schema.items || {}, doc, holes, depth + 1)}[]`;
      break;
    case 'object':
    case undefined:
      base = objectTypeToTs(schema, doc, holes, depth);
      break;
    default:
      base = 'unknown';
  }
  return schema.nullable ? `${base} | null` : base;
}

function objectTypeToTs(schema, doc, holes, depth) {
  if (schema.properties && Object.keys(schema.properties).length) {
    const required = new Set(schema.required || []);
    const lines = Object.entries(schema.properties).map(([name, propSchema]) => {
      const optional = required.has(name) ? '' : '?';
      const tsType = schemaToTsType(propSchema, doc, holes, depth + 1);
      return `${JSON.stringify(name)}${optional}: ${tsType};`;
    });
    return `{ ${lines.join(' ')} }`;
  }
  if (schema.additionalProperties && schema.additionalProperties !== true) {
    return `Record<string, ${schemaToTsType(schema.additionalProperties, doc, holes, depth + 1)}>`;
  }
  if (schema.additionalProperties === true) {
    return 'Record<string, unknown>';
  }
  return 'unknown';
}

// Tabla de campos (para el .md) de un schema ya fusionado (properties/required).
function fieldsTable(properties, required, doc, holes) {
  const req = new Set(required || []);
  const rows = Object.entries(properties || {}).map(([name, propSchema]) => {
    const tipo = schemaToTsType(propSchema, doc, holes);
    const restricciones = [];
    if (propSchema.enum) restricciones.push(`enum`);
    if (propSchema.format) restricciones.push(propSchema.format);
    if (propSchema.minLength != null) restricciones.push(`minLength ${propSchema.minLength}`);
    if (propSchema.maxLength != null) restricciones.push(`maxLength ${propSchema.maxLength}`);
    if (propSchema.minimum != null) restricciones.push(`min ${propSchema.minimum}`);
    if (propSchema.maximum != null) restricciones.push(`max ${propSchema.maximum}`);
    if (propSchema.pattern) restricciones.push(`pattern ${propSchema.pattern}`);
    const desc = (propSchema.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    return `| \`${name}\` | \`${tipo.replace(/\|/g, '\\|')}\` | ${req.has(name) ? 'sí' : 'no'} | ${restricciones.join(', ') || '—'} | ${desc || '—'} |`;
  });
  return rows;
}

// ---------------------------------------------------------------------------
// Construcción del contrato
// ---------------------------------------------------------------------------

function buildModelos(doc, holes) {
  const schemas = doc.components?.schemas || {};
  const modelos = [];
  for (const [name, schema] of Object.entries(schemas)) {
    const pascalName = toPascalCase(name);
    if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
      modelos.push({
        name,
        pascalName,
        kind: 'union',
        tsType: schemaToTsType(schema, doc, holes),
        discriminator: schema.discriminator?.propertyName || null,
        description: schema.description || '',
      });
      continue;
    }
    const merged = mergeAllOfShallow(schema, doc, holes);
    const hasProps = Object.keys(merged.properties).length > 0 || Boolean(schema.properties && Object.keys(schema.properties).length);
    if (!hasProps) {
      // Schema nombrado que no es un objeto con "properties": alias de tipo primitivo/array/enum,
      // o un objeto abierto vía "additionalProperties" (Record<string, T>). schemaToTsType ya
      // sabe generar el tipo correcto para ambos casos; solo hay hueco real si no encaja en
      // ninguno.
      const esAliasReconocible =
        Boolean(schema.additionalProperties) ||
        Boolean(schema.enum) ||
        (schema.type && schema.type !== 'object');
      if (!esAliasReconocible) {
        holes.push(`El schema "${name}" no tiene "type"/"properties"/"additionalProperties" reconocibles.`);
      }
      modelos.push({
        name,
        pascalName,
        kind: 'alias',
        tsType: schemaToTsType(schema, doc, holes),
        description: schema.description || '',
      });
      continue;
    }
    modelos.push({
      name,
      pascalName,
      kind: 'object',
      properties: merged.properties,
      required: merged.required,
      description: schema.description || '',
    });
  }
  return modelos;
}

function collectSecurity(op, doc) {
  const sec = op.security || doc.security;
  if (!sec || !sec.length) return [];
  return sec.map((s) => Object.keys(s)).flat();
}

function buildEndpoints(doc, holes, filters) {
  const endpoints = [];
  const usedOperationIds = new Map();

  for (const [routePath, methods] of Object.entries(doc.paths || {})) {
    if (filters.path.length && !filters.path.some((p) => routePath.includes(p))) continue;

    const pathLevelParams = Array.isArray(methods.parameters) ? methods.parameters : [];

    for (const [method, op] of Object.entries(methods)) {
      if (!['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'].includes(method)) continue;
      if (!op || typeof op !== 'object') continue;

      const tags = op.tags && op.tags.length ? op.tags : ['general'];
      const tag = tags[0];
      if (filters.tag.length && !filters.tag.includes(tag)) continue;

      let operationId = op.operationId;
      let operationIdDerived = false;
      if (!operationId) {
        operationId = deriveOperationId(method, routePath);
        operationIdDerived = true;
        holes.push(`${method.toUpperCase()} ${routePath}: sin "operationId" — se derivó "${operationId}".`);
      }
      if (usedOperationIds.has(operationId)) {
        const original = operationId;
        operationId = `${operationId}_${method}`;
        holes.push(`operationId duplicado "${original}" — renombrado a "${operationId}" para el ancla interna.`);
      }
      usedOperationIds.set(operationId, true);

      // Fusiona parámetros: nivel de path + nivel de operación (la operación gana si coincide name+in).
      const paramMap = new Map();
      for (const p of pathLevelParams) {
        const resolved = p.$ref ? resolveParamOrBodyRef(p.$ref, doc, holes) : p;
        paramMap.set(`${resolved.in}:${resolved.name}`, resolved);
      }
      for (const p of op.parameters || []) {
        const resolved = p.$ref ? resolveParamOrBodyRef(p.$ref, doc, holes) : p;
        paramMap.set(`${resolved.in}:${resolved.name}`, resolved);
      }
      const parameters = [...paramMap.values()].map((p) => ({
        name: p.name,
        in: p.in,
        required: !!p.required,
        schema: p.schema || (p.type ? { type: p.type, format: p.format, enum: p.enum } : {}),
        description: p.description || '',
      }));

      let requestBody = null;
      if (op.requestBody) {
        const rb = op.requestBody.$ref ? resolveParamOrBodyRef(op.requestBody.$ref, doc, holes) : op.requestBody;
        const contentTypes = Object.keys(rb.content || {});
        const primary = contentTypes.includes('application/json') ? 'application/json' : contentTypes[0];
        requestBody = {
          required: !!rb.required,
          contentType: primary || null,
          allContentTypes: contentTypes,
          schema: primary ? rb.content[primary].schema : null,
        };
        if (contentTypes.length > 1) {
          holes.push(
            `${method.toUpperCase()} ${routePath}: requestBody con varios content-types (${contentTypes.join(', ')}) — solo se documentó "${primary}" en detalle.`
          );
        }
      }

      const responses = [];
      for (const [code, rawResp] of Object.entries(op.responses || {})) {
        const resp = rawResp.$ref ? resolveParamOrBodyRef(rawResp.$ref, doc, holes) : rawResp;
        const contentTypes = Object.keys(resp.content || {});
        const primary = contentTypes.includes('application/json') ? 'application/json' : contentTypes[0];
        const schema = primary ? resp.content[primary].schema : null;
        if (!schema && code !== '204' && !String(code).startsWith('3')) {
          holes.push(`${method.toUpperCase()} ${routePath} → respuesta ${code}: sin schema definido.`);
        }
        responses.push({
          code,
          description: resp.description || '',
          contentType: primary || null,
          schema,
        });
      }

      endpoints.push({
        method: method.toUpperCase(),
        path: routePath,
        tag,
        operationId,
        operationIdDerived,
        summary: op.summary || op.description || '',
        deprecated: !!op.deprecated,
        parameters,
        requestBody,
        responses,
        security: collectSecurity(op, doc),
      });
    }
  }
  return endpoints;
}

// ---------------------------------------------------------------------------
// Render Markdown
// ---------------------------------------------------------------------------

function paramTypeLabel(schema) {
  if (!schema || !Object.keys(schema).length) return '—';
  if (schema.enum) return schema.enum.map((v) => JSON.stringify(v)).join(' | ');
  if (schema.type === 'array') return `${paramTypeLabel(schema.items || {})}[]`;
  return schema.type || 'object';
}

function renderParamsTable(parameters, kind) {
  const rows = parameters.filter((p) => p.in === kind);
  if (!rows.length) return null;
  const header = '| Nombre | Tipo | Requerido | Descripción |\n|---|---|---|---|';
  const body = rows
    .map((p) => {
      const tipo = paramTypeLabel(p.schema);
      return `| \`${p.name}\` | \`${tipo}\` | ${p.required ? 'sí' : 'no'} | ${p.description || '—'} |`;
    })
    .join('\n');
  return `${header}\n${body}`;
}

function renderEndpoint(ep, doc, holes) {
  const lines = [];
  lines.push(`<a id="${ep.operationId}"></a>`);
  lines.push(`### ${ep.method} ${ep.path}`);
  lines.push('');
  lines.push(`**operationId:** \`${ep.operationId}\`${ep.operationIdDerived ? ' _(derivado, no venía en la spec)_' : ''}`);
  if (ep.deprecated) lines.push('\n> ⚠️ **Deprecado.**');
  if (ep.summary) lines.push(`\n${ep.summary}`);
  if (ep.security.length) lines.push(`\n**Seguridad:** ${ep.security.join(', ')}`);

  const pathParams = renderParamsTable(ep.parameters, 'path');
  const queryParams = renderParamsTable(ep.parameters, 'query');
  const headerParams = renderParamsTable(ep.parameters, 'header');
  if (pathParams) lines.push(`\n**Parámetros de path**\n\n${pathParams}`);
  if (queryParams) lines.push(`\n**Parámetros de query**\n\n${queryParams}`);
  if (headerParams) lines.push(`\n**Cabeceras**\n\n${headerParams}`);

  if (ep.requestBody) {
    const t = schemaToTsType(ep.requestBody.schema || {}, doc, holes);
    lines.push(
      `\n**Cuerpo de la petición** (\`${ep.requestBody.contentType || 'sin content-type'}\`, ${ep.requestBody.required ? 'requerido' : 'opcional'})\n\n\`\`\`ts\n${t}\n\`\`\``
    );
  }

  lines.push('\n**Respuestas**\n');
  for (const r of ep.responses) {
    lines.push(`- **${r.code}** — ${r.description || 'sin descripción'}`);
    if (r.schema) {
      const t = schemaToTsType(r.schema, doc, holes);
      lines.push(`  \`\`\`ts\n  ${t}\n  \`\`\``);
    }
  }
  lines.push('\n---\n');
  return lines.join('\n');
}

function renderModelo(m) {
  const lines = [`<a id="${m.pascalName}"></a>`, `### ${m.pascalName}`];
  if (m.description) lines.push(`\n${m.description}`);

  if (m.kind === 'alias' || m.kind === 'union') {
    lines.push(`\n\`\`\`ts\nexport type ${m.pascalName} = ${m.tsType};\n\`\`\``);
    if (m.discriminator) lines.push(`\nDiscriminador: \`${m.discriminator}\`.`);
    lines.push('\n---\n');
    return lines.join('\n');
  }

  const rows = fieldsTable(m.properties, m.required, m.__doc, m.__holes);
  if (rows.length) {
    lines.push('\n| Campo | Tipo | Requerido | Restricciones | Descripción |\n|---|---|---|---|---|\n' + rows.join('\n'));
  }
  const required = new Set(m.required || []);
  const tsFields = Object.entries(m.properties)
    .map(([name, s]) => `  ${JSON.stringify(name)}${required.has(name) ? '' : '?'}: ${schemaToTsType(s, m.__doc, m.__holes)};`)
    .join('\n');
  lines.push(`\n\`\`\`ts\nexport interface ${m.pascalName} {\n${tsFields}\n}\n\`\`\``);
  lines.push('\n---\n');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args._[0]) fail('falta la ruta al spec (openapi.yaml o .json).');
  if (!args.out) fail('falta --out <carpeta de salida>.');

  const holes = [];
  let raw = loadSpec(args._[0]);

  const isSwagger2 = raw.swagger && String(raw.swagger).startsWith('2');
  const doc = isSwagger2 ? normalizeSwagger2(raw, holes) : raw;

  if (!doc.servers || !doc.servers.length) {
    holes.push('La spec no define "servers" (o "host"/"basePath" en swagger 2.0) — falta la base URL.');
  }
  if (!doc.components) doc.components = { schemas: {} };
  if (!doc.components.schemas) doc.components.schemas = {};

  const filters = { tag: args.tag, path: args.path };
  const endpoints = buildEndpoints(doc, holes, filters);
  const modelos = buildModelos(doc, holes);
  for (const m of modelos) {
    m.__doc = doc;
    m.__holes = holes;
  }

  const byTag = new Map();
  for (const ep of endpoints) {
    if (!byTag.has(ep.tag)) byTag.set(ep.tag, []);
    byTag.get(ep.tag).push(ep);
  }

  const outDir = path.resolve(args.out);
  fs.mkdirSync(outDir, { recursive: true });

  // --- archivos por dominio (subcarpeta dominios/, separados de los archivos fijos de la raíz) ---
  const dominiosDir = path.join(outDir, 'dominios');
  fs.mkdirSync(dominiosDir, { recursive: true });
  const tagFiles = new Map(); // tag -> ruta relativa al README (para el enlace Markdown, siempre con "/")
  for (const [tag, eps] of byTag) {
    const filename = `${toKebabCase(tag)}.md`;
    tagFiles.set(tag, `dominios/${filename}`);
    const body = [`# Dominio: ${tag}`, ''].concat(eps.map((ep) => renderEndpoint(ep, doc, holes))).join('\n');
    fs.writeFileSync(path.join(dominiosDir, filename), body, 'utf8');
  }

  // --- modelos.md ---
  const modelosBody = ['# Modelos', ''].concat(modelos.map(renderModelo)).join('\n');
  fs.writeFileSync(path.join(outDir, 'modelos.md'), modelosBody, 'utf8');

  // --- README.md ---
  const apiName = args.nombre || doc.info?.title || 'API';
  const indexRows = endpoints
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))
    .map((ep) => {
      const file = tagFiles.get(ep.tag);
      return `| ${ep.method} | \`${ep.path}\` | \`${ep.operationId}\` | ${ep.summary || '—'} | [${ep.tag}](${file}#${ep.operationId}) |`;
    });

  const securitySchemes = doc.components.securitySchemes || {};
  const securityLines = Object.entries(securitySchemes).map(([name, s]) => `- **${name}**: ${s.type}${s.scheme ? ` (${s.scheme})` : ''}${s.in ? `, en ${s.in} "${s.name}"` : ''}`);

  const readmeLines = [
    `# ${apiName}`,
    '',
    `Versión: ${doc.info?.version || 'no especificada'}`,
    '',
    '## Servers',
    doc.servers && doc.servers.length
      ? doc.servers.map((s) => `- \`${s.url}\`${s.description ? ` — ${s.description}` : ''}`).join('\n')
      : '- No se declara ningún server en la spec (ver "Huecos del contrato").',
    '',
    '## Seguridad',
    securityLines.length ? securityLines.join('\n') : '- No se declaran esquemas de seguridad en la spec.',
    '',
    '## Índice de endpoints',
    '',
    '| Método | Ruta | operationId | Resumen | Dominio |',
    '|---|---|---|---|---|',
    ...indexRows,
    '',
    '## Huecos del contrato',
    '',
    holes.length
      ? [...new Set(holes)].map((h) => `- ${h}`).join('\n')
      : '- Ninguno detectado automáticamente.',
    '',
    '## Convenciones transversales',
    '',
    '_Completar en la fase de enriquecimiento: paginación, envelope de respuesta, modelo de error',
    'real, formatos de fecha/moneda, cabeceras obligatorias — ver SKILL.md, Fase 2._',
    '',
  ];
  fs.writeFileSync(path.join(outDir, 'README.md'), readmeLines.join('\n'), 'utf8');

  // --- _meta.json ---
  const meta = {
    generadoEn: new Date().toISOString(),
    specOrigen: path.resolve(args._[0]),
    swagger2Normalizado: !!isSwagger2,
    modo: 'script',
    contadores: {
      endpoints: endpoints.length,
      dominios: byTag.size,
      modelos: modelos.length,
      huecos: new Set(holes).size,
    },
    huecos: [...new Set(holes)],
  };
  fs.writeFileSync(path.join(outDir, '_meta.json'), JSON.stringify(meta, null, 2), 'utf8');

  if (args.json) {
    fs.writeFileSync(path.join(outDir, 'openapi.normalizado.json'), JSON.stringify(doc, null, 2), 'utf8');
  }

  console.log(`[extraer-openapi] OK → ${outDir}`);
  console.log(`  endpoints: ${endpoints.length}`);
  console.log(`  dominios:  ${byTag.size} (${[...byTag.keys()].join(', ')})`);
  console.log(`  modelos:   ${modelos.length}`);
  console.log(`  huecos:    ${meta.contadores.huecos}`);
}

main();

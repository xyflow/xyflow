// @ts-check
/* eslint-disable no-console -- build-time codegen script; console is its interface */
/**
 * Regenerates `src/props-objects.gen.ts` — the runtime prop-declaration factories
 * (`nodeProps()`, `edgeProps()`, `connectionLineProps()`) that JS users use in place of
 * `defineProps<NodeProps<T>>()` (a TS-only macro form).
 *
 * Each factory is derived from its source interface via *indexed access*
 * (`propOf<NodeProps<NodeType>['data']>()`), so field *types* live-derive — only added/removed
 * fields or optionality changes require regeneration. `pnpm codegen` writes the file; `pnpm
 * codegen:check` (used in CI) fails if the committed file is stale.
 *
 * Uses the TypeScript compiler API directly (already a dependency) — no extra tooling.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const OUT_FILE = join(PKG_ROOT, 'src', 'props-objects.gen.ts');

/**
 * The interfaces we expose as runtime props objects: the props VueFlow passes *into* a
 * user-authored component (custom node / custom edge / custom connection line). `EdgeTextProps`
 * and `BaseEdgeProps` are deliberately excluded — those describe props you pass *to* a
 * library-provided component (`<EdgeText>`/`<BaseEdge>`), not props your component receives.
 */
const TARGETS = [
  { type: 'NodeProps', factory: 'nodeProps' },
  { type: 'EdgeProps', factory: 'edgeProps' },
  { type: 'ConnectionLineProps', factory: 'connectionLineProps' },
];

const program = createProgram();
const checker = program.getTypeChecker();

const factories = TARGETS.map(({ type, factory }) => {
  const decl = findExportedInterface(type);
  return renderFactory({ type, factory, decl });
});

const importNames = new Set();
for (const { type, decl } of TARGETS.map(t => ({ ...t, decl: findExportedInterface(t.type) }))) {
  importNames.add(type);
  collectConstraintTypeNames(decl, importNames);
}

const output = render([...importNames].sort(), factories);

const isCheck = process.argv.includes('--check');
if (isCheck) {
  const current = readSafe(OUT_FILE);
  if (current !== output) {
    console.error(
      `✖ ${relativeOut()} is out of date. Run \`pnpm codegen\` and commit the result.`,
    );
    process.exit(1);
  }
  console.log(`✓ ${relativeOut()} is up to date.`);
}
else {
  writeFileSync(OUT_FILE, output);
  console.log(`✓ wrote ${relativeOut()}`);
}

// --- helpers ---------------------------------------------------------------

function createProgram() {
  const configPath = join(PKG_ROOT, 'tsconfig.json');
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, PKG_ROOT);
  return ts.createProgram(parsed.fileNames, parsed.options);
}

/** @param {string} name */
function findExportedInterface(name) {
  for (const sf of program.getSourceFiles()) {
    if (sf.isDeclarationFile) {
      continue;
    }
    for (const stmt of sf.statements) {
      if (
        ts.isInterfaceDeclaration(stmt)
        && stmt.name.text === name
        && ts.getCombinedModifierFlags(stmt) & ts.ModifierFlags.Export
      ) {
        return stmt;
      }
    }
  }
  throw new Error(`Exported interface \`${name}\` not found`);
}

/** @param {ts.InterfaceDeclaration} decl */
function renderFactory({ type, factory, decl }) {
  const symbol = checker.getSymbolAtLocation(decl.name);
  if (!symbol) {
    throw new Error(`Could not resolve symbol for \`${type}\``);
  }
  const flat = checker.getDeclaredTypeOfSymbol(symbol);
  const members = checker
    .getPropertiesOfType(flat)
    .map(sym => ({ name: sym.getName(), optional: !!(sym.flags & ts.SymbolFlags.Optional) }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const params = decl.typeParameters ?? [];
  const paramList = params.length ? `<${params.map(p => p.getText()).join(', ')}>` : '';
  const argList = params.length ? `<${params.map(p => p.name.getText()).join(', ')}>` : '';

  const lines = members.map(({ name, optional }) => {
    const key = /^[a-z_$][\w$]*$/i.test(name) ? name : JSON.stringify(name);
    const access = `${type}${argList}['${name}']`;
    return `    ${key}: propOf<${access}>(${optional ? '' : 'true'}),`;
  });

  return `export function ${factory}${paramList}() {\n  return {\n${lines.join('\n')}\n  };\n}`;
}

/**
 * Names referenced by an interface's type-parameter constraints/defaults (e.g. `Node`, `Edge`),
 * so the generated file imports exactly what it uses.
 * @param {ts.InterfaceDeclaration} decl
 * @param {Set<string>} into
 */
function collectConstraintTypeNames(decl, into) {
  /** @param {ts.Node} node */
  const walk = (node) => {
    if (ts.isTypeReferenceNode(node)) {
      into.add(node.typeName.getText());
    }
    node.forEachChild(walk);
  };
  for (const tp of decl.typeParameters ?? []) {
    if (tp.constraint) {
      walk(tp.constraint);
    }
    if (tp.default) {
      walk(tp.default);
    }
  }
}

/**
 * @param {string[]} imports
 * @param {string[]} factories
 */
function render(imports, factories) {
  return `// ⚠️  AUTO-GENERATED by scripts/gen-props-objects.mjs — DO NOT EDIT.
// Regenerate with \`pnpm codegen\`; CI verifies it is current with \`pnpm codegen:check\`.
//
// Runtime prop-declaration factories mirroring the ${TARGETS.map(t => t.type).join(' / ')} interfaces,
// for JS users who cannot write \`defineProps<${TARGETS[0].type}<T>>()\` (a TS-only macro form).
// Each entry derives its type from the source interface via indexed access, so field type changes
// need no regeneration — only added/removed fields or optionality changes do.

import type { ${imports.join(', ')} } from './types';
import { propOf } from './utils/prop-of';

${factories.join('\n\n')}
`;
}

function relativeOut() {
  return `src/${OUT_FILE.split('/src/')[1]}`;
}

/** @param {string} file */
function readSafe(file) {
  try {
    return readFileSync(file, 'utf8');
  }
  catch {
    return null;
  }
}

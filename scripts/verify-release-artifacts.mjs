#!/usr/bin/env node
/**
 * Release preflight, run by `pnpm release` before `changeset publish`.
 *
 * For every package about to be published, verifies that all @xyflow/* exports its
 * dist imports actually exist in the exact dependency versions consumers will install.
 * This catches internal packages (e.g. @xyflow/system) that gained new exports but were
 * not given a changeset: the dependent would ship pinned to an already-published version
 * that lacks those exports, breaking consumers at import or typecheck time.
 *
 * Requires `pnpm build` to have run first.
 *
 * Not statically enumerable and therefore not checked: names reached through
 * `import * as ns` or `export * from`, and CommonJS `require()` output (for dual
 * builds the ESM output covers the same import surface).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const INTERNAL_SCOPE = '@xyflow/';

const RUNTIME_FILE = /\.(js|mjs|svelte)$/;
const TYPES_FILE = /\.d\.(ts|mts|cts)$/;
const IMPORT_RE =
  /(?:^|[;\n])\s*(?:import|export)\s+(?<stmtType>type\s+)?(?:(?<defaultName>[\w$]+)\s*,\s*)?(?:\{(?<named>[^}]*)\}|(?<defaultOnly>[\w$]+))\s*from\s*['"](?<dep>[^'"]+)['"]/g;

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const slug = (name) => name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');

// `changeset publish` releases every non-private workspace package whose version is
// missing from the registry; only packages/* contains non-private packages.
function publishablePackages() {
  return fs
    .readdirSync(PACKAGES_DIR)
    .map((dir) => path.join(PACKAGES_DIR, dir))
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')))
    .map((dir) => ({ dir, manifest: readJson(path.join(dir, 'package.json')) }))
    .filter(({ manifest }) => manifest.private !== true);
}

const versionsCache = new Map();

function registryVersions(name) {
  if (!versionsCache.has(name)) {
    let versions = [];
    try {
      const parsed = JSON.parse(run('npm', ['view', name, 'versions', '--json']));
      versions = Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
      // E404 means the package has never been published.
      if (!output.includes('E404')) throw error;
    }
    versionsCache.set(name, new Set(versions));
  }
  return versionsCache.get(name);
}

function parseNamedSpecifiers(named) {
  const values = [];
  const types = [];
  for (const raw of named.split(',')) {
    const spec = raw.trim();
    if (!spec) continue;
    const name = spec
      .replace(/^type\s+/, '')
      .split(/\s+as\s+/)[0]
      .trim();
    if (!/^[\w$]+$/.test(name)) continue;
    (/^type\s/.test(spec) ? types : values).push(name);
  }
  return { values, types };
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Only dist/ is scanned — published src/ exists solely for sourcemaps. The svelte dist
// ships untranspiled TS inside .svelte files, so `type`-marked specifiers found in
// runtime files must be checked against type declarations, not the runtime namespace.
function scanInternalImports(extractedPkgDir) {
  const distDir = path.join(extractedPkgDir, 'dist');
  const imports = new Map();
  if (!fs.existsSync(distDir)) return imports;

  for (const file of walk(distDir)) {
    const isTypesFile = TYPES_FILE.test(file);
    if (!isTypesFile && !RUNTIME_FILE.test(file)) continue;

    for (const match of fs.readFileSync(file, 'utf8').matchAll(IMPORT_RE)) {
      const { stmtType, defaultName, defaultOnly, named, dep } = match.groups;
      if (!dep.startsWith(INTERNAL_SCOPE)) continue;
      if (!imports.has(dep)) imports.set(dep, { runtime: new Set(), types: new Set() });
      const buckets = imports.get(dep);
      const statementBucket = isTypesFile || stmtType ? buckets.types : buckets.runtime;
      const { values, types } = parseNamedSpecifiers(named ?? '');
      for (const name of types) buckets.types.add(name);
      for (const name of values) statementBucket.add(name);
      if (defaultName || defaultOnly) statementBucket.add('default');
    }
  }
  return imports;
}

// Returns the runtime names missing from the dependency's actual module namespace.
function checkRuntimeExports(consumerDir, dep, names) {
  const file = path.join(consumerDir, `runtime-check-${slug(dep)}.mjs`);
  fs.writeFileSync(
    file,
    [
      `import * as ns from ${JSON.stringify(dep)};`,
      `const missing = ${JSON.stringify([...names])}.filter((name) => !(name in ns));`,
      `if (missing.length > 0) { console.error('MISSING' + JSON.stringify(missing)); process.exit(1); }`,
    ].join('\n')
  );
  try {
    run(process.execPath, [file], { cwd: consumerDir });
    return [];
  } catch (error) {
    const stderr = String(error.stderr ?? '');
    const marker = stderr.split('\n').find((line) => line.startsWith('MISSING'));
    if (marker) return JSON.parse(marker.slice('MISSING'.length));
    return [`importing ${dep} itself failed: ${stderr.trim()}`];
  }
}

// Returns the type names missing from the dependency's declarations.
function checkTypeExports(consumerDir, dep, names) {
  const file = path.join(consumerDir, `types-check-${slug(dep)}.ts`);
  const specifiers = [...names].map((name, i) => `  ${name} as _t${i},`).join('\n');
  fs.writeFileSync(file, `import {\n${specifiers}\n} from ${JSON.stringify(dep)};\nexport {};\n`);
  try {
    run('pnpm', ['exec', 'tsc', '--noEmit', '--skipLibCheck', '--module', 'nodenext', '--target', 'es2022', file], {
      cwd: ROOT,
    });
    return [];
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    const missing = [...output.matchAll(/has no exported member(?: named)? '([^']+)'/g)].map((m) => m[1]);
    return missing.length > 0 ? missing : [`typechecking against ${dep} failed:\n${output.trim()}`];
  }
}

const releaseSet = new Map(
  publishablePackages()
    .filter(({ manifest }) => !registryVersions(manifest.name).has(manifest.version))
    .map((pkg) => [pkg.manifest.name, pkg])
);

if (releaseSet.size === 0) {
  console.log('verify-release-artifacts: every package version is already on the registry — nothing to verify.');
  process.exit(0);
}

console.log(
  `verify-release-artifacts: packages to be published: ${[...releaseSet.values()]
    .map(({ manifest }) => `${manifest.name}@${manifest.version}`)
    .join(', ')}\n`
);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'xyflow-verify-release-'));
const failures = [];

// Pack everything up front so co-published dependencies can be installed from local tarballs.
const tarballs = new Map();
for (const { dir, manifest } of releaseSet.values()) {
  const packDest = path.join(tmp, 'pack', slug(manifest.name));
  fs.mkdirSync(packDest, { recursive: true });
  run('pnpm', ['pack', '--pack-destination', packDest], { cwd: dir });
  const tarball = path.join(
    packDest,
    fs.readdirSync(packDest).find((f) => f.endsWith('.tgz'))
  );
  const extractedDir = path.join(tmp, 'extract', slug(manifest.name));
  fs.mkdirSync(extractedDir, { recursive: true });
  run('tar', ['-xzf', tarball, '-C', extractedDir]);
  tarballs.set(manifest.name, { tarball, extractedDir: path.join(extractedDir, 'package') });
}

for (const [pkgName, { extractedDir }] of tarballs) {
  const packedManifest = readJson(path.join(extractedDir, 'package.json'));
  const pkgLabel = `${pkgName}@${packedManifest.version}`;
  const internalImports = scanInternalImports(extractedDir);
  if (internalImports.size === 0) {
    console.log(`✓ ${pkgLabel}: no internal @xyflow imports`);
    continue;
  }

  // Resolve each internal dependency to the exact artifact consumers will install:
  // the local tarball when it is co-published in this release, the registry otherwise.
  const installSpecs = [];
  const depSources = new Map();
  for (const dep of internalImports.keys()) {
    const pin = packedManifest.dependencies?.[dep] ?? packedManifest.peerDependencies?.[dep];
    if (!pin) {
      failures.push(`${pkgLabel} imports from '${dep}' but does not declare it as a dependency.`);
      internalImports.delete(dep);
    } else if (releaseSet.has(dep)) {
      installSpecs.push(tarballs.get(dep).tarball);
      depSources.set(dep, `${dep}@${pin}, co-published in this release`);
    } else if (registryVersions(dep).has(pin)) {
      installSpecs.push(`${dep}@${pin}`);
      depSources.set(dep, `${dep}@${pin} from the registry`);
    } else {
      failures.push(
        `${pkgLabel} pins '${dep}@${pin}', but that version is neither on the registry nor part of this release.`
      );
      internalImports.delete(dep);
    }
  }
  if (installSpecs.length === 0) continue;

  const consumerDir = path.join(tmp, 'consumer', slug(pkgName));
  fs.mkdirSync(consumerDir, { recursive: true });
  fs.writeFileSync(
    path.join(consumerDir, 'package.json'),
    JSON.stringify({ name: `verify-${slug(pkgName)}`, version: '0.0.0', private: true, type: 'module' })
  );
  run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts', '--loglevel=error', ...installSpecs], {
    cwd: consumerDir,
  });

  for (const [dep, { runtime, types }] of internalImports) {
    const missingRuntime = runtime.size > 0 ? checkRuntimeExports(consumerDir, dep, runtime) : [];
    const missingTypes = types.size > 0 ? checkTypeExports(consumerDir, dep, types) : [];

    if (missingRuntime.length === 0 && missingTypes.length === 0) {
      console.log(
        `✓ ${pkgLabel} → ${depSources.get(dep)}: ${runtime.size} runtime + ${types.size} type imports resolve`
      );
      continue;
    }

    const details = [
      missingRuntime.length > 0 && `missing runtime exports: ${missingRuntime.join(', ')}`,
      missingTypes.length > 0 && `missing type exports: ${missingTypes.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n  ');
    let message = `${pkgLabel} → ${depSources.get(dep)}:\n  ${details}`;
    if (!releaseSet.has(dep)) {
      message +=
        `\n  Hint: '${dep}' is not part of this release. If it gained new exports, it needs its own` +
        `\n  changeset so it gets bumped and published together with '${pkgName}'.`;
    }
    failures.push(message);
  }
}

if (failures.length > 0) {
  console.error(`\n✖ release verification failed (artifacts kept in ${tmp}):\n`);
  for (const failure of failures) console.error(`✖ ${failure}\n`);
  process.exit(1);
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log('\nverify-release-artifacts: all published artifacts resolve against their pinned dependencies.');

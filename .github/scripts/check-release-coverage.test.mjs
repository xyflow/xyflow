import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./check-release-coverage.mjs', import.meta.url));

function check({ files, changesets = [], baseChangesets = [], privateSystem = false, ignore = [], baseRef = 'base' }) {
  const directory = mkdtempSync(join(tmpdir(), 'xyflow-release-test-'));
  try {
    const write = (path, content) => {
      mkdirSync(join(directory, path, '..'), { recursive: true });
      writeFileSync(join(directory, path), content);
    };
    const git = (...args) => execFileSync('git', args, { cwd: directory, stdio: 'pipe' });
    const writeChangesets = (prefix, entries) => {
      for (const [index, releases] of entries.entries()) {
        const frontmatter = Object.entries(releases).map(([name, type]) => `"@xyflow/${name}": ${type}`);
        write(`.changeset/${prefix}-${index}.md`, ['---', ...frontmatter, '---', '', 'Fixture change.', ''].join('\n'));
      }
    };
    const commit = (message) => {
      git('add', '.');
      git(
        '-c',
        'commit.gpgsign=false',
        '-c',
        'user.name=Test fixture',
        '-c',
        'user.email=test@example.invalid',
        'commit',
        '-qm',
        message
      );
    };
    write('package.json', JSON.stringify({ name: 'release-test', private: true }));
    write('pnpm-workspace.yaml', "packages:\n  - 'packages/*'\n");
    write(
      '.changeset/config.json',
      JSON.stringify({
        changelog: false,
        commit: false,
        fixed: [],
        linked: [],
        access: 'restricted',
        baseBranch: 'base',
        updateInternalDependencies: 'patch',
        ignore,
      })
    );
    for (const name of ['react', 'system', 'svelte']) {
      write(
        `packages/${name}/package.json`,
        JSON.stringify({
          name: `@xyflow/${name}`,
          version: '1.0.0',
          private: name === 'system' && privateSystem,
          dependencies: name === 'system' ? {} : { '@xyflow/system': '^1.0.0' },
        })
      );
      write(`packages/${name}/src/index.ts`, 'export const value = 1;\n');
    }
    writeChangesets('base', baseChangesets);
    git('init', '-q');
    commit('baseline');
    git('branch', 'base');
    for (const [path, content] of Object.entries(files)) {
      if (content === null) unlinkSync(join(directory, path));
      else write(path, content);
    }
    writeChangesets('change', changesets);
    commit('change');
    return spawnSync(process.execPath, [script, baseRef], { cwd: directory, encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

const changedSource = {
  'packages/react/src/index.ts': 'export const value = 2;\n',
  'packages/system/src/index.ts': 'export const value = 2;\n',
};

test('rejects a system change when the release plan only covers React', () => {
  const result = check({ files: changedSource, changesets: [{ react: 'patch' }] });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /without a release planned for: @xyflow\/system/);
});

test('accepts a release plan covering every changed library', () => {
  const result = check({ files: changedSource, changesets: [{ react: 'patch', system: 'patch' }] });
  assert.equal(result.status, 0, result.stderr);
});

test('a changeset already on the base branch does not cover a new source change', () => {
  const result = check({
    files: changedSource,
    baseChangesets: [{ system: 'patch' }],
    changesets: [{ react: 'patch' }],
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /without a release planned for: @xyflow\/system/);
});

test('accepts an automatically calculated dependent release', () => {
  const result = check({ files: changedSource, changesets: [{ system: 'major' }] });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /@xyflow\/react, @xyflow\/system/);
});

test('rejects changed library source without a changeset', () => {
  const result = check({ files: { 'packages/system/src/index.ts': 'changed\n' } });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Could not generate the changeset release plan/);
});

test('accepts an explicitly empty changeset for a PR needing no release', () => {
  const result = check({ files: changedSource, changesets: [{}] });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /empty changeset/);
});

test('an empty changeset does not mask incomplete coverage in a nonempty plan', () => {
  assert.equal(check({ files: changedSource, changesets: [{}, { react: 'patch' }] }).status, 1);
});

test('skips docs, tests, examples, and version-only release PRs', () => {
  const result = check({
    files: {
      'README.md': 'Documentation update.\n',
      'packages/system/src/index.test.ts': 'Test update.\n',
      'packages/system/src/__tests__/helper.ts': 'Test helper.\n',
      'packages/system/src/README.md': 'Documentation update.\n',
      'packages/react/CHANGELOG.md': 'Changelog update.\n',
      'packages/react/package.json': JSON.stringify({ name: '@xyflow/react', version: '1.0.1' }),
      'examples/react/README.md': 'Example update.\n',
    },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /No published library source changes/);
});

test('skips private and ignored packages', () => {
  const files = { 'packages/system/src/index.ts': 'changed\n' };
  assert.equal(check({ files, privateSystem: true }).status, 0);
  assert.equal(check({ files, ignore: ['@xyflow/system'] }).status, 0);
});

test('checks deleted source files', () => {
  const result = check({ files: { 'packages/system/src/index.ts': null }, changesets: [{ react: 'patch' }] });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /@xyflow\/system/);
});

test('checks CSS changes in published source', () => {
  const result = check({ files: { 'packages/react/src/styles.css': '.node { color: red; }\n' }, changesets: [{}] });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /empty changeset/);
});

test('fails when the base ref is missing', () => {
  assert.equal(check({ files: changedSource, baseRef: 'missing-base' }).status, 1);
});

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [baseRef] = process.argv.slice(2);
const changesetCLI = fileURLToPath(new URL('../../node_modules/@changesets/cli/bin.js', import.meta.url));
let temporaryDirectory;

try {
  if (!baseRef) {
    throw new Error('Usage: node check-release-coverage.mjs <base-ref>');
  }

  const changedFiles = execFileSync('git', ['diff', '--name-only', '-z', `${baseRef}...HEAD`, '--', 'packages'], {
    encoding: 'utf8',
  }).split('\0');
  const { ignore = [] } = JSON.parse(readFileSync('.changeset/config.json', 'utf8'));
  const changedPackages = readdirSync('packages', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      changedFiles.some(
        (file) =>
          file.startsWith(`packages/${entry.name}/src/`) &&
          !/\.(test|spec)\.[^/]+$/.test(file) &&
          !/\/__tests__\//.test(file) &&
          !/\.mdx?$/.test(file)
      )
    )
    .map((entry) => JSON.parse(readFileSync(`packages/${entry.name}/package.json`, 'utf8')))
    .filter((pkg) => !pkg.private && !ignore.includes(pkg.name))
    .map((pkg) => pkg.name);

  if (changedPackages.length === 0) {
    console.log('No published library source changes to check.');
  } else {
    temporaryDirectory = mkdtempSync(join(tmpdir(), 'xyflow-release-coverage-'));
    const planPath = join(temporaryDirectory, 'plan.json');
    const result = spawnSync(process.execPath, [changesetCLI, 'status', `--since=${baseRef}`, `--output=${planPath}`], {
      stdio: 'inherit',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('Could not generate the changeset release plan.');

    const plan = JSON.parse(readFileSync(planPath, 'utf8'));
    if (!Array.isArray(plan.changesets) || !Array.isArray(plan.releases)) {
      throw new Error('Invalid changeset release plan.');
    }

    const explicitlyEmpty =
      plan.changesets.length > 0 && plan.changesets.every((change) => change.releases.length === 0);
    if (explicitlyEmpty) {
      console.log('An empty changeset explicitly marks this change as not needing a release.');
    } else {
      const releasedPackages = new Set(
        plan.releases.filter((release) => release.type !== 'none').map((release) => release.name)
      );
      const missing = changedPackages.filter((name) => !releasedPackages.has(name));
      if (missing.length) {
        throw new Error(
          `Library source changed without a release planned for: ${missing.join(', ')}. Add these packages to a changeset. If the entire PR needs no release, use an empty changeset instead.`
        );
      }
      console.log(`Release coverage checked for: ${changedPackages.join(', ')}.`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
}

import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(packageRoot, 'dist');

async function exists(file) {
	try {
		await access(file);
		return true;
	} catch {
		return false;
	}
}

async function updateDeclarationMap(file) {
	const map = JSON.parse(await readFile(file, 'utf8'));

	if (!Array.isArray(map.sources)) {
		return false;
	}

	const sources = await Promise.all(
		map.sources.map(async (source) => {
			if (!source.endsWith('.svelte.ts')) {
				return source;
			}

			const svelteSource = source.slice(0, -3);
			const sourcePath = resolve(dirname(file), svelteSource);

			return (await exists(sourcePath)) ? svelteSource : source;
		})
	);

	if (sources.every((source, index) => source === map.sources[index])) {
		return false;
	}

	map.sources = sources;
	await writeFile(file, JSON.stringify(map), 'utf8');

	return true;
}

async function walk(dir) {
	let fixed = 0;

	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const file = join(dir, entry.name);

		if (entry.isDirectory()) {
			fixed += await walk(file);
		} else if (entry.name.endsWith('.svelte.d.ts.map') && (await updateDeclarationMap(file))) {
			fixed += 1;
		}
	}

	return fixed;
}

const fixed = await walk(distDir);

if (fixed > 0) {
	console.log(`Fixed ${fixed} Svelte declaration map${fixed === 1 ? '' : 's'}`);
}

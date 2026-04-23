import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { bundle } from 'lightningcss';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';

import { resolve, basename } from 'node:path';
import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const postcssRename = require('postcss-rename');

function unfurlCssPlugin(lib: string) {
	const entries = ['src/lib/base.css', 'src/lib/style.css'];
	const processor = postcss([
		postcssNested,
		postcssRename({ strategy: (name: string) => name.replace('xy', lib) })
	]);

	return {
		name: 'xy-css',
		async writeBundle() {
			await mkdir('dist', { recursive: true });

			for (const entry of entries) {
				const { code } = bundle({ filename: resolve(entry) });
				const result = await processor.process(code, { from: resolve(entry) });
				await writeFile(resolve('dist', basename(entry)), result.css);
			}
		}
	};
}

export default defineConfig({
	plugins: [unfurlCssPlugin('svelte'), sveltekit()]
});

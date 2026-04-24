import { Addon } from '@embroider/addon-dev/rollup';
import { babel } from '@rollup/plugin-babel';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import copy from 'rollup-plugin-copy';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

function resolveJsSourceImports() {
  return {
    name: 'resolve-js-source-imports',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !source.endsWith('.js')) {
        return null;
      }

      let sourceBase = resolve(dirname(importer), source.slice(0, -3));

      for (let extension of ['.ts', '.gts', '.gjs', '.js']) {
        let candidate = `${sourceBase}${extension}`;

        if (existsSync(candidate)) {
          return candidate;
        }
      }

      return null;
    },
  };
}

export default {
  output: addon.output(),

  plugins: [
    resolveJsSourceImports(),
    addon.publicEntrypoints(['index.ts', 'components.ts', 'types.ts']),
    addon.appReexports([]),
    addon.dependencies(),
    addon.hbs(),
    addon.gjs(),
    addon.keepAssets(['**/*.css']),
    addon.clean({ runOnce: true }),
    copy({
      targets: [{ src: './dist/*.css', dest: './dist' }],
      hook: 'generateBundle',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.gjs', '.ts', '.gts'],
    }),
  ],
};

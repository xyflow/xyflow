import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  external: ['solid-js'],
  plugins: [
    typescript(),
    nodeResolve(),
    postcss({
      extract: true, // Extracts CSS to a separate file
      modules: true, // Enables CSS Modules
      // use: ['sass']   // Enables SASS/SCSS if needed
    }),
    babel({
      extensions: ['.ts', '.tsx', '.css'],
      babelHelpers: 'bundled',
      presets: ['solid', '@babel/preset-typescript'],
      exclude: [/node_modules\//],
    }),
  ],
};

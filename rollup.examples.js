import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';

import libraryRollupConfig from './rollup.config.js';

const production = !process.env.ROLLUP_WATCH;
const testing = process.env.NODE_ENV === 'testing';

const rollupConfig = {
  input: ['example/src/index.js'],
  output: [
    {
      dir: 'example/public/dist',
      format: 'iife',
      sourcemap: !production,
    },
  ],
  plugins: [
    postcss({
      modules: false,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
        '@babel/preset-react',
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    replace({
      'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
      'process.env.FORCE_SIMILAR_INSTEAD_OF_MAP': 'false',
    }),
    resolve(),
    commonjs(),
    serve({
      open: !testing,
      port: 3000,
      contentBase: 'example/public/',
      historyApiFallback: true,
    }),
    !testing && livereload(),
  ],
};

export default testing ? rollupConfig : [libraryRollupConfig, rollupConfig];

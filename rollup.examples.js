import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

import { baseConfig } from './rollup.config.js';

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';

const serveFiles = !isProd || isTesting;
const doLiveReload = !isProd && !isTesting;

const rollupExamplesConfig = {
  input: 'example/src/index.js',
  output: [
    {
      dir: 'example/public/dist',
      format: 'iife',
      sourcemap: !isProd,
    },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development'),
      'process.env.FORCE_SIMILAR_INSTEAD_OF_MAP': false,
    }),
    postcss({
      modules: false,
    }),
    alias({
      entries: [{ find: 'react-flow-renderer', replacement: path.resolve(__dirname, 'dist', 'ReactFlow.esm.js') }],
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    serveFiles &&
      serve({
        open: true,
        port: 3000,
        contentBase: 'example/public/',
        historyApiFallback: true,
      }),
    doLiveReload && livereload(),
  ],
};

export default isTesting ? rollupExamplesConfig : [baseConfig(), rollupExamplesConfig];

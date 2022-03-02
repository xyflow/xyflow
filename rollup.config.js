import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from '@babel/core';
import { visualizer } from 'rollup-plugin-visualizer';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const processEnv = isProd || isTesting ? 'production' : 'development';

export const baseConfig = ({ outputFile = pkg.module, injectCSS = true } = {}) => ({
  input: 'src/index.ts',
  external: [
    'react',
    'react-dom',
    'classcat',
    'd3-selection',
    'd3-zoom',
    'react-draggable',
    'zustand',
    'zustand/shallow',
    'zustand/context',
    (id) => id.includes('@babel/runtime'),
  ],
  onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      rollupWarn(warning);
    }
  },
  output: {
    file: outputFile,
    format: 'esm',
    sourcemap: true,
    exports: 'named',
  },

  plugins: [
    alias({
      entries: [{ find: 'd3-color', replacement: __dirname + '/src/d3-color-alias' }],
    }),
    replace({
      __ENV__: JSON.stringify(processEnv),
      __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
      preventAssignment: true,
    }),
    bundleSize(),
    postcss({
      minimize: isProd,
      inject: injectCSS,
    }),
    svgr(),
    resolve(),
    typescript({
      clean: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      extensions: [...DEFAULT_BABEL_EXTENSIONS, '.ts', '.tsx'],
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    visualizer(),
  ],
});

export default isProd && !isTesting
  ? [
      baseConfig(),
      baseConfig({
        outputFile: 'dist/nocss/ReactFlow-nocss.js',
        injectCSS: false,
      }),
    ]
  : baseConfig();

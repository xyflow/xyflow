import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from '@babel/core';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'test';
const processEnv = isProd || isTesting ? 'production' : 'development';

const defaultOutputOptions = {
  dir: 'dist/esm',
  format: 'esm',
  sourcemap: true,
};

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  classcat: 'cc',
  'd3-selection': 'd3',
  'd3-zoom': 'd3',
  zustand: 'zustand',
  'zustand/shallow': 'zustandShallow',
  'zustand/context': 'zustandContext',
};

export const baseConfig = ({ outputOptions = {}, injectCSS = true } = {}) => {
  const output = {
    ...defaultOutputOptions,
    ...outputOptions,
  };

  const isEsm = output.format === 'esm';
  const replaceOptions = isEsm ? {} : { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) };

  return {
    input: isEsm
      ? [
          'src/index.ts',
          'src/additional-components/Controls/index.tsx',
          'src/additional-components/Background/index.tsx',
          'src/additional-components/MiniMap/index.tsx',
          'src/hooks/useReactFlow.ts',
          'src/hooks/useNodes.ts',
          'src/hooks/useEdges.ts',
          'src/hooks/useViewport.ts',
          'src/hooks/useUpdateNodeInternals.ts',
        ]
      : 'src/index.ts',
    external: isEsm
      ? [
          'react',
          'react-dom',
          'classcat',
          'd3-selection',
          'd3-zoom',
          'd3-drag',
          'zustand',
          'zustand/shallow',
          'zustand/context',
          (id) => id.includes('@babel/runtime'),
        ]
      : ['react', 'react-dom'],
    onwarn(warning, rollupWarn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        rollupWarn(warning);
      }
    },
    output,

    plugins: [
      replace({
        __ENV__: JSON.stringify(processEnv),
        __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
        __INJECT_STYLES__: injectCSS,
        preventAssignment: true,
        ...replaceOptions,
      }),
      postcss({
        minimize: isProd,
        inject: false,
      }),
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
      !isEsm && terser(),
    ],
  };
};

export default isProd && !isTesting
  ? [
      // esm build
      baseConfig(),
      // umd build
      baseConfig({
        outputOptions: {
          dir: 'dist/umd',
          format: 'umd',
          exports: 'named',
          name: 'ReactFlow',
          globals,
        },
      }),
      // nocsss esm build
      baseConfig({
        outputOptions: {
          dir: 'dist/nocss/esm',
        },
        injectCSS: false,
      }),
      // nocsss umd build
      baseConfig({
        outputOptions: {
          dir: 'dist/nocss/umd',
          format: 'umd',
          exports: 'named',
          name: 'ReactFlow',
          globals,
        },

        injectCSS: false,
      }),
    ]
  : baseConfig();

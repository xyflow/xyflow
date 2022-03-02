import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from '@babel/core';
import { visualizer } from 'rollup-plugin-visualizer';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const processEnv = isProd || isTesting ? 'production' : 'development';

export const baseConfig = ({ outputDir = 'dist/esm', injectCSS = true } = {}) => ({
  input: [
    'src/index.ts',
    'src/additional-components/Controls/index.tsx',
    'src/additional-components/Background/index.tsx',
    'src/additional-components/MiniMap/index.tsx',
    'src/hooks/useReactFlow.ts',
    'src/hooks/useNodes.ts',
    'src/hooks/useEdges.ts',
    'src/hooks/useViewport.ts',
    'src/hooks/useUpdateNodeInternals.ts',
  ],
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
    dir: outputDir,
    format: 'esm',
    sourcemap: true,
  },

  plugins: [
    replace({
      __ENV__: JSON.stringify(processEnv),
      __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
      __INJECT_STYLES__: injectCSS,
      preventAssignment: true,
    }),
    postcss({
      minimize: isProd,
      inject: false,
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
        outputDir: 'dist/nocss',
        injectCSS: false,
      }),
    ]
  : baseConfig();

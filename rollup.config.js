import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import replace from '@rollup/plugin-replace';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const processEnv = isProd ? 'production' : 'development';

const baseConfig = ({ mainFile = pkg.main, moduleFile = pkg.module, extractCss = false } = {}) => ({
  input: 'src/index.ts',
  external: ['react', 'react-dom', /@babel\/runtime/],
  onwarn(warning, rollupWarn) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      rollupWarn(warning);
    }
  },
  output: [
    {
      file: mainFile,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: moduleFile,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    replace({
      __ENV__: JSON.stringify(processEnv),
      __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
      // this comes from the easy-peasy dependency 'memoizerific'
      'process.env.FORCE_SIMILAR_INSTEAD_OF_MAP': JSON.stringify('true'),
    }),
    bundleSize(),
    postcss({
      minimize: isProd,
      extract: extractCss,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    svgr(),
    typescript({
      clean: true,
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
});

export default isProd
  ? [
      baseConfig(),
      baseConfig({
        mainFile: 'dist/nocss/ReactFlow-nocss.js',
        moduleFile: 'dist/nocss/ReactFlow-nocss.esm.js',
        extractCss: path.resolve('dist/nocss/style.css'),
      }),
    ]
  : baseConfig();

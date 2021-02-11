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
const isTesting = process.env.NODE_ENV === 'testing';
const processEnv = isProd || isTesting ? 'production' : 'development';

export const baseConfig = ({ mainFile = pkg.main, moduleFile = pkg.module, injectCSS = true } = {}) => ({
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
      // this comes from the easy-peasy dependency
      'process.env.FORCE_SIMILAR_INSTEAD_OF_MAP': false,
    }),
    bundleSize(),
    postcss({
      minimize: isProd,
      inject: injectCSS,
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

export default isProd && !isTesting
  ? [
      baseConfig(),
      baseConfig({
        mainFile: 'dist/nocss/ReactFlow-nocss.js',
        moduleFile: 'dist/nocss/ReactFlow-nocss.esm.js',
        injectCSS: false,
      }),
    ]
  : baseConfig();

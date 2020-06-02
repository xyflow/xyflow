import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import bundleSize from 'rollup-plugin-bundle-size';
import replace from 'rollup-plugin-replace';
import svgr from '@svgr/rollup';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const processEnv = isProd ? 'production' : 'development';

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'react-dom'],
    onwarn(warning, rollupWarn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        rollupWarn(warning);
      }
    },
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      bundleSize(),
      postcss({
        minimize: isProd,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(processEnv),
        __REACT_FLOW_VERSION__: JSON.stringify(pkg.version),
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
  },
];

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { defineConfig } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';

const pkg = JSON.parse(readFileSync(resolve(cwd(), './package.json')));
const isProd = process.env.NODE_ENV === 'production';

const defaultPlugins = [
  resolvePlugin(),
  commonjs({
    include: /node_modules/,
  }),
];

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

const defineEsmConfig = (format) =>
  defineConfig({
    input: pkg.source,
    output: {
      file: format === 'js' ? pkg.module : pkg.module.replace('.js', '.mjs'),
      format: 'esm',
      banner: pkg.rollup?.vanilla ? undefined : '"use client"',
    },
    onwarn,
    plugins: [
      peerDepsExternal({
        includeDependencies: true,
      }),
      ...defaultPlugins,
      typescript(),
    ],
  });

const reactGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
};

const globals = {
  ...(pkg.rollup?.vanilla ? {} : reactGlobals),
  ...(pkg.rollup?.globals || {}),
};

const esmMjsConfig = defineEsmConfig('mjs');
const esmJsConfig = defineEsmConfig('js');

const umdConfig = defineConfig({
  input: pkg.source,
  output: {
    file: pkg.main,
    format: 'umd',
    exports: 'named',
    name: pkg.rollup?.name || 'ReactFlow',
    globals,
  },
  onwarn,
  plugins: [
    peerDepsExternal(),
    ...defaultPlugins,
    typescript(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    terser(),
  ],
});

// Electrical components config (if electrical-components exist)
const electricalEntries = pkg.rollup?.additionalEntries || [];
const electricalConfigs = electricalEntries.flatMap((entry) => {
  const esmElectricalConfig = defineConfig({
    input: entry.input,
    output: {
      file: entry.esm,
      format: 'esm',
      banner: pkg.rollup?.vanilla ? undefined : '"use client"',
    },
    external: ['@xyflow/react', '@xyflow/system', 'react', 'react-dom', 'react/jsx-runtime'],
    onwarn,
    plugins: [
      peerDepsExternal({
        includeDependencies: true,
      }),
      ...defaultPlugins,
      typescript(),
    ],
  });

  const umdElectricalConfig = defineConfig({
    input: entry.input,
    output: {
      file: entry.umd,
      format: 'umd',
      exports: 'named',
      name: entry.name || 'ReactFlowElectrical',
      globals: {
        ...globals,
        '@xyflow/react': 'ReactFlow',
        '@xyflow/system': 'XYFlowSystem',
      },
    },
    external: ['@xyflow/react', '@xyflow/system', 'react', 'react-dom', 'react/jsx-runtime'],
    onwarn,
    plugins: [
      peerDepsExternal(),
      ...defaultPlugins,
      typescript(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      terser(),
    ],
  });

  return isProd ? [esmElectricalConfig, umdElectricalConfig] : [esmElectricalConfig];
});

export default isProd
  ? [esmMjsConfig, esmJsConfig, umdConfig, ...electricalConfigs]
  : [esmJsConfig, esmMjsConfig, ...electricalConfigs];

import fs from 'fs';
import path from 'path';
import { defineConfig } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')));

const defaultPlugins = [
  resolvePlugin(),
  commonjs({
    include: /node_modules/,
  }),
  typescript({ compilerOptions: { jsx: 'preserve' } }),
];

const reactVersion = pkg.peerDependencies?.react;
if (reactVersion) {
  const target = reactVersion?.replaceAll(/\W+/g, '');

  defaultPlugins.unshift(
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx'],
      include: 'src/**/*',
      plugins: [
        [
          'babel-plugin-react-compiler',
          {
            target,
            // Fail the build on any compiler diagnostic
            panicThreshold: 'all_errors',
            environment: {
              validateNoDerivedComputationsInEffects: true,
              validateNoImpureFunctionsInRender: true,
              enableJsxOutlining: true,
            },
          },
        ],
      ],
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    })
  );
}

const onwarn = (warning, rollupWarn) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    rollupWarn(warning);
  }
};

const esmConfig = defineConfig({
  input: pkg.source,
  output: {
    file: pkg.module,
    format: 'esm',
    banner: pkg.rollup.vanilla ? undefined : '"use client"',
  },
  onwarn,
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    ...defaultPlugins,
  ],
});

const reactGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'jsxRuntime',
};

const globals = {
  ...(pkg.rollup.vanilla ? {} : reactGlobals),
  ...pkg.rollup.globals,
};

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
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    terser(),
  ],
});

export default process.env.NODE_ENV === 'production' ? [esmConfig, umdConfig] : esmConfig;

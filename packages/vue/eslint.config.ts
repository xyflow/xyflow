import antfu from '@antfu/eslint-config';

// Vue Flow uses antfu's flat config (semicolons + single quotes, antfu's native stylistic formatter — no
// prettier). `@xyflow/eslint` only ships react/svelte configs, so the vue package brings antfu directly.
// The config package has no vue/ts source of its own, so `vue`/`typescript` are enabled explicitly rather
// than left to antfu's package auto-detection.
export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  rules: {
    'curly': ['error', 'all'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    // build-time-replaced `process.env.*` reads — `process` is fine as a global here
    'node/prefer-global/process': 'off',
    // the codebase intentionally uses `Function`, empty interfaces (extension points like `NodeProps`), etc.
    'ts/no-empty-object-type': 'off',
    'ts/no-unsafe-function-type': 'off',
    'ts/no-wrapper-object-types': 'off',
    // misfires on the documented overloaded composables (useNodesData/useEdgesData): the shared JSDoc
    // block sits above the first overload, so `@param guard` reads as "not matching" a parameter
    'jsdoc/check-param-names': 'off',
    // antfu auto-enables this in the xyflow monorepo because it has a pnpm catalog; the vue package pins its
    // own (mostly vue-only) deps for now rather than bloating the shared catalog — revisit alongside tsdown
    'pnpm/json-enforce-catalog': 'off',
  },
});

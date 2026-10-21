import { fixupPluginRules } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

import base from './base.js';

// eslint-plugin-react 7 still calls context.getFilename(), which ESLint 10 removed.
const reactPlugin = fixupPluginRules(react);

export default defineConfig(base, {
  name: '@xyflow/eslint/react',
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    react: reactPlugin,
  },
  extends: [reactHooks.configs.flat['recommended-latest']],
  languageOptions: react.configs.flat.recommended.languageOptions,
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...react.configs.flat.recommended.rules,
    ...react.configs.flat['jsx-runtime'].rules,
    // Props are typed with TypeScript.
    'react/prop-types': 'off',
    'react/forward-ref-uses-ref': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/no-object-type-as-default-prop': 'error',
    'react/no-unstable-nested-components': 'error',
  },
});

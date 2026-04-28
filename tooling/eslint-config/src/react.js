import { fixupPluginRules } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import base from './base.js';

const reactPlugin = fixupPluginRules(react);

export default defineConfig(
  base,

  {
    name: '@xyflow/eslint/react',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parserOptions: {
        ...react.configs.flat.recommended.languageOptions?.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [reactHooks.configs.flat.recommended],
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      // TODO: possibly enable some of these
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
    },
  }
);

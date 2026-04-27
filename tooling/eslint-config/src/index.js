const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');
const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const turbo = require('eslint-config-turbo/flat');
const react = require('eslint-plugin-react');
const { defineConfig } = require('eslint/config');
const globals = require('globals');
const ts = require('typescript-eslint');

const reactPlugin = fixupPluginRules(react);
const turboConfig = fixupConfigRules(turbo.default ?? turbo);

module.exports = defineConfig(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: react.configs.flat.recommended.languageOptions,
    rules: react.configs.flat.recommended.rules,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: react.configs.flat['jsx-runtime'].languageOptions,
    rules: react.configs.flat['jsx-runtime'].rules,
  },
  ...turboConfig,
  prettier,
  {
    files: ['**/*.{js,jsx,ts,tsx,cts,mts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
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
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      // typescript-eslint strongly recommends disabling no-undef for TypeScript projects.
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    },
  }
);

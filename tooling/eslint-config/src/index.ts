import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import tseslint, { type Config } from 'typescript-eslint';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import eslintConfigTurbo from 'eslint-config-turbo/flat';

const config = tseslint.config(
  // Ignore files in .gitignore
  includeIgnoreFile(path.resolve('..', '..', '.gitignore')),
  { ignores: ['**/next-env.d.ts', '**/vite-env.d.ts'] },
  // Rules for all files
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginReact.configs.flat.recommended,
      eslintPluginReact.configs.flat['jsx-runtime'],
      eslintConfigTurbo,
      eslintConfigPrettier,
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_', // allow underscores in destructuring
        },
      ],
    },
  },
  // Rules for TypeScript files
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    },
  }
) satisfies Config;

export default config;

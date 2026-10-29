import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import turbo from 'eslint-config-turbo/flat';

export default defineConfig(
  globalIgnores(['**/.turbo/**', '**/dist/**', '**/build/**', '**/node_modules/**', '**/.next/**', '**/next-env.d.ts']),

  {
    name: '@xyflow/eslint/base',
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked, ...turbo, prettier],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
      },
    },
  },

  {
    name: '@xyflow/eslint/base/js-files',
    files: ['**/*.{js,jsx,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  }
);

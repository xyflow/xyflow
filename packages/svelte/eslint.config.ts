import eslintXyConfig from '@xyflow/eslint-config';
import { plugin as tsPlugin } from 'typescript-eslint';
import * as eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
  ...eslintXyConfig,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.ts']
        }
      }
    }
  }
];

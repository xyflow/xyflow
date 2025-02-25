import eslintConfigXy from '@xyflow/eslint-config';
import { plugin as eslintPluginTs } from 'typescript-eslint';
import * as eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
  ...eslintConfigXy,
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    files: ['**/*.svelte'],
    plugins: {
      '@typescript-eslint': eslintPluginTs
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

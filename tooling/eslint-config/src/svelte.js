import prettier from 'eslint-config-prettier';
import fs from 'node:fs';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

const rootGitignorePath = path.resolve(import.meta.dirname, '../../../.gitignore');
const packageGitignorePath = path.resolve(process.cwd(), '.gitignore');

export default function createSvelteConfig({ svelteConfig } = {}) {
  return defineConfig(
    includeIgnoreFile(rootGitignorePath),
    ...(fs.existsSync(packageGitignorePath) ? [includeIgnoreFile(packageGitignorePath)] : []),
    js.configs.recommended,
    ts.configs.recommended,
    svelte.configs.recommended,
    prettier,
    svelte.configs.prettier,
    {
      languageOptions: { globals: { ...globals.browser, ...globals.node } },
      rules: {
        // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
        // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        'no-undef': 'off',
      },
    },
    {
      files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          extraFileExtensions: ['.svelte'],
          parser: ts.parser,
          svelteConfig,
        },
      },
    },
    {
      // Override or add rule settings here, such as:
      // 'svelte/button-has-type': 'error'
      rules: {},
    }
  );
}

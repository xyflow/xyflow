import { defineConfig } from 'eslint/config';
import config from '@xyflow/eslint/react';

export default defineConfig(config, {
  rules: {
    // TODO: re-enable this rule
    '@typescript-eslint/consistent-type-imports': 'off',
  },
});

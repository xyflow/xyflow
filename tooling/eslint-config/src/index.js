module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'prettier',
  ],
  plugins: ['unicorn'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'unicorn/no-useless-promise-resolve-reject': 'error'
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx,cts,mts}'],
      parserOptions: {
        projectService: true,
      },
      rules: {
        '@typescript-eslint/no-deprecated': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      },
    },
  ],
};

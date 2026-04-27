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
  plugins: ['react', '@typescript-eslint'],
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
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-restricted-imports': [
      'error',
      {
        name: 'react',
        importNames: ['memo', 'useCallback', 'useMemo'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_', // allow underscores in destructuring
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx,cts,mts}'],
      parserOptions: {
        projectService: true,
      },
      rules: {
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      },
    },
  ],
};

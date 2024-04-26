module.exports = {
  root: true,
  // extends: ['@xyflow/eslint-config'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:solid/recommended'],
  rules: {
    'solid/no-react-specific-props': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};

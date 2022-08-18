module.exports = {
  presets: [
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};

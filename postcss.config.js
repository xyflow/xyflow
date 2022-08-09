module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-combine-duplicated-selectors'),
    require('autoprefixer'),
    require('postcss-import'),
  ],
};

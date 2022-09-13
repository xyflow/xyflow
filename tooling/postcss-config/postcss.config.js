module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-combine-duplicated-selectors'),
    require('autoprefixer'),
  ],
};

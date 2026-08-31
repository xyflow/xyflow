require('dotenv').config();

const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCombine = require('postcss-combine-duplicated-selectors');
const postcssRename = require('postcss-rename');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = (ctx) => {
  return {
    plugins: [
      postcssImport,
      postcssNested,
      postcssCombine,
      postcssRename({
        // only the `xy-flow` namespace is swapped, so theme helper classes like `xy-theme__button`
        // keep the same name in every library
        strategy: (className) =>
          className.startsWith('xy-flow') ? className.replace('xy-flow', `${process.env.LIB}-flow`) : className,
      }),
      autoprefixer,
      ctx.env === 'production' && cssnano,
    ],
  };
};

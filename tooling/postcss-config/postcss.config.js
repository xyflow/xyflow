const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCombine = require('postcss-combine-duplicated-selectors');
const postcssRename = require('postcss-rename');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = (ctx) => {
  // we pass the current lib (react or svelte) and the environment as an env param.
  // When postcss is being used for the svelte examples, we are using this config,
  // but we can't pass a custom env. That's why we need this little workaround.
  const ctxEnv = ctx.env === 'development' ? 'svelte_development' : ctx.env;
  const [lib, env] = ctxEnv.split('_');

  return {
    plugins: [
      postcssImport,
      postcssNested,
      postcssCombine,
      postcssRename({
        strategy: (className) => className.replace('xy', lib),
      }),
      autoprefixer,
      env === 'production' && cssnano,
    ],
  };
};

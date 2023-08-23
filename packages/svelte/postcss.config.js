import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssCombine from 'postcss-combine-duplicated-selectors';
import postcssRename from 'postcss-rename';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssImport,
    postcssNested,
    postcssCombine,
    postcssRename({
      strategy: (className) => className.replace('xy', 'svelte')
    }),
    autoprefixer
  ]
};

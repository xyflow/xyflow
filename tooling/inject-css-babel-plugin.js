const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');

function getStyleInject(cssString) {
  return `
  (function(css) {
    if (!css || typeof document === 'undefined') return;

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
  
    head.appendChild(style);
  
    style.appendChild(document.createTextNode(css));
  })("${cssString}")
  `;
}

module.exports = function (babel) {
  return {
    name: 'inject-css-babel-plugin',
    visitor: {
      ImportDeclaration(item, state) {
        if (!item.node.source.value.includes('.css')) {
          return;
        }

        const importFilePath = path.resolve(
          state.file.opts.filename,
          '..',
          item.node.source.value
        );

        const css = fs.readFileSync(importFilePath).toString();
        const result = postcss([autoprefixer, nested]).process(css);
        const minified = result.css.replace(/\n/g, '');

        item.replaceWithSourceString(getStyleInject(minified));
      },
    },
  };
};

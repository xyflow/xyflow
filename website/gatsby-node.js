const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const docsGenerator = require('./generators/docs');
const exampleGenerator = require('./generators/examples');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const generateDocs = docsGenerator(createPage, graphql);
  const generateExamples = exampleGenerator(createPage, graphql);

  return Promise.all([generateDocs, generateExamples]);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }
};

exports.onCreateWebpackConfig = ({ stage, actions, loaders }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        'example-flows': path.resolve(__dirname, 'src', 'example-flows'),
      },
    },
    devServer: {
      host: '0.0.0.0',
    },
  });
};

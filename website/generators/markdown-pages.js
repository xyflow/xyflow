const path = require('path');
const utils = require('./utils');

const defaultTemplate = path.resolve('./src/templates/default-page.js');

const mdQuery = `
  {
    pages: allMdx {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            published
          }
        }
      }
    }
  }
`;

const filterSpecialPages = (mdPage) => {
  const slug = mdPage.node.fields.slug;
  return slug.indexOf('/blog') !== 0 && slug.indexOf('/projects') !== 0;
};

const createMdPages = (createPage, mdPages) => {
  mdPages
    .filter(filterSpecialPages)
    .filter(utils.filterPublished)
    .forEach((mdPage) => {
      createPage({
        path: mdPage.node.fields.slug,
        component: defaultTemplate,
        context: {
          slug: mdPage.node.fields.slug,
          fields: mdPage.node.fields,
        },
      });
    });
};

const mdPagesGenerator = (createPage, graphql) =>
  new Promise((resolve, reject) => {
    resolve(
      graphql(mdQuery).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const mdPages = result.data.pages.edges;
        try {
          createMdPages(createPage, mdPages);
        } catch (e) {
          console.log(e);
        }
      })
    );
  });

module.exports = mdPagesGenerator;

const path = require('path');

const docsTemplate = path.resolve('./src/templates/doc-page.js');

const docPagesQuery = `
  {
    docs: allMdx(
      filter: {
        fields: {
          slug: { regex: "/docs/" },
        }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;

const createDocPages = (createPage, docPages) => {
  const menu = docPages.map((page) => ({
    slug: page.node.fields.slug,
    title: page.node.frontmatter.title,
  }));

  docPages.forEach((page) => {
    createPage({
      path: page.node.fields.slug,
      component: docsTemplate,
      context: {
        slug: page.node.fields.slug,
        menu,
      },
    });
  });
};

const blogGenerator = (createPage, graphql) =>
  new Promise((resolve, reject) => {
    resolve(
      graphql(docPagesQuery).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        const docPages = result.data.docs.edges;

        try {
          createDocPages(createPage, docPages);
        } catch (e) {
          console.log(e);
        }
      })
    );
  });

module.exports = blogGenerator;

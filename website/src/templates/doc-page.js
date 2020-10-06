import React from 'react';
import { graphql } from 'gatsby';

import DocPage from 'components/Page/Doc';
import Mdx from './mdx-renderer/DocMdx';
import { H1 } from 'components/Typo';

const docsMenu = [
  { title: 'Introduction' },
  { title: 'Getting Started' },
  {
    group: 'API Reference',
    items: [
      { title: 'Prop Types' },
      { title: 'Helper Functions' },
      {
        group: 'Nodes',
        items: [
          { title: 'Node Options' },
          { title: 'Node Types & Custom Nodes' },
          { title: 'Handle Component' },
        ],
      },
      {
        group: 'Edges',
        items: [
          { title: 'Edge Options' },
          { title: 'Edge Types & Custom Edges' },
          { title: 'Edge Utils' },
        ],
      },
      { title: 'Instance' },
      { title: 'Internal State and Actions' },
      {
        group: 'Components',
        items: [
          { title: 'Background' },
          { title: 'Mini Map' },
          { title: 'Controls' },
          { title: 'Provider' },
        ],
      },
    ],
  },
];

function extendMenu(items, menuData) {
  items.forEach((menuItem) => {
    if (menuItem.group) {
      return extendMenu(menuItem.items, menuData);
    }

    menuItem.slug =
      menuData.find((m) => m.title === menuItem.title)?.slug || '/';
  });
}

const DocPageTemplate = ({ data, pageContext }) => {
  const { content } = data;
  const { title } = content.frontmatter;

  const metaTags = {
    title: `React Flow - ${title} Docs`,
    description: content.excerpt,
    siteUrl: `https://reactflow.dev${content.fields.slug}`,
    robots: 'index, follow',
  };

  extendMenu(docsMenu, pageContext.menu);

  return (
    <DocPage metaTags={metaTags} menu={docsMenu}>
      <H1>{title}</H1>
      <Mdx content={content.body} />
    </DocPage>
  );
};

export default DocPageTemplate;

export const pageQuery = graphql`
  query DocPageBySlug($slug: String!) {
    content: mdx(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      body
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;

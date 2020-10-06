import { useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

export default function useFeaturedProjects() {
  const rawData = useStaticQuery(graphql`
    query ExamplePages {
      allJavascriptFrontmatter {
        edges {
          node {
            frontmatter {
              title
              slug
              order
            }
          }
        }
      }
    }
  `);

  const data = useMemo(() => {
    return rawData.allJavascriptFrontmatter.edges
      .sort((a, b) => {
        return a.node.frontmatter.order - b.node.frontmatter.order;
      })
      .map(({ node }) => ({
        slug: `/examples/${node.frontmatter.slug}`,
        title: node.frontmatter.title,
      }));
  }, [rawData]);

  return data;
}

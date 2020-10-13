import { useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

export default function useFeaturedProjects() {
  const rawData = useStaticQuery(graphql`
    query ExamplePages {
      allExamplesJson {
        edges {
          node {
            title
            slug
          }
        }
      }
    }
  `);

  const data = useMemo(() => {
    return rawData.allExamplesJson.edges.map(({ node }) => ({
      slug: `/${node.slug}`,
      title: node.title,
    }));
  }, [rawData]);

  return data;
}

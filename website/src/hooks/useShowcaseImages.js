import { useMemo } from 'react';
import { useStaticQuery, graphql } from 'gatsby';

export default function useFeaturedProjects() {
  const rawData = useStaticQuery(graphql`
    query ShowcaseImages {
      allShowcasesJson {
        edges {
          node {
            title
            url
            image {
              childImageSharp {
                fluid(maxWidth: 550, quality: 80, toFormat: JPG) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  `);

  const images = useMemo(
    () => rawData.allShowcasesJson.edges.map(({ node }) => node),
    [rawData]
  );

  return images;
}

import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';
import Img from 'gatsby-image';

import CenterContent from 'components/CenterContent';
import useShowcaseImages from 'hooks/useShowcaseImages';
import { H4 } from 'components/Typo';
import { getThemeColor } from 'utils/css-utils';

const gridPadding = 2;

const RoundImage = styled(Img)`
  border-radius: 4px;
`;

const Title = styled(H4)`
  color: ${getThemeColor('textInverted')};
  margin: 16px 0 0 0;
  font-weight: 400;
`;

const Link = styled.a`
  &&& {
    color: ${getThemeColor('silverDarken15')};

    &:hover {
      color: ${getThemeColor('silverLighten15')};
    }
  }
`;

const Showcases = () => {
  const showcases = useShowcaseImages();

  return (
    <CenterContent>
      <Flex marginX={-gridPadding}>
        {showcases.map((showcase) => (
          <Box key={showcase.title} width={1 / 3} px={gridPadding}>
            <RoundImage fluid={showcase.image.childImageSharp.fluid} />
            <Title>{showcase.title}</Title>
            <Link href={showcase.url} target="_blank" rel="noopener noreferrer">
              {showcase.url}
            </Link>
          </Box>
        ))}
      </Flex>
    </CenterContent>
  );
};

export default Showcases;

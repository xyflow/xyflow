import React from 'react';
import styled from '@emotion/styled';
import { Flex, Box } from 'reflexbox';
import Img from 'gatsby-image';

import CenterContent from 'components/CenterContent';
import useShowcaseImages from 'hooks/useShowcaseImages';
import { H4, Text } from 'components/Typo';
import { getThemeColor } from 'utils/css-utils';
import reactFlowIconSrc from 'assets/images/react-flow-logo.svg';

const gridPadding = 2;

const RoundImage = styled(Img)`
  border-radius: 4px;
  height: 250px;
  transition: transform 200ms ease;
`;

const EmptyCase = styled(Box)`
  border-radius: 4px;
  height: 250px;
  background: ${(p) => p.theme.colors.silverLighten60};
  display: flex;
  justify-content: center;
  align-items: center;
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

      ${RoundImage} {
        transform: scale(1.025);
      }
    }
  }
`;

const Showcases = () => {
  const showcases = useShowcaseImages();
  const emptyShowCases = [...Array(3 - showcases.length).keys()];

  return (
    <CenterContent>
      <Flex marginX={[0, 0, -gridPadding]} flexWrap="wrap">
        {showcases.map((showcase) => (
          <Box
            key={showcase.title}
            width={[1, 1, 1 / 3]}
            px={[0, 0, gridPadding]}
            mb={[3, 3, 0]}
          >
            <Link href={showcase.url} target="_blank" rel="noopener noreferrer">
              <RoundImage fluid={showcase.image.childImageSharp.fluid} />
              <Title>{showcase.title}</Title>

              {showcase.url}
            </Link>
          </Box>
        ))}
        {emptyShowCases.map((index) => (
          <Box
            key={index}
            width={[1, 1, 1 / 3]}
            px={[0, 0, gridPadding]}
            mb={[3, 3, 0]}
          >
            <EmptyCase>
              <img src={reactFlowIconSrc} alt="react flow logo" />
            </EmptyCase>
            <Title>Your Project here</Title>
            <Text color="silverDarken15">
              Let us know if you made something with React Flow.
            </Text>
          </Box>
        ))}
      </Flex>
    </CenterContent>
  );
};

export default Showcases;

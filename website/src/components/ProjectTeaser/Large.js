import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'reflexbox';
import { Link } from 'gatsby';
import Img from 'gatsby-image';

import { H2, H4, TextLight } from 'components/Typo';
import { getThemeColor, getThemeSpacePx, device } from 'utils/css-utils';

const Teaser = styled(Box)`
  position: relative;

  .gatsby-image-wrapper {
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  &:hover {
    .gatsby-image-wrapper {
      transform-origin: center center;
      transform: scale(1.025);
      box-shadow: 0 2px 14px 2px rgba(0, 0, 0, 0.25);
    }
  }
`;

const StyledImg = styled(Img)`
  border-radius: 4px;
  margin-bottom: ${getThemeSpacePx(3)};
`;

const ReadMore = styled(Box)`
  color: ${(p) => p.theme.colors.text};

  &:hover {
    opacity: 0.6;
  }
`;

const TextWrapper = styled.div`
  padding: 0;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;

  && {
    a,
    a:visited,
    a:hover,
    a:focus,
    a:active {
      color: ${getThemeColor('silverLighten60')};
    }
  }

  ${TextLight} {
    color: ${getThemeColor('silverDarken30')};
  }

  ${H2} {
    color: ${getThemeColor('silverLighten60')};
    margin-top: 5px;
  }

  ${H4} {
    font-weight: 400;
    color: ${getThemeColor('silverDarken30')};
  }

  @media ${device.tablet} {
    width: 80%;
  }
`;

const ProjectTeaser = ({
  kicker = '',
  title = '',
  text = '',
  fluid = null,
  slug = '/',
}) => {
  return (
    <Link to={slug}>
      <Teaser mb={[4, 5, 6]}>
        <StyledImg fluid={fluid} />

        <TextWrapper>
          <TextLight>{kicker}</TextLight>
          <H2 as="div">{title}</H2>
          <H4 as="div">{text}</H4>

          <ReadMore mt={3}>Read more</ReadMore>
        </TextWrapper>
      </Teaser>
    </Link>
  );
};

export default ProjectTeaser;

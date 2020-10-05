import React from 'react';
import styled from '@emotion/styled';
import { Box } from 'reflexbox';
import { Link } from 'gatsby';

import { H3, H2, H4, TextLight, Text } from 'components/Typo';
import {
  px,
  getThemeColor,
  getThemeSpacePx,
  rgba,
  device,
} from 'utils/css-utils';

const Wrapper = styled(Box)`
  border-radius: 6px;
  background: ${(props) =>
    props.isDark
      ? props.theme.colors.dark.cardBackground
      : props.theme.colors.light.background};
  background-image: ${(props) =>
    props.imgSrc ? `url(${props.imgSrc})` : 'none'};
  background-repeat: no-repeat;
  background-position: ${(props) => props.imgPosition};
  color: ${(p) => p.theme.colors[p.isDark ? 'dark' : 'light'].text};
  background-size: cover;
  flex-grow: 1;
  height: 270px;
  display: flex;
  align-items: center;

  &.scale {
    transition: transform 200ms ease, box-shadow 200ms ease;
    transform-style: preserve-3d;
    backface-visibility: hidden;

    &:hover {
      transform-origin: center center;
      transform: scale(1.02);
      box-shadow: 0 2px 12px 2px rgba(0, 0, 0, 0.45);
    }
  }

  && {
    a,
    a:visited,
    a:hover,
    a:focus,
    a:active {
      color: ${(p) => p.theme.colors[p.isDark ? 'dark' : 'light'].text};
    }
  }
`;

const getTextShadow = (props) => {
  const color = props.theme.colors[props.isDark ? 'light' : 'dark'].text;
  const rgbaColor = rgba(color, props.isDark ? 0.2 : 0.8);
  return `-1px 0 14px ${rgbaColor}, 0 1px 14px ${rgbaColor}, 1px 0 14px ${rgbaColor}, 0 -1px 14px ${rgbaColor};`;
};

const TextWrapper = styled.div`
  padding: ${getThemeSpacePx(3)};
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  text-shadow: ${getTextShadow};

  ${H2} {
    margin-top: 5px;
  }

  ${H3} {
    margin-top: 5px;
  }

  ${TextLight} {
    color: ${(p) =>
      p.isDark
        ? getThemeColor('silverDarken30')
        : getThemeColor('silverDarken60')};
  }

  ${Text} {
    color: ${(p) =>
      p.isDark
        ? getThemeColor('silverDarken30')
        : getThemeColor('silverDarken60')};
  }

  ${H4} {
    color: ${getThemeColor('silverDarken30')};
  }

  @media ${device.tablet} {
    width: 50%;
  }
`;

const ProjectTeaser = ({
  kicker = '',
  title = '',
  text = '',
  imgSrc = null,
  isDark = false,
  imgPosition = null,
  imgSize = '100%',
  slug = '/',
  hoverEffect = null,
}) => {
  const imagePosition = imgPosition ? imgPosition : 'center right';

  return (
    <Link to={slug}>
      <Wrapper
        imgSrc={imgSrc}
        isDark={isDark}
        imgPosition={imagePosition}
        imgSize={imgSize}
        className={hoverEffect}
      >
        <TextWrapper isDark={isDark}>
          <TextLight>{kicker}</TextLight>
          <H3 as="div">{title}</H3>
          <Text as="div">{text}</Text>
        </TextWrapper>
      </Wrapper>
    </Link>
  );
};

export default ProjectTeaser;

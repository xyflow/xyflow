import { css } from '@emotion/core';

export const breakpoints = {
  s: 460,
  m: 768,
  l: 1024,
  xl: 1280,
};

export const device = {
  phone: `(min-width: ${breakpoints.s}px)`,
  tablet: `(min-width: ${breakpoints.m}px)`,
  desktop: `(min-width: ${breakpoints.l}px)`,
  desktopL: `(min-width: ${breakpoints.xl}px)`,
};

// https://github.com/styled-components/styled-components/blob/master/packages/styled-components/docs/tips-and-tricks.md#more-powerful-example
const getMediaQuery = (size) => {
  return (...styleDefinition) => css`
    @media (min-width: ${size}px) {
      ${css(...styleDefinition)}
    }
  `;
};

export const media = {
  s: getMediaQuery(breakpoints.s),
  m: getMediaQuery(breakpoints.m),
  l: getMediaQuery(breakpoints.l),
  xl: getMediaQuery(breakpoints.xl),
};

export const rgba = (hex, alpha) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const px = (val) => `${val}px`;

export const getThemeColor = (colorName) => (props) =>
  props.theme.colors[colorName];

export const getThemeSpacePx = (spaceIndex) => (props) =>
  props.theme.spacePx[spaceIndex];

export default {
  rgba,
  px,
  getThemeColor,
  getThemeSpacePx,
};

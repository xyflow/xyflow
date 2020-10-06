import { px, breakpoints } from 'utils/css-utils';

const space = [0, 4, 8, 16, 32, 48, 64, 96, 128];
const spacePx = space.map(px);

const fontSizes = [12, 16, 20, 24, 36, 48, 54];
const fontSizesPx = fontSizes.map(px);
const breakpointsPx = Object.values(breakpoints).map(px);

const base = {
  fonts: {
    sans:
      "'nt-dapper', -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif",
    mono: "'jetbrains-mono', monospace",
  },
  maxWidth: '1200px',
  maxWidthBig: '1800px',
  space,
  spacePx,
  fontSizes,
  fontSizesPx,
  breakpoints: breakpointsPx,
  boxShadow: '0px 16px 64px rgba(26, 25, 43, 0.32);',
};

export const baseColors = {
  orange: '#FF6700',
  blue: '#0041D0',
  red: '#FF0072',
  redLighten15: '#FF2687',
  redLighten30: '#FE4C9C',
  redLighten60: '#FF99C6',
  redLighten90: '#FFE5F1',
  purple: '#784BE8',
  mint: '#00D7CA',
  lightGrey: '#D9D9D9',
  textDark: '#1A192B',
  textLight: '#ffffff',
  violet: '#1A192B',
  violetLighten5: '#222138',
  violetLighten15: '#333154',
  violetLighten30: '#4C497E',
  violetLighten45: '#6865A5',
  violetLighten60: '#918FBE',
  violetLighten85: '#D6D5E6',
  violetLighten95: '#F1F1F6',
  silver: '#EEF0F2',
  silverDarken15: '#C5CBD2',
  silverDarken30: '#9CA8B3',
  silverDarken60: '#53606C',
  silverDarken75: '#343C43',
  silverLighten15: '#F0F2F3',
  silverLighten30: '#F3F4F5',
  silverLighten60: '#F8F9F9',
};

export const darkColors = {
  background: baseColors.violet,
  sectionBackground: baseColors.violetLighten5,
  cardBackground: '#222138',
  text: baseColors.textLight,
  textLight: baseColors.silverDarken30,
  textInverted: '#16152E',
  stroke: '#2E2D3F',
  button: '#ffffff',
  footerBackground: baseColors.silverLighten60,
};

export const lightColors = {
  background: '#ffffff',
  sectionBackground: '#f2f2f2',
  cardBackground: '#eeeeee',
  text: baseColors.textDark,
  textLight: '#808080',
  textInverted: '#ffffff',
  stroke: '#E9E9E9',
  button: baseColors.violet,
  footerBackground: baseColors.violet,
};

export const colors = {
  ...baseColors,
  dark: darkColors,
  light: lightColors,
};

const dark = {
  ...base,
  name: 'dark',
  colors: {
    ...colors,
    ...colors.dark,
  },
};

const light = {
  ...base,
  name: 'light',
  colors: {
    ...colors,
    ...colors.light,
  },
};

export default {
  dark,
  light,
};

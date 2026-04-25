import { htmlSafe } from '@ember/template';

import type { CssStyle } from '../types.js';

export function toCss(style: CssStyle | undefined) {
  if (!style) {
    return '';
  }

  if (typeof style === 'string') {
    return style;
  }

  return Object.entries(style)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([property, value]) => `${property}: ${value};`)
    .join(' ');
}

export function safeStyle(style: CssStyle | undefined) {
  let css = toCss(style);
  return css ? htmlSafe(css) : undefined;
}

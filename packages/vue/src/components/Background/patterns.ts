import type { FunctionalComponent } from 'vue';
import type { BackgroundVariant } from './types';
import { h } from 'vue';

interface LinePatternProps {
  dimensions: [number, number];
  size?: number;
  color: string;
}

export const LinePattern: FunctionalComponent<LinePatternProps> = function ({ dimensions, size, color }) {
  return h('path', {
    'stroke': color,
    'stroke-width': size,
    'd': `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`,
  });
};

interface DotPatternProps {
  radius: number;
  color: string;
}

export const DotPattern: FunctionalComponent<DotPatternProps> = function ({ radius, color }) {
  return h('circle', { cx: radius, cy: radius, r: radius, fill: color });
};

export const Patterns = {
  lines: LinePattern,
  dots: DotPattern,
};

export const DefaultBgColors: Record<BackgroundVariant, string> = {
  lines: '#eee',
  dots: '#91919a',
};

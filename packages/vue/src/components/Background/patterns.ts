import type { FunctionalComponent } from 'vue';
import type { BackgroundVariant } from './types';
import { h } from 'vue';

interface LinePatternProps {
  dimensions: [number, number];
  variant: BackgroundVariant;
  lineWidth?: number;
  patternClassName?: string;
}

export const LinePattern: FunctionalComponent<LinePatternProps> = function ({
  dimensions,
  lineWidth,
  variant,
  patternClassName,
}) {
  return h('path', {
    'class': ['vue-flow__background-pattern', variant, patternClassName],
    'stroke-width': lineWidth,
    'd': `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`,
  });
};

LinePattern.props = ['dimensions', 'variant', 'lineWidth', 'patternClassName'];

interface DotPatternProps {
  radius: number;
  patternClassName?: string;
}

export const DotPattern: FunctionalComponent<DotPatternProps> = function ({ radius, patternClassName }) {
  return h('circle', {
    class: ['vue-flow__background-pattern', 'dots', patternClassName],
    cx: radius,
    cy: radius,
    r: radius,
  });
};

DotPattern.props = ['radius', 'patternClassName'];

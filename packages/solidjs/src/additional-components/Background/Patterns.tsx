import cc from 'classcat';

import { BackgroundVariant } from './types';

type LinePatternProps = {
  dimensions: [number, number];
  variant: BackgroundVariant;
  lineWidth?: number;
  className?: string;
};

export function LinePattern(p: LinePatternProps) {
  return (
    <path
      stroke-width={p.lineWidth}
      d={`M${p.dimensions[0] / 2} 0 V${p.dimensions[1]} M0 ${p.dimensions[1] / 2} H${p.dimensions[0]}`}
      class={cc(['react-flow__background-pattern', p.variant, p.className])}
    />
  );
}

type DotPatternProps = {
  radius: number;
  className?: string;
};

export function DotPattern(p: DotPatternProps) {
  return (
    <circle cx={p.radius} cy={p.radius} r={p.radius} class={cc(['react-flow__background-pattern', 'dots', p.className])} />
  );
}

import cc from 'classcat';

import { BackgroundVariant } from './types';

type LinePatternProps = {
  dimensions: [number, number];
  variant: BackgroundVariant;
  lineWidth?: number;
  className?: string;
};

export function LinePattern({ dimensions, lineWidth, variant, className }: LinePatternProps) {
  return (
    <path
      strokeWidth={lineWidth}
      d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`}
      className={cc(['react-flow__background-pattern', variant, className])}
    />
  );
}

type DotPatternProps = {
  radius: number;
  className?: string;
};

export function DotPattern({ radius, className }: DotPatternProps) {
  return (
    <circle cx={radius} cy={radius} r={radius} className={cc(['react-flow__background-pattern', 'dots', className])} />
  );
}

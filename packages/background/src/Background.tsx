import { memo, useRef } from 'react';
import cc from 'classcat';
import { useStore, ReactFlowState } from '@reactflow/core';
import shallow from 'zustand/shallow';

import { BackgroundProps, BackgroundVariant } from './types';
import { DotPattern, LinePattern } from './Patterns';

const defaultColor = {
  [BackgroundVariant.Dots]: '#91919a',
  [BackgroundVariant.Lines]: '#eee',
  [BackgroundVariant.Cross]: '#e2e2e2',
};

const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6,
};

const selector = (s: ReactFlowState) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });

function Background({
  variant = BackgroundVariant.Dots,
  gap = 20,
  // only used for dots and cross
  size,
  // only used for lines and cross
  lineWidth = 1,
  color,
  style,
  className,
}: BackgroundProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { transform, patternId } = useStore(selector, shallow);
  const patternColor = color || defaultColor[variant];
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: [number, number] = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap: [number, number] = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
  const scaledSize = patternSize * transform[2];

  const patternDimensions: [number, number] = isCross ? [scaledSize, scaledSize] : scaledGap;

  const patternOffset = isDots
    ? [scaledSize / 2, scaledSize / 2]
    : [patternDimensions[0] / 2, patternDimensions[1] / 2];

  return (
    <svg
      className={cc(['react-flow__background', className])}
      style={{
        ...style,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
      ref={ref}
    >
      <pattern
        id={patternId}
        x={transform[0] % scaledGap[0]}
        y={transform[1] % scaledGap[1]}
        width={scaledGap[0]}
        height={scaledGap[1]}
        patternUnits="userSpaceOnUse"
        patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
      >
        {isDots ? (
          <DotPattern color={patternColor} radius={scaledSize / 2} />
        ) : (
          <LinePattern dimensions={patternDimensions} color={patternColor} lineWidth={lineWidth} />
        )}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

Background.displayName = 'Background';

export default memo(Background);

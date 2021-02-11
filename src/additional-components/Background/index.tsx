import React, { memo, HTMLAttributes } from 'react';
import cc from 'classcat';

import { useStoreState } from '../../store/hooks';
import { BackgroundVariant } from '../../types';
import { createGridLinesPath, createGridDotsPath } from './utils';

export interface BackgroundProps extends HTMLAttributes<SVGElement> {
  variant?: BackgroundVariant;
  gap?: number;
  color?: string;
  size?: number;
}

const defaultColors = {
  [BackgroundVariant.Dots]: '#81818a',
  [BackgroundVariant.Lines]: '#eee',
};

const Background = ({
  variant = BackgroundVariant.Dots,
  gap = 15,
  size = 0.5,
  color,
  style,
  className,
}: BackgroundProps) => {
  const [x, y, scale] = useStoreState((s) => s.transform);

  const bgClasses = cc(['react-flow__background', className]);
  const scaledGap = gap * scale;
  const xOffset = x % scaledGap;
  const yOffset = y % scaledGap;

  const isLines = variant === BackgroundVariant.Lines;
  const bgColor = color ? color : defaultColors[variant];
  const path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size, bgColor);

  return (
    <svg
      className={bgClasses}
      style={{
        ...style,
        width: '100%',
        height: '100%',
      }}
    >
      <pattern id="pattern" x={xOffset} y={yOffset} width={scaledGap} height={scaledGap} patternUnits="userSpaceOnUse">
        {path}
      </pattern>

      <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)"></rect>
    </svg>
  );
};

Background.displayName = 'Background';

export default memo(Background);

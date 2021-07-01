import React, { memo, useMemo, FC, HTMLAttributes } from 'react';
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

const Background: FC<BackgroundProps> = ({
  variant = BackgroundVariant.Dots,
  gap = 15,
  size = 0.4,
  color,
  style,
  className,
}) => {
  const [x, y, scale] = useStoreState((s) => s.transform);
  // when there are multiple flows on a page we need to make sure that every background gets its own pattern.
  const patternId = useMemo(() => `pattern-${Math.floor(Math.random() * 100000)}`, []);

  const bgClasses = cc(['react-flow__background', className]);
  const scaledGap = gap * scale;
  const xOffset = x % scaledGap;
  const yOffset = y % scaledGap;

  const isLines = variant === BackgroundVariant.Lines;
  const bgColor = color ? color : defaultColors[variant];
  const path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size * scale, bgColor);

  return (
    <svg
      className={bgClasses}
      style={{
        ...style,
        width: '100%',
        height: '100%',
      }}
    >
      <pattern
        id={patternId}
        x={xOffset}
        y={yOffset}
        width={scaledGap}
        height={scaledGap}
        patternUnits="userSpaceOnUse"
      >
        {path}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

Background.displayName = 'Background';

export default memo(Background);

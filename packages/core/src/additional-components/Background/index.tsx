import React, { memo, FC, useEffect, useState, useRef } from 'react';
import cc from 'classcat';

import { useStore } from '../../store';
import { createGridLinesPath, createGridDotsPath } from './utils';
import { BackgroundVariant, ReactFlowState, BackgroundProps } from '../../types';

const defaultColors = {
  [BackgroundVariant.Dots]: '#81818a',
  [BackgroundVariant.Lines]: '#eee',
};

const transformSelector = (s: ReactFlowState) => s.transform;

const Background: FC<BackgroundProps> = ({
  variant = BackgroundVariant.Dots,
  gap = 15,
  size = 0.4,
  color,
  style,
  className,
}) => {
  const ref = useRef<SVGSVGElement>(null);
  const [patternId, setPatternId] = useState<string | null>(null);
  const [tX, tY, tScale] = useStore(transformSelector);

  useEffect(() => {
    // when there are multiple flows on a page we need to make sure that every background gets its own pattern.
    const bgs = document.querySelectorAll('.react-flow__background');
    const index = Array.from(bgs).findIndex((bg) => bg === ref.current);
    setPatternId(`pattern-${index}`);
  }, []);

  const scaledGap = gap * tScale || 1;
  const xOffset = tX % scaledGap;
  const yOffset = tY % scaledGap;

  const isLines = variant === BackgroundVariant.Lines;
  const bgColor = color ? color : defaultColors[variant];
  const path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size * tScale, bgColor);

  return (
    <svg
      className={cc(['react-flow__background', 'react-flow__container', className])}
      style={{
        ...style,
        width: '100%',
        height: '100%',
      }}
      ref={ref}
    >
      {patternId && (
        <>
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
        </>
      )}
    </svg>
  );
};

Background.displayName = 'Background';

export default memo(Background);

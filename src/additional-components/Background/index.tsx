import React, { memo, useMemo, HTMLAttributes } from 'react';
import cc from 'classcat';

import { useStoreState } from '../../store/hooks';
import { BackgroundVariant } from '../../types';
import { createGridLinesPath, createGridDotsPath } from './utils';

import './style.css';

interface BackgroundProps extends HTMLAttributes<SVGElement> {
  variant?: BackgroundVariant;
  gap?: number;
  color?: string;
  size?: number;
}

const defaultColors = {
  [BackgroundVariant.Dots]: '#999',
  [BackgroundVariant.Lines]: '#eee',
};

const Background = ({
  variant = BackgroundVariant.Dots,
  gap = 24,
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

  const bgSvgTile = useMemo(() => {
    const isLines = variant === BackgroundVariant.Lines;
    const bgColor = color ? color : defaultColors[variant];
    const path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size, bgColor);

    return encodeURIComponent(
      `<svg width="${scaledGap}" height="${scaledGap}" xmlns='http://www.w3.org/2000/svg'>${path}</svg>`
    );
  }, [variant, scaledGap, size, color]);

  return (
    <div
      className={bgClasses}
      style={{
        ...style,
        backgroundImage: `url("data:image/svg+xml;utf8,${bgSvgTile}")`,
        backgroundPosition: `${xOffset}px ${yOffset}px`,
      }}
    ></div>
  );
};

Background.displayName = 'Background';

export default memo(Background);

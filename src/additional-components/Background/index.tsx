import React, { memo, HTMLAttributes } from 'react';
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

const Background = memo(
  ({ variant = BackgroundVariant.Dots, gap = 24, size = 0.5, color, style, className }: BackgroundProps) => {
    const [x, y, scale] = useStoreState((s) => s.transform);

    const bgClasses = cc(['react-flow__background', className]);
    const bgColor = color ? color : defaultColors[variant];
    const scaledGap = gap * scale;
    const xOffset = x % scaledGap;
    const yOffset = y % scaledGap;
    const isLines = variant === BackgroundVariant.Lines;
    const path = isLines
      ? createGridLinesPath(xOffset, yOffset, scaledGap)
      : createGridDotsPath(xOffset, yOffset, scaledGap, size);
    const fill = isLines ? 'none' : bgColor;
    const stroke = isLines ? bgColor : 'none';

    const bg = `<svg width="${scaledGap + size}" height="${scaledGap + size}" xmlns='http://www.w3.org/2000/svg' ${
      typeof style !== 'undefined' ? `style="${style}"` : ''
    }><path fill="${fill}" stroke="${stroke}" strokeWidth="${size}" d="${path}" /></svg>`;

    return (
      <div
        className={bgClasses}
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(bg)}")`,
        }}
      ></div>
    );
  }
);

Background.displayName = 'Background';

export default Background;

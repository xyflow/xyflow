import React, { memo, HTMLAttributes, CSSProperties } from 'react';
import classnames from 'classnames';

import { useStoreState } from '../../store/hooks';
import { BackgroundVariant } from '../../types';
import { createGridLinesPath, createGridDotsPath } from './utils';

interface BackgroundProps extends HTMLAttributes<SVGElement> {
  variant?: BackgroundVariant;
  gap?: number;
  color?: string;
  size?: number;
}

const baseStyles: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
};

const defaultColors = {
  [BackgroundVariant.Dots]: '#999',
  [BackgroundVariant.Lines]: '#eee',
};

const Background = memo(
  ({ variant = BackgroundVariant.Dots, gap = 24, size = 0.5, color, style = {}, className = '' }: BackgroundProps) => {
    const {
      width,
      height,
      transform: [x, y, scale],
    } = useStoreState((s) => s);

    const bgClasses = classnames('react-flow__background', className);
    const bgColor = color ? color : defaultColors[variant];
    const scaledGap = gap * scale;
    const xOffset = x % scaledGap;
    const yOffset = y % scaledGap;
    const isLines = variant === BackgroundVariant.Lines;
    const path = isLines
      ? createGridLinesPath(width, height, xOffset, yOffset, scaledGap)
      : createGridDotsPath(width, height, xOffset, yOffset, scaledGap, size);
    const fill = isLines ? 'none' : bgColor;
    const stroke = isLines ? bgColor : 'none';

    return (
      <svg width={width} height={height} style={{ ...baseStyles, ...style }} className={bgClasses}>
        <path fill={fill} stroke={stroke} strokeWidth={size} d={path} />
      </svg>
    );
  }
);

Background.displayName = 'Background';

export default Background;

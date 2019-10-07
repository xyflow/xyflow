import React, { memo } from 'react';
import { useStoreState } from 'easy-peasy';
import classnames from 'classnames';

const baseStyles = {
  position: 'absolute',
  top: 0,
  left: 0
};

const GridRenderer = memo(({
  gap = 24, strokeColor = '#999', strokeWidth = 0.1, style,
  className
}) => {
  const {
    width,
    height,
    transform: [x, y, scale],
  } = useStoreState(s => s);

  const gridClasses = classnames('react-flow__grid', className);
  const scaledGap = gap * scale;

  const xStart = x % scaledGap;
  const yStart = y % scaledGap;

  const lineCountX = Math.ceil(width / scaledGap) + 1;
  const lineCountY = Math.ceil(height / scaledGap) + 1;

  const xValues = Array.from({length: lineCountX}, (_, index) => `M${index * scaledGap + xStart} 0 V${height}`);
  const yValues = Array.from({length: lineCountY}, (_, index) => `M0 ${index * scaledGap + yStart} H${width}`);

  const path = [...xValues, ...yValues].join(' ');

  return (
    <svg
      width={width}
      height={height}
      style={{ ...baseStyles, ...style }}
      className={gridClasses}
    >
      <path
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        d={path}
      />
    </svg>
  );
});

GridRenderer.displayName = 'GridRenderer';

export default GridRenderer;

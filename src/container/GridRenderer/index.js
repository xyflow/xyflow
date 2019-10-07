import React, {memo} from 'react';
import {useStoreState} from 'easy-peasy';

const GridRenderer = memo(({gap = 32}) => {
  const {
    width,
    height,
    transform: [x, y, scale],
  } = useStoreState(s => s);

  const scaledGap = gap * scale;

  const xStart = x % scaledGap;
  const yStart = y % scaledGap;

  const lineCountX = Math.ceil(width / scaledGap) + 1;
  const lineCountY = Math.ceil(height / scaledGap) + 1;

  const xValues = Array.from({length: lineCountX}, (_, index) => `M${index * scaledGap + xStart} 0 V${height}`);
  const yValues = Array.from({length: lineCountY}, (_, index) => `M0 ${index * scaledGap + yStart} H${width}`);

  const path = [...xValues, ...yValues].join(' ');

  return (
    <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0}}>
      <path fill="none" stroke="black" strokeWidth={.1} d={path} />
    </svg>
  );
});

GridRenderer.displayName = 'GridRenderer';

export default GridRenderer;

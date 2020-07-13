import React, { memo } from 'react';

import EdgeText from './EdgeText';
import { EdgeProps } from '../../types';

interface GetStepPathParams {
  centerY: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export function getStepPath({ centerY, sourceX, sourceY, targetX, targetY }: GetStepPathParams): string {
  return `M ${sourceX},${sourceY}L ${sourceX},${centerY}L ${targetX},${centerY}L ${targetX},${targetY}`;
}

export default memo(
  ({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, style }: EdgeProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    const path = getStepPath({ centerY, sourceX, sourceY, targetX, targetY });

    const text = label ? (
      <EdgeText
        x={centerX}
        y={centerY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
      />
    ) : null;

    return (
      <>
        <path style={style} className="react-flow__edge-path" d={path} />
        {text}
      </>
    );
  }
);

import React, { memo } from 'react';

import EdgeText from './EdgeText';
import { getMarkerEnd } from './utils';
import { EdgeProps } from '../../types';

export default memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    arrowHeadType,
    markerEndId,
  }: EdgeProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

    const text = label ? (
      <EdgeText
        x={centerX}
        y={centerY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    ) : null;

    return (
      <>
        <path
          style={style}
          className="react-flow__edge-path"
          d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
          markerEnd={markerEnd}
        />
        {text}
      </>
    );
  }
);

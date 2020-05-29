import React, { memo } from 'react';

import EdgeText from './EdgeText';
import { EdgeBezierProps, Position } from '../../types';

export default memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    style,
  }: EdgeBezierProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    let dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

    const leftAndRight = [Position.Left, Position.Right];
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      dAttr = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
    } else if (leftAndRight.includes(sourcePosition) || leftAndRight.includes(targetPosition)) {
      dAttr = `M${sourceX},${sourceY} C${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`;
    }

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
        <path style={style} d={dAttr} className="react-flow__edge-path" />
        {text}
      </>
    );
  }
);

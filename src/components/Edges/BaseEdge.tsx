import React from 'react';

import EdgeText from './EdgeText';
import { BaseEdgeProps } from '../../types';

export default ({
  path,
  centerX,
  centerY,
  label,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  style,
  markerEnd,
  markerStart,
}: BaseEdgeProps) => {
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
      <path style={style} d={path} className="react-flow__edge-path" markerEnd={markerEnd} markerStart={markerStart} />
      {text}
    </>
  );
};

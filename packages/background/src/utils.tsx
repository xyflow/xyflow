import React from 'react';

export const createGridLinesPath = (
  dimensions: [number, number],
  strokeWidth: number,
  stroke: string
): React.ReactElement => {
  return (
    <path
      stroke={stroke}
      strokeWidth={strokeWidth}
      d={`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${
        dimensions[0]
      }`}
    />
  );
};

export const createGridDotsPath = (
  size: number,
  fill: string
): React.ReactElement => {
  return <circle cx={size} cy={size} r={size} fill={fill} />;
};

import React from 'react';

import { WrapEdgeProps, Position } from '../../types';

const radiusEdgeUpdater = 10;

const shiftX = (position: Position, x: number) => {
  if (position === Position.Right) return x + radiusEdgeUpdater;
  if (position === Position.Left) return x - radiusEdgeUpdater;
  return x;
}

const shiftY = (position: Position, y: number) => {
  if (position === Position.Bottom) return y + radiusEdgeUpdater;
  if (position === Position.Top) return y - radiusEdgeUpdater;
  return y;
}

export const EdgeAnchorStart = ({
  sourceX,
  sourceY,
  sourcePosition,
}: WrapEdgeProps): JSX.Element => {
  return (
    <circle
      className="react-flow__edgeupdater"
      cx={shiftX(sourcePosition, sourceX)}
      cy={shiftY(sourcePosition, sourceY)}
      r={radiusEdgeUpdater}
      stroke="transparent"
      fill="transparent"
    />
  );
}

export const EdgeAnchorEnd = ({
  targetX,
  targetY,
  targetPosition,
}: WrapEdgeProps): JSX.Element => {
  return (
    <circle
      className="react-flow__edgeupdater"
      cx={shiftX(targetPosition, targetX)}
      cy={shiftY(targetPosition, targetY)}
      r={radiusEdgeUpdater}
      stroke="transparent"
      fill="transparent"
    />
  );
}

import React from 'react';

import { Position } from '../../types';

const shiftX = (x: number, shift: number, position: Position) => {
  if (position === Position.Left) return x - shift;
  if (position === Position.Right) return x + shift;
  return x;
}

const shiftY = (y: number, shift: number, position: Position) => {
  if (position === Position.Top) return y - shift;
  if (position === Position.Bottom) return y + shift;
  return y;
}

export interface EdgeAnchorProps {
  className?: string
  position: Position
  centerX: number
  centerY: number
  radius?: number
}

export const EdgeAnchor = ({
  className = "react-flow__edgeupdater",
  position,
  centerX,
  centerY,
  radius = 10
}: EdgeAnchorProps): JSX.Element => {
  return (
    <circle
      className={className}
      cx={shiftX(centerX, radius, position)}
      cy={shiftY(centerY, radius, position)}
      r={radius}
      stroke="transparent"
      fill="transparent"
    />
  );
}

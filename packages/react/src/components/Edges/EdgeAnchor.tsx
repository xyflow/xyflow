import type { MouseEvent as ReactMouseEvent, SVGAttributes } from 'react';
import cc from 'classcat';
import { Position } from '@xyflow/system';

const shiftX = (x: number, shift: number, position: Position): number => {
  if (position === Position.Left) return x - shift;
  if (position === Position.Right) return x + shift;
  return x;
};

const shiftY = (y: number, shift: number, position: Position): number => {
  if (position === Position.Top) return y - shift;
  if (position === Position.Bottom) return y + shift;
  return y;
};

export interface EdgeAnchorProps extends SVGAttributes<SVGGElement> {
  position: Position;
  centerX: number;
  centerY: number;
  radius?: number;
  onMouseDown: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
  onMouseEnter: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
  onMouseOut: (event: ReactMouseEvent<SVGGElement, MouseEvent>) => void;
  type: string;
}

const EdgeUpdaterClassName = 'react-flow__edgeupdater';

/**
 * @internal
 */
export function EdgeAnchor({
  position,
  centerX,
  centerY,
  radius = 10,
  onMouseDown,
  onMouseEnter,
  onMouseOut,
  type,
}: EdgeAnchorProps) {
  return (
    <circle
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
      className={cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`])}
      cx={shiftX(centerX, radius, position)}
      cy={shiftY(centerY, radius, position)}
      r={radius}
      stroke="transparent"
      fill="transparent"
    />
  );
}

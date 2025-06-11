// import type { MouseEvent as ReactMouseEvent, SVGAttributes } from 'react';
import cc from 'classcat';
import { Position } from '@xyflow/system';
import { mergeProps, JSX } from 'solid-js';

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

export interface EdgeAnchorProps extends JSX.CircleSVGAttributes<SVGCircleElement> {
  position: Position;
  centerX: number;
  centerY: number;
  radius?: number;
  onMouseDown:JSX.CircleSVGAttributes<SVGCircleElement>["onMouseDown"]
  onMouseEnter:JSX.CircleSVGAttributes<SVGCircleElement>["onMouseEnter"]
  onMouseOut:JSX.CircleSVGAttributes<SVGCircleElement>["onMouseOut"]
  type: string;
}

const EdgeUpdaterClassName = 'react-flow__edgeupdater';

export function EdgeAnchor(_p: EdgeAnchorProps)

// {
//   position,
//   centerX,
//   centerY,
//   radius = 10,
//   onMouseDown,
//   onMouseEnter,
//   onMouseOut,
//   type,
// }: EdgeAnchorProps) {
  {

  const p = mergeProps(
    {
      radius: 10,
    },
    _p
  );

  return (
    <circle
      onMouseDown={p.onMouseDown}
      onMouseEnter={p.onMouseEnter}
      onMouseOut={p.onMouseOut}
      class={cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${p.type}`])}
      cx={shiftX(p.centerX, p.radius, p.position)}
      cy={shiftY(p.centerY, p.radius, p.position)}
      r={p.radius}
      stroke="transparent"
      fill="transparent"
    />
  );
}

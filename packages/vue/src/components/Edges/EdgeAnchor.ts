import type { FunctionalComponent, HTMLAttributes } from 'vue';
import { Position } from '@xyflow/system';
import { h } from 'vue';

interface Props extends HTMLAttributes {
  position: Position;
  centerX: number;
  centerY: number;
  radius?: number;
  type: string;
}

function shiftX(x: number, shift: number, position: Position): number {
  if (position === Position.Left) {
    return x - shift;
  }
  if (position === Position.Right) {
    return x + shift;
  }
  return x;
}

function shiftY(y: number, shift: number, position: Position): number {
  if (position === Position.Top) {
    return y - shift;
  }
  if (position === Position.Bottom) {
    return y + shift;
  }
  return y;
}

const EdgeAnchor: FunctionalComponent<Props> = function ({
  radius = 10,
  centerX = 0,
  centerY = 0,
  position = Position.Top,
  type,
}) {
  return h('circle', {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${type}`,
    cx: shiftX(centerX, radius, position),
    cy: shiftY(centerY, radius, position),
    r: radius,
    stroke: 'transparent',
    fill: 'transparent',
  });
};

EdgeAnchor.props = ['radius', 'centerX', 'centerY', 'position', 'type'];
EdgeAnchor.compatConfig = { MODE: 3 };

export default EdgeAnchor;

import cc from 'classcat';

import type { MiniMapNodeProps } from './types';

function MiniMapNodeComponent(p: MiniMapNodeProps) {
//   id,
//   x,
//   y,
//   width,
//   height,
//   style,
//   color,
//   strokeColor,
//   strokeWidth,
//   className,
//   borderRadius,
//   shapeRendering,
//   selected,
//   onClick,
// }: MiniMapNodeProps) {

  // const { background, backgroundColor } = style || {};
  const fill = () => (p.color || p.style?.background || p.style?.["background-color"]) as string;

  const onClick = (event: MouseEvent) => {
    if (p.onClick) {
      p.onClick(event, p.id);
    }
  }

  return (
    <rect
      class={cc(['react-flow__minimap-node', { selected: p.selected }, p.className])}
      x={p.x}
      y={p.y}
      rx={p.borderRadius}
      ry={p.borderRadius}
      width={p.width}
      height={p.height}
      style={{
        fill: fill(),
        stroke: p.strokeColor,
        "stroke-width": p.strokeWidth,
      }}
      shape-rendering={p["shape-rendering"]}
      onClick={onClick}
    />
  );
}

export const MiniMapNode = MiniMapNodeComponent;

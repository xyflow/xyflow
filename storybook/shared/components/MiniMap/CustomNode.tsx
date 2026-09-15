import type { MiniMapNodeProps } from '@xyflow/react';
export default function CustomNode({ x, y, width, height, selected }: MiniMapNodeProps) {
  return (
    <circle
      cx={x + width / 2}
      cy={y + height / 2}
      r={Math.max(1, Math.min(width, height) / 2)}
      fill={selected ? '#ff6b6b' : '#ffcc00'}
    />
  );
}

import { ConnectionLineComponentProps, getSmoothStepPath, getStraightPath, Position } from '@xyflow/react';

export default function WireConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
  // For electrical wiring, use straight path when nodes are facing each other
  // Check the actual spatial relationship regardless of declared handle positions
  const dx = Math.abs(toX - fromX);
  const dy = Math.abs(toY - fromY);

  // Determine if this is primarily a horizontal or vertical connection
  const isHorizontalConnection = dx > dy;
  const isVerticalConnection = dy > dx;

  // For horizontal connections: use straight if nodes are side-by-side (left to right)
  // For vertical connections: use straight if nodes are stacked (top to bottom)
  const useStraightPath =
    (isHorizontalConnection && Math.abs(fromY - toY) < 50) || // Same row, different columns
    (isVerticalConnection && Math.abs(fromX - toX) < 50);     // Same column, different rows

  const [edgePath] = useStraightPath
    ? getStraightPath({
        sourceX: fromX,
        sourceY: fromY,
        targetX: toX,
        targetY: toY,
      })
    : getSmoothStepPath({
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: toX,
        targetY: toY,
        targetPosition: toPosition,
        borderRadius: 8,
        offset: 30,
      });

  const wireColor = '#fbbf24'; // Yellow/amber for active connection

  return (
    <g>
      {/* Outer wire casing */}
      <path
        d={edgePath}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />

      {/* Inner wire conductor */}
      <path
        d={edgePath}
        fill="none"
        stroke={wireColor}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))',
        }}
      />

      {/* Highlight stripe */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pointerEvents: 'none' }}
      />

      {/* Pulsing animation */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="5,10"
        style={{ pointerEvents: 'none' }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="15"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}

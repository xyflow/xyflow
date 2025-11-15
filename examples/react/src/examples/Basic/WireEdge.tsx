import { memo } from 'react';
import { EdgeProps, useNodes } from '@xyflow/react';
import { getSmartEdge } from '@tisoap/react-flow-smart-edge';

export type WireEdgeData = {
  color?: string;
  animated?: boolean;
};

const WireEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
  }: EdgeProps<WireEdgeData>) => {
    // Get all nodes for obstacle avoidance
    const nodes = useNodes();

    // Use smart edge routing with obstacle avoidance
    const smartEdgeResult = getSmartEdge({
      sourcePosition,
      targetPosition,
      sourceX,
      sourceY,
      targetX,
      targetY,
      nodes,
      options: {
        nodePadding: 15, // Padding around nodes in pixels
        gridRatio: 10,   // Grid cell size for pathfinding
      },
    });

    // Fall back to straight line if smart edge can't find a path
    const edgePath = smartEdgeResult?.svgPathString || `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

    const wireColor = data?.color || '#b1b1b7';
    const isAnimated = data?.animated || false;

    return (
      <>
        {/* Outer wire casing (darker shadow) */}
        <path
          id={`${id}-outer`}
          d={edgePath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            ...style,
            opacity: 0.4,
          }}
        />

        {/* Inner wire conductor (colored) */}
        <path
          id={`${id}-inner`}
          d={edgePath}
          fill="none"
          stroke={wireColor}
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            ...style,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
          }}
          markerEnd={markerEnd}
        />

        {/* Highlight stripe for 3D cylindrical effect */}
        <path
          id={`${id}-highlight`}
          d={edgePath}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            ...style,
            pointerEvents: 'none',
          }}
        />

        {/* Animated flow effect */}
        {isAnimated && (
          <path
            d={edgePath}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray="5,10"
            style={{
              ...style,
              pointerEvents: 'none',
            }}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="15"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        )}

        {/* Interactive hit area */}
        <path
          id={id}
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
          style={style}
        />
      </>
    );
  }
);

WireEdge.displayName = 'WireEdge';

export default WireEdge;

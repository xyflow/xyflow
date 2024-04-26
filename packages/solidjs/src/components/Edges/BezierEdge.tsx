import { Position, getBezierPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { BezierEdgeProps } from '../../types';
import { createMemo, mergeProps } from 'solid-js';

function createBezierEdge(params: { isInternal: boolean }) {
  return (_p: BezierEdgeProps) => {
    const p = mergeProps(
      {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      _p
    );

    const pathData = createMemo(() =>
      getBezierPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        sourcePosition: p.sourcePosition,
        targetX: p.targetX,
        targetY: p.targetY,
        targetPosition: p.targetPosition,
        curvature: p.pathOptions?.curvature,
      })
    );

    return (
      <BaseEdge
        id={params.isInternal ? undefined : p.id}
        path={pathData()[0]}
        labelX={pathData()[1]}
        labelY={pathData()[2]}
        label={p.label}
        labelStyle={p.labelStyle}
        labelShowBg={p.labelShowBg}
        labelBgStyle={p.labelBgStyle}
        labelBgPadding={p.labelBgPadding}
        labelBgBorderRadius={p.labelBgBorderRadius}
        style={p.style}
        markerEnd={p.markerEnd}
        markerStart={p.markerStart}
        interactionWidth={p.interactionWidth}
      />
    );
  };
}

/**
 * Component that can be used inside a custom edge to render a bezier curve.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { BezierEdge } from '@xyflow/solid';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <BezierEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *       sourcePosition={sourcePosition}
 *       targetPosition={targetPosition}
 *     />
 *   );
 * }
 * ```
 */
const BezierEdge = createBezierEdge({ isInternal: false });

/**
 * @internal
 */
const BezierEdgeInternal = createBezierEdge({ isInternal: true });

export { BezierEdge, BezierEdgeInternal };

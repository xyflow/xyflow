import { getStraightPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { StraightEdgeProps } from '../../types';
import { createMemo } from 'solid-js';

function createStraightEdge(params: { isInternal: boolean }) {
  return (p: StraightEdgeProps) => {
    const pathData = createMemo(() =>
      getStraightPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        targetX: p.targetX,
        targetY: p.targetY,
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
 * Component that can be used inside a custom edge to render a straight line.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { StraightEdge } from '@xyflow/solid';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY }) {
 *   return (
 *     <StraightEdge
 *       sourceX={sourceX}
 *       sourceY={sourceY}
 *       targetX={targetX}
 *       targetY={targetY}
 *     />
 *   );
 * }
 * ```
 */
const StraightEdge = createStraightEdge({ isInternal: false });

/**
 * @internal
 */
const StraightEdgeInternal = createStraightEdge({ isInternal: true });

// TODO: add these back
// StraightEdge.displayName = 'StraightEdge';
// StraightEdgeInternal.displayName = 'StraightEdgeInternal';

export { StraightEdge, StraightEdgeInternal };

import { Position, getSmoothStepPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SmoothStepEdgeProps } from '../../types';
import { mergeProps, createMemo } from 'solid-js';

function createSmoothStepEdge(params: { isInternal: boolean }) {
  return (_p: SmoothStepEdgeProps) => {
    const p = mergeProps(
      {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      _p
    );

    const pathData = createMemo(() =>
      getSmoothStepPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        sourcePosition: p.sourcePosition,
        targetX: p.targetX,
        targetY: p.targetY,
        targetPosition: p.targetPosition,
        borderRadius: p.pathOptions?.borderRadius,
        offset: p.pathOptions?.offset,
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

const SmoothStepEdge = createSmoothStepEdge({ isInternal: false });
const SmoothStepEdgeInternal = createSmoothStepEdge({ isInternal: true });

// TODO: add these back
// SmoothStepEdge.displayName = 'SmoothStepEdge';
// SmoothStepEdgeInternal.displayName = 'SmoothStepEdgeInternal';

export { SmoothStepEdge, SmoothStepEdgeInternal };

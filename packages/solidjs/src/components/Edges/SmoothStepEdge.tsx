import { Position, getSmoothStepPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SmoothStepEdgeProps } from '../../types';
import { mergeProps } from 'solid-js';

function createSmoothStepEdge(params: { isInternal: boolean }) {
  return (
    _p: SmoothStepEdgeProps
    // {
    //   id,
    //   sourceX,
    //   sourceY,
    //   targetX,
    //   targetY,
    //   label,
    //   labelStyle,
    //   labelShowBg,
    //   labelBgStyle,
    //   labelBgPadding,
    //   labelBgBorderRadius,
    //   style,
    //   sourcePosition = Position.Bottom,
    //   targetPosition = Position.Top,
    //   markerEnd,
    //   markerStart,
    //   pathOptions,
    //   interactionWidth,
    // }: SmoothStepEdgeProps) => {
   )   =>  {

    const p = mergeProps(
      {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      _p
    );

    // const [path, labelX, labelY]
      
      
     const _path = () => getSmoothStepPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        sourcePosition: p.sourcePosition,
        targetX: p.targetX,
        targetY: p.targetY,
        targetPosition: p.targetPosition,
        borderRadius: p.pathOptions?.borderRadius,
        offset: p.pathOptions?.offset,
      });

    const path = () => _path()[0];
    const labelX = () => _path()[1];
    const labelY = () => _path()[2];

      const _id = () => params.isInternal ? undefined : p.id;

      return (
        <BaseEdge
          id={_id()}
          path={path()}
          labelX={labelX()}
          labelY={labelY()}
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
    }

}

const SmoothStepEdge = createSmoothStepEdge({ isInternal: false });
const SmoothStepEdgeInternal = createSmoothStepEdge({ isInternal: true });

// TODO: add these back 
// SmoothStepEdge.displayName = 'SmoothStepEdge';
// SmoothStepEdgeInternal.displayName = 'SmoothStepEdgeInternal';

export { SmoothStepEdge, SmoothStepEdgeInternal };

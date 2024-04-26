import { Position, getBezierPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { BezierEdgeProps } from '../../types';
import { createMemo, mergeProps } from 'solid-js';

function createBezierEdge(params: { isInternal: boolean }) {
    return (_p: BezierEdgeProps) => {
    //   id,
    //   sourceX,
    //   sourceY,
    //   targetX,
    //   targetY,
    //   sourcePosition = Position.Bottom,
    //   targetPosition = Position.Top,
    //   label,
    //   labelStyle,
    //   labelShowBg,
    //   labelBgStyle,
    //   labelBgPadding,
    //   labelBgBorderRadius,
    //   style,
    //   markerEnd,
    //   markerStart,
    //   pathOptions,
    //   interactionWidth,
    // }: BezierEdgeProps) => {

      // const [path, labelX, labelY]

      const p = mergeProps(
        {
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        _p
      );

      
        const _path =  createMemo(() => getBezierPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        sourcePosition: p.sourcePosition,
        targetX: p.targetX,
        targetY: p.targetY,
        targetPosition: p.targetPosition,
        curvature: p.pathOptions?.curvature,
      }));

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

const BezierEdge = createBezierEdge({ isInternal: false });
const BezierEdgeInternal = createBezierEdge({ isInternal: true });

// TODO: update this 
// BezierEdge.displayName = 'BezierEdge';
// BezierEdgeInternal.displayName = 'BezierEdgeInternal';

export { BezierEdge, BezierEdgeInternal };

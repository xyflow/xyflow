import { getStraightPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { StraightEdgeProps } from '../../types';
import { Component } from 'solid-js';

function createStraightEdge(params: { isInternal: boolean }): Component<StraightEdgeProps> {
  return (
    p: StraightEdgeProps
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
    //   markerEnd,
    //   markerStart,
    //   interactionWidth,
    // }: StraightEdgeProps) => {
  ) => {


    // const [path, labelX, labelY]
      
    const makePath = () => getStraightPath({
      sourceX: p.sourceX,
      sourceY: p.sourceY,
      
      targetX: p.targetX,
      
      targetY: p.targetY,
    });

    const path = () => makePath()[0];
    const labelX = () => makePath()[1];
    const labelY = () => makePath()[2];

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

const StraightEdge = createStraightEdge({ isInternal: false });
const StraightEdgeInternal = createStraightEdge({ isInternal: true });

// TODO: add these back 
// StraightEdge.displayName = 'StraightEdge';
// StraightEdgeInternal.displayName = 'StraightEdgeInternal';

export { StraightEdge, StraightEdgeInternal };

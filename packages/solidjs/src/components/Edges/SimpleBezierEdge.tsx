import { Position, getBezierEdgeCenter } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SimpleBezierEdgeProps } from '../../types';
import { Component, mergeProps } from 'solid-js';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }

  return [x1, 0.5 * (y1 + y2)];
}

export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetSimpleBezierPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
}

function createSimpleBezierEdge(params: { isInternal: boolean }): Component<SimpleBezierEdgeProps> {
  return (_p: SimpleBezierEdgeProps) => {
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
    //   interactionWidth,
    // }: SimpleBezierEdgeProps) => {

    const p = mergeProps(
      {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      _p
    );


    // const [path, labelX, labelY]
        
    const _path = () => getSimpleBezierPath({
      sourceX: p.sourceX,
      sourceY: p.sourceY,
      sourcePosition: p.sourcePosition,
      targetX: p.targetX,
      targetY: p.targetY,
      targetPosition: p.targetPosition,
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

const SimpleBezierEdge = createSimpleBezierEdge({ isInternal: false });
const SimpleBezierEdgeInternal = createSimpleBezierEdge({ isInternal: true });

// TODO: add these back 
// SimpleBezierEdge.displayName = 'SimpleBezierEdge';
// SimpleBezierEdgeInternal.displayName = 'SimpleBezierEdgeInternal';

export { SimpleBezierEdge, SimpleBezierEdgeInternal };

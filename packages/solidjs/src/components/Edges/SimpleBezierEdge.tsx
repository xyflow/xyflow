import { Position, getBezierEdgeCenter } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SimpleBezierEdgeProps } from '../../types';
import { Component, mergeProps, createMemo } from 'solid-js';

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
    const p = mergeProps(
      {
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      _p
    );

    const pathData = createMemo(() =>
      getSimpleBezierPath({
        sourceX: p.sourceX,
        sourceY: p.sourceY,
        sourcePosition: p.sourcePosition,
        targetX: p.targetX,
        targetY: p.targetY,
        targetPosition: p.targetPosition,
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

const SimpleBezierEdge = createSimpleBezierEdge({ isInternal: false });
const SimpleBezierEdgeInternal = createSimpleBezierEdge({ isInternal: true });

// TODO: add these back
// SimpleBezierEdge.displayName = 'SimpleBezierEdge';
// SimpleBezierEdgeInternal.displayName = 'SimpleBezierEdgeInternal';

export { SimpleBezierEdge, SimpleBezierEdgeInternal };

import { memo } from 'react';
import { Position, getBezierEdgeCenter } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SimpleBezierEdgeProps } from '../../types';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  /** @default Position.Bottom */
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  /** @default Position.Top */
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

/**
 * The `getSimpleBezierPath` util returns everything you need to render a simple
 * bezier edge between two nodes.
 * @public
 * @returns
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 */
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

function createSimpleBezierEdge(params: { isInternal: boolean }) {
  // eslint-disable-next-line react/display-name
  return memo(
    ({
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      label,
      labelStyle,
      labelShowBg,
      labelBgStyle,
      labelBgPadding,
      labelBgBorderRadius,
      style,
      markerEnd,
      markerStart,
      interactionWidth,
    }: SimpleBezierEdgeProps) => {
      const [path, labelX, labelY] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

      const _id = params.isInternal ? undefined : id;

      return (
        <BaseEdge
          id={_id}
          path={path}
          labelX={labelX}
          labelY={labelY}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
          style={style}
          markerEnd={markerEnd}
          markerStart={markerStart}
          interactionWidth={interactionWidth}
        />
      );
    }
  );
}

const SimpleBezierEdge = createSimpleBezierEdge({ isInternal: false });
const SimpleBezierEdgeInternal = createSimpleBezierEdge({ isInternal: true });

SimpleBezierEdge.displayName = 'SimpleBezierEdge';
SimpleBezierEdgeInternal.displayName = 'SimpleBezierEdgeInternal';

export { SimpleBezierEdge, SimpleBezierEdgeInternal };

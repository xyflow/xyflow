/* eslint-disable react/prop-types */
import { FC } from 'react';
import { Position, getBezierPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { BezierEdgeProps } from '../../types';

const createBezierEdge = (params: { isInternal: boolean }): FC<BezierEdgeProps> =>
  function MyComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    markerEnd,
    markerStart,
    pathOptions,
    interactionWidth,
  }) {
    'use memo'; // Hint for the React Compiler to treat this as a component
    const [path, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: pathOptions?.curvature,
    });
    return (
      <BaseEdge
        id={params.isInternal ? undefined : id}
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
  };

/**
 * Component that can be used inside a custom edge to render a bezier curve.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { BezierEdge } from '@xyflow/react';
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
BezierEdge.displayName = 'BezierEdge';
/**
 * @internal
 */
const BezierEdgeInternal = createBezierEdge({ isInternal: true });
BezierEdgeInternal.displayName = 'BezierEdgeInternal';

export { BezierEdge, BezierEdgeInternal };

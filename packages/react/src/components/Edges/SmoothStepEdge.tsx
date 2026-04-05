/* eslint-disable react/prop-types */
import { FC } from 'react';
import { Position, getSmoothStepPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { SmoothStepEdgeProps } from '../../types';

const createSmoothStepEdge = (params: { isInternal: boolean }): FC<SmoothStepEdgeProps> =>
  function MyComponent({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    markerEnd,
    markerStart,
    pathOptions,
    interactionWidth,
  }) {
    'use memo';
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: pathOptions?.borderRadius,
      offset: pathOptions?.offset,
      stepPosition: pathOptions?.stepPosition,
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
  };

/**
 * Component that can be used inside a custom edge to render a smooth step edge.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { SmoothStepEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <SmoothStepEdge
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
const SmoothStepEdge = createSmoothStepEdge({ isInternal: false });
SmoothStepEdge.displayName = 'SmoothStepEdge';
/**
 * @internal
 */
const SmoothStepEdgeInternal = createSmoothStepEdge({ isInternal: true });
SmoothStepEdgeInternal.displayName = 'SmoothStepEdgeInternal';

export { SmoothStepEdge, SmoothStepEdgeInternal };

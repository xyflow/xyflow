import { memo } from 'react';

import { SmoothStepEdge } from './SmoothStepEdge';
import type { StepEdgeProps } from '../../types';

function createStepEdge(params: { isInternal: boolean }) {
  function StepEdgeComponent({ id, ...props }: StepEdgeProps) {
    const _id = params.isInternal ? undefined : id;

    return <SmoothStepEdge {...props} id={_id} pathOptions={{ borderRadius: 0, offset: props.pathOptions?.offset }} />;
  }

  StepEdgeComponent.displayName = params.isInternal ? 'StepEdgeInternal' : 'StepEdge';
  return memo(StepEdgeComponent);
}

/**
 * Component that can be used inside a custom edge to render a step edge.
 *
 * @public
 * @example
 *
 * ```tsx
 * import { StepEdge } from '@xyflow/react';
 *
 * function CustomEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition }) {
 *   return (
 *     <StepEdge
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
const StepEdge = createStepEdge({ isInternal: false });

/**
 * @internal
 */
const StepEdgeInternal = createStepEdge({ isInternal: true });

export { StepEdge, StepEdgeInternal };

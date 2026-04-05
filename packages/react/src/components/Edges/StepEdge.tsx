/* eslint-disable react/prop-types */
import { SmoothStepEdge } from './SmoothStepEdge';
import type { StepEdgeProps } from '../../types';

const createStepEdge = (params: { isInternal: boolean }) =>
  function MyComponent({ id, ...props }: StepEdgeProps) {
    'use memo'; // Hint for the React Compiler to treat this as a component
    return (
      <SmoothStepEdge
        {...props}
        id={params.isInternal ? undefined : id}
        pathOptions={{ borderRadius: 0, offset: props.pathOptions?.offset }}
      />
    );
  };

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
const StepEdge = Object.assign(createStepEdge({ isInternal: false }), {
  displayName: 'StepEdge',
});

/**
 * @internal
 */
const StepEdgeInternal = Object.assign(createStepEdge({ isInternal: true }), {
  displayName: 'StepEdgeInternal',
});

export { StepEdge, StepEdgeInternal };

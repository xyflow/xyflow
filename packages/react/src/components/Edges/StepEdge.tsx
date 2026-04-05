/* eslint-disable react/prop-types */
import type { FC } from 'react';

import { SmoothStepEdge } from './SmoothStepEdge';
import type { StepEdgeProps } from '../../types';

const createStepEdge = (params: { isInternal: boolean }): FC<StepEdgeProps> =>
  function MyComponent({ id, ...props }) {
    // Hint for the React Compiler to treat this as a component
    'use memo';
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
const StepEdge = createStepEdge({ isInternal: false });
StepEdge.displayName = 'StepEdge';

/**
 * @internal
 */
const StepEdgeInternal = createStepEdge({ isInternal: true });
StepEdgeInternal.displayName = 'StepEdgeInternal';

export { StepEdge, StepEdgeInternal };

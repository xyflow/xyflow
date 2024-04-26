import { SmoothStepEdge } from './SmoothStepEdge';
import type { StepEdgeProps } from '../../types';
import { Component } from 'solid-js';

function createStepEdge(params: { isInternal: boolean }): Component<StepEdgeProps> {
  return (p: StepEdgeProps) => {
    const _id = () => (params.isInternal ? undefined : p.id);

    const options = () => ({ borderRadius: 0, offset: p.pathOptions?.offset });

    return <SmoothStepEdge {...p} id={_id()} pathOptions={options()} />;
  };
}

const StepEdge = createStepEdge({ isInternal: false });
const StepEdgeInternal = createStepEdge({ isInternal: true });

// TODO: add these back
// StepEdge.displayName = 'StepEdge';
// StepEdgeInternal.displayName = 'StepEdgeInternal';

export { StepEdge, StepEdgeInternal };

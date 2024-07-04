import { memo, useMemo } from 'react';

import { SmoothStepEdge } from './SmoothStepEdge';
import type { StepEdgeProps } from '../../types';

function createStepEdge(params: { isInternal: boolean }) {
  // eslint-disable-next-line react/display-name
  return memo(({ id, ...props }: StepEdgeProps) => {
    const _id = params.isInternal ? undefined : id;

    return (
      <SmoothStepEdge
        {...props}
        id={_id}
        pathOptions={useMemo(
          () => ({ borderRadius: 0, offset: props.pathOptions?.offset }),
          [props.pathOptions?.offset]
        )}
      />
    );
  });
}

const StepEdge = createStepEdge({ isInternal: false });
const StepEdgeInternal = createStepEdge({ isInternal: true });

StepEdge.displayName = 'StepEdge';
StepEdgeInternal.displayName = 'StepEdgeInternal';

export { StepEdge, StepEdgeInternal };

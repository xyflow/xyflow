import { memo, useMemo } from 'react';

import SmoothStepEdgeInternal from './SmoothStepEdgeInternal';
import type { SmoothStepEdgeProps } from '../../types';

const StepEdge = memo((props: SmoothStepEdgeProps) => (
  <SmoothStepEdgeInternal
    {...props}
    pathOptions={useMemo(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset])}
  />
));

StepEdge.displayName = 'StepEdge';

export default StepEdge;

import { memo, useMemo } from 'react';

import SmoothStepEdge from './SmoothStepEdge';
import type { SmoothStepEdgeProps } from '../../types';

const StepEdge = memo((props: SmoothStepEdgeProps) => (
  <SmoothStepEdge
    {...props}
    pathOptions={useMemo(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset])}
  />
));

StepEdge.displayName = 'StepEdge';

export default StepEdge;

import { memo, useMemo } from 'react';

import { SmoothStepEdgeProps } from '../../types';
import SmoothStepEdge from './SmoothStepEdge';

const StepEdge = memo((props: SmoothStepEdgeProps) => (
  <SmoothStepEdge
    {...props}
    pathOptions={useMemo(() => ({ borderRadius: 0, offset: props.pathOptions?.offset }), [props.pathOptions?.offset])}
  />
));

StepEdge.displayName = 'StepEdge';

export default StepEdge;

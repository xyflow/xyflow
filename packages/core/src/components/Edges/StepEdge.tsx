import { memo } from 'react';

import { EdgeSmoothStepProps } from '../../types';
import SmoothStepEdge from './SmoothStepEdge';

const StepEdge = memo((props: EdgeSmoothStepProps) => <SmoothStepEdge {...props} borderRadius={0} />);

StepEdge.displayName = 'StepEdge';

export default StepEdge;

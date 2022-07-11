import React, { memo } from 'react';

import { EdgeSmoothStepProps } from '../../types';
import SmoothStepEdge from './SmoothStepEdge';

export default memo((props: EdgeSmoothStepProps) => {
  return <SmoothStepEdge {...props} borderRadius={0} />;
});

import React, { memo } from 'react';

import BezierEdge, { getBezierPath, GetBezierPathParams } from './BezierEdge';
import { EdgeProps } from '../../types';

export function getSimpleBezierPath(props: GetBezierPathParams): string {
  return getBezierPath({ ...props, curvature: 0 });
}

export default memo((props: EdgeProps) => {
  return <BezierEdge {...props} curvature={0} />;
});

import { memo } from 'react';
import { Position, getBezierPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { BezierEdgeProps } from '../../types';

function createBezierEdge(params: { isInternal: boolean }) {
  // eslint-disable-next-line react/display-name
  return memo(
    ({
      id,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition = Position.Bottom,
      targetPosition = Position.Top,
      pathOptions,
      ...props
    }: BezierEdgeProps) => {
      const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: pathOptions?.curvature,
      });

      const _id = params.isInternal ? undefined : id;

      return <BaseEdge {...props} id={_id} path={path} labelX={labelX} labelY={labelY} />;
    }
  );
}

const BezierEdge = createBezierEdge({ isInternal: false });
const BezierEdgeInternal = createBezierEdge({ isInternal: true });

BezierEdge.displayName = 'BezierEdge';
BezierEdgeInternal.displayName = 'BezierEdgeInternal';

export { BezierEdge, BezierEdgeInternal };

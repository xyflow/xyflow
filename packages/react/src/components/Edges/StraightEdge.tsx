import { memo } from 'react';
import { getStraightPath } from '@xyflow/system';

import { BaseEdge } from './BaseEdge';
import type { StraightEdgeProps } from '../../types';

function createStraightEdge(params: { isInternal: boolean }) {
  // eslint-disable-next-line react/display-name
  return memo(({ id, sourceX, sourceY, targetX, targetY, ...props }: StraightEdgeProps) => {
    const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

    const _id = params.isInternal ? undefined : id;

    return <BaseEdge {...props} id={_id} path={path} labelX={labelX} labelY={labelY} />;
  });
}

const StraightEdge = createStraightEdge({ isInternal: false });
const StraightEdgeInternal = createStraightEdge({ isInternal: true });

StraightEdge.displayName = 'StraightEdge';
StraightEdgeInternal.displayName = 'StraightEdgeInternal';

export { StraightEdge, StraightEdgeInternal };

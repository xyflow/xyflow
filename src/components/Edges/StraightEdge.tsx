import React, { memo } from 'react';

import { EdgeProps } from '../../types';

export default memo(({
  sourceX, sourceY, targetX, targetY, style = {}
}: EdgeProps) => {
  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
});

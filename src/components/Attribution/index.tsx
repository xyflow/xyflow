import React from 'react';
import cc from 'classcat';

import { AttributionPosition, ProOptions } from '../../types';

type AttributionProps = {
  pro?: ProOptions;
  position?: AttributionPosition;
};

function Attribution({ pro, position = 'bottom-right' }: AttributionProps) {
  if (pro?.account === 'paid-subscription' && pro?.hideAttribution) {
    return null;
  }

  const positionClasses = `${position}`.split('-');

  return (
    <div
      className={cc(['react-flow__attribution', ...positionClasses])}
      data-message="Please only hide this attribution when you have a pro account: reactflow.dev/pro"
    >
      <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer">
        React Flow
      </a>
    </div>
  );
}

export default Attribution;

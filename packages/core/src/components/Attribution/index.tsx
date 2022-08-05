import React from 'react';
import cc from 'classcat';

import { AttributionPosition, ProOptions } from '../../types';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: AttributionPosition;
};

function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  if (proOptions?.hideAttribution) {
    return null;
  }

  const positionClasses = `${position}`.split('-');

  return (
    <div
      className={cc(['react-flow__attribution', ...positionClasses])}
      data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev"
    >
      <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer" aria-label="React Flow attribution">
        React Flow
      </a>
    </div>
  );
}

export default Attribution;

import React from 'react';
import cc from 'classcat';

import { AttributionPosition, ProOptions } from '../../types';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: AttributionPosition;
};

const accounts = ['paid-pro', 'paid-sponsor', 'paid-enterprise', 'paid-custom'];

function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  if (proOptions?.account && accounts.includes(proOptions?.account) && proOptions?.hideAttribution) {
    return null;
  }

  const positionClasses = `${position}`.split('-');

  return (
    <div
      className={cc(['react-flow__attribution', ...positionClasses])}
      data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev/pricing"
    >
      <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer">
        React Flow
      </a>
    </div>
  );
}

export default Attribution;

import { useEffect } from 'react';
import { type PanelPosition, handleAttributionWarning } from '@xyflow/system';

import { Panel } from '../Panel';
import { type ProOptions } from '../../types/general';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

const link = `https://reactflow.dev${
  process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
}`;

/**
 * React Flow is independent and entirely funded by its users.
 * If you hide the attribution, please support our work by subscribing to React Flow Pro: https://reactflow.dev/remove-attribution
 */
export function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    handleAttributionWarning('react');
  }, []);

  if (proOptions?.hideAttribution) {
    return null;
  }

  return (
    <Panel
      position={position}
      className="react-flow__attribution"
      data-message={`Please only hide this attribution when you are subscribed to React Flow Pro: ${link}`}
    >
      <a href={link} target="_blank" rel="noopener noreferrer" aria-label="React Flow attribution">
        React Flow
      </a>
    </Panel>
  );
}

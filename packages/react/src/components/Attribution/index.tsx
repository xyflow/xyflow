import { useEffect, useRef } from 'react';
import { type PanelPosition, isDomNodeVisible } from '@xyflow/system';

import { Panel } from '../Panel';
import { type ProOptions } from '../../types/general';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

const link = `https://reactflow.dev${
  process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
}`;

const consoleLink = 'https://reactflow.dev/remove-attribution?utm_source=console';

/**
 * React Flow is independent and entirely funded by its users.
 * If you hide the attribution, please support our work by subscribing to React Flow Pro: https://reactflow.dev/remove-attribution
 */
export function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  const warned = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !warned.current) {
      setTimeout(() => {
        if (!isDomNodeVisible('.react-flow__attribution')) {
          console.warn(
            `React Flow: It seems like you are hiding the attribution. Please only do this when you are subscribed to React Flow Pro: ${consoleLink}\n%cYou can ignore this warning if you are subscribed.`,
            'font-style: italic;'
          );
        }
      }, 1000);

      warned.current = true;
    }
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

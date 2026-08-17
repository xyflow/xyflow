import type { PanelPosition, ProOptions } from '@xyflow/system';

import { Panel } from '../Panel';
import { useEffect, useRef } from 'react';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

const link = `https://reactflow.dev${
  process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
}`;

const consoleLink = 'https://reactflow.dev/attribution';

function isVisible(el: Element | null) {
  if (!el || !el.isConnected) return false;

  const style = getComputedStyle(el);

  if (style.display === 'none') return false;
  if (style.visibility === 'hidden' || style.visibility === 'collapse') return false;
  if (style.opacity === '0') return false;

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  return true;
}

export function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  const warned = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !warned.current) {
      setTimeout(() => {
        if (!isVisible(document.querySelector('.react-flow__attribution'))) {
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

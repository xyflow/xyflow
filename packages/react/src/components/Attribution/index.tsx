import type { PanelPosition, ProOptions } from '@xyflow/system';

import { Panel } from '../Panel';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

export function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
  if (proOptions?.hideAttribution) {
    return null;
  }

  return (
    <Panel
      position={position}
      className="react-flow__attribution"
      data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev"
    >
      <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer" aria-label="React Flow attribution">
        React Flow
      </a>
    </Panel>
  );
}

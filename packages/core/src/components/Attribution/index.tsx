import Panel from '../Panel';
import type { PanelPosition, ProOptions } from '../../types';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

function Attribution({ proOptions, position = 'bottom-right' }: AttributionProps) {
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

export default Attribution;

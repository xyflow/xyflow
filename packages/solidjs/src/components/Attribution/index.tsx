import type { PanelPosition, ProOptions } from '@xyflow/system';

import { Panel } from '../Panel';
import { Show, mergeProps } from 'solid-js';

type AttributionProps = {
  proOptions?: ProOptions;
  position?: PanelPosition;
};

export function Attribution(_p: AttributionProps ) {
  // { proOptions, position = 'bottom-right' }: AttributionProps) {
  const p = mergeProps({
    position: 'bottom-right' as PanelPosition,
  }, _p);

  // if (proOptions?.hideAttribution) {
  //   return null;
  // }

  const shouldHide = () => !!p.proOptions?.hideAttribution;

  return (
    <Show when={!shouldHide()}>
    <Panel
      position={p.position}
      class="react-flow__attribution"
      data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev"
    >
      <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer" aria-label="React Flow attribution">
        React Flow
      </a>
    </Panel>
    </Show>
  );
}

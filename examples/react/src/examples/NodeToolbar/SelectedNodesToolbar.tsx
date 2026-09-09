import { shallow, NodeToolbar, ReactFlowState, useReactFlowStore } from '@xyflow/react';

const selectedNodesSelector = (state: ReactFlowState) =>
  state.nodes.filter((node) => node.selected).map((node) => node.id);

export default function SelectedNodesToolbar() {
  const selectedNodeIds = useReactFlowStore(selectedNodesSelector, shallow);
  const isVisible = selectedNodeIds.length > 1;

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <button>Selection action</button>
    </NodeToolbar>
  );
}

import { NodeToolbar, ReactFlowState, useStore } from 'reactflow';

const selectedNodesSelector = (state: ReactFlowState) =>
  state
    .getNodes()
    .filter((node) => node.selected)
    .map((node) => node.id);

export default function SelectedNodesToolbar() {
  const selectedNodeIds = useStore(selectedNodesSelector);
  const isVisible = selectedNodeIds.length > 1;

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <button>Selection action</button>
    </NodeToolbar>
  );
}

import { NodeToolbar, NodesStore, useShallow, useNodesStore } from '@xyflow/react';

const selectedNodesSelector = (state: NodesStore) => state.nodes.filter((node) => node.selected).map((node) => node.id);

export default function SelectedNodesToolbar() {
  const selectedNodeIds = useNodesStore(useShallow(selectedNodesSelector));
  const isVisible = selectedNodeIds.length > 1;

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <button>Selection action</button>
    </NodeToolbar>
  );
}

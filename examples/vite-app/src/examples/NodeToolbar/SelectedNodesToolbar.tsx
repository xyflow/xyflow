import { NodeToolbar, useNodes } from 'reactflow';

export default function SelectedNodesToolbar() {
  const nodes = useNodes();
  const selectedNodeIds = nodes.filter((node) => node.selected).map((node) => node.id);
  const isVisible = selectedNodeIds.length > 1;

  return (
    <NodeToolbar nodeId={selectedNodeIds} isVisible={isVisible}>
      <button>Group selected nodes</button>
    </NodeToolbar>
  );
}

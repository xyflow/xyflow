import type { Edge, EdgeSelectionChange, Node, NodeSelectionChange, ReactFlowStoreApi } from '../types';

export function handleControlledSelectionChange<NodeOrEdge extends Node | Edge>(
  changes: NodeSelectionChange[] | EdgeSelectionChange[],
  items: NodeOrEdge[]
): NodeOrEdge[] {
  return items.map((item) => {
    const change = changes.find((change) => change.id === item.id);

    if (change) {
      item.selected = change.selected;
    }

    return item;
  });
}

type UpdateNodesAndEdgesParams = {
  changedNodes: NodeSelectionChange[] | null;
  changedEdges: EdgeSelectionChange[] | null;
  get: ReactFlowStoreApi['getState'];
  set: ReactFlowStoreApi['setState'];
};

export function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get, set }: UpdateNodesAndEdgesParams) {
  const { nodes, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();

  if (changedNodes?.length) {
    if (hasDefaultNodes) {
      set({ nodes: handleControlledSelectionChange(changedNodes, nodes) });
    }

    onNodesChange?.(changedNodes);
  }

  if (changedEdges?.length) {
    if (hasDefaultEdges) {
      set({ edges: handleControlledSelectionChange(changedEdges, edges) });
    }

    onEdgesChange?.(changedEdges);
  }
}

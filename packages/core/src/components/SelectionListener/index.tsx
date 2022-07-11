import { memo, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { ReactFlowState, OnSelectionChangeFunc, Node, Edge } from '../../types';
import { useStore } from '../../store';

interface SelectionListenerProps {
  onSelectionChange: OnSelectionChangeFunc;
}

const selector = (s: ReactFlowState) => ({
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
  selectedEdges: s.edges.filter((e) => e.selected),
});

const areEqual = (objA: any, objB: any) => {
  const selectedNodeIdsA = objA.selectedNodes.map((n: Node) => n.id);
  const selectedNodeIdsB = objB.selectedNodes.map((n: Node) => n.id);

  const selectedEdgeIdsA = objA.selectedEdges.map((e: Edge) => e.id);
  const selectedEdgeIdsB = objB.selectedEdges.map((e: Edge) => e.id);

  return shallow(selectedNodeIdsA, selectedNodeIdsB) && shallow(selectedEdgeIdsA, selectedEdgeIdsB);
};

// This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
function SelectionListener({ onSelectionChange }: SelectionListenerProps) {
  const { selectedNodes, selectedEdges } = useStore(selector, areEqual);

  useEffect(() => {
    onSelectionChange({ nodes: selectedNodes, edges: selectedEdges });
  }, [selectedNodes, selectedEdges]);

  return null;
}

export default memo(SelectionListener);

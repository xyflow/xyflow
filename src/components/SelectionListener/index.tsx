import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { ReactFlowState, OnSelectionChangeFunc } from '../../types';
import { useStore } from '../../store';

interface SelectionListenerProps {
  onSelectionChange: OnSelectionChangeFunc;
}

const selectedElementsSelector = (s: ReactFlowState) => ({
  selectedNodes: s.nodes.filter((n) => n.selected),
  selectedEdges: s.edges.filter((e) => e.selected),
});

// This is just a helper component for calling the onSelectionChange listener.

export default ({ onSelectionChange }: SelectionListenerProps) => {
  const { selectedNodes, selectedEdges } = useStore(selectedElementsSelector, shallow);

  useEffect(() => {
    onSelectionChange({ nodes: selectedNodes, edges: selectedEdges });
  }, [selectedNodes, selectedEdges]);

  return null;
};

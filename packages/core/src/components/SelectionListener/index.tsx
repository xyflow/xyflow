import { memo, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { ReactFlowState, OnSelectionChangeFunc, Node, Edge } from '../../types';

type SelectionListenerProps = {
  onSelectionChange?: OnSelectionChangeFunc;
};

const selector = (s: ReactFlowState) => ({
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
  selectedEdges: s.edges.filter((e) => e.selected),
});

type SelectorSlice = ReturnType<typeof selector>;

const selectId = (obj: Node | Edge) => obj.id;

function areEqual(a: SelectorSlice, b: SelectorSlice) {
  return (
    shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) &&
    shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId))
  );
}

// This is just a helper component for calling the onSelectionChange listener.
// @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
const SelectionListener = memo(({ onSelectionChange }: SelectionListenerProps) => {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore(selector, areEqual);

  useEffect(() => {
    const params = { nodes: selectedNodes, edges: selectedEdges };
    onSelectionChange?.(params);
    store.getState().onSelectionChange?.(params);
  }, [selectedNodes, selectedEdges, onSelectionChange]);

  return null;
});

SelectionListener.displayName = 'SelectionListener';

const changeSelector = (s: ReactFlowState) => !!s.onSelectionChange;

function Wrapper({ onSelectionChange }: SelectionListenerProps) {
  const storeHasSelectionChange = useStore(changeSelector);

  if (onSelectionChange || storeHasSelectionChange) {
    return <SelectionListener onSelectionChange={onSelectionChange} />;
  }

  return null;
}

export default Wrapper;

/*
 * This is a helper component for calling the onSelectionChange listener.
 * It will only be mounted if the user has passed an onSelectionChange listener
 * or is using the useOnSelectionChange hook.
 * @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
 */
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { ReactFlowState, OnSelectionChangeFunc, Node, Edge } from '../../types';

type SelectionListenerProps = {
  onSelectionChange?: OnSelectionChangeFunc;
};

const selector = (s: ReactFlowState) => {
  const selectedNodes = [];
  const selectedEdges = [];

  for (const [, node] of s.nodeLookup) {
    if (node.selected) {
      selectedNodes.push(node.internals.userNode);
    }
  }

  for (const [, edge] of s.edgeLookup) {
    if (edge.selected) {
      selectedEdges.push(edge);
    }
  }

  return { selectedNodes, selectedEdges };
};

type SelectorSlice = ReturnType<typeof selector>;

const selectId = (obj: Node | Edge) => obj.id;

function areEqual(a: SelectorSlice, b: SelectorSlice) {
  return (
    shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) &&
    shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId))
  );
}

function SelectionListenerInner({ onSelectionChange }: SelectionListenerProps) {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore(selector, areEqual);

  useEffect(() => {
    const params = { nodes: selectedNodes, edges: selectedEdges };

    onSelectionChange?.(params);
    store.getState().onSelectionChangeHandlers.forEach((fn) => fn(params));
  }, [selectedNodes, selectedEdges, onSelectionChange]);

  return null;
}

const changeSelector = (s: ReactFlowState) => !!s.onSelectionChangeHandlers;

export function SelectionListener({ onSelectionChange }: SelectionListenerProps) {
  const storeHasSelectionChangeHandlers = useStore(changeSelector);

  if (onSelectionChange || storeHasSelectionChangeHandlers) {
    return <SelectionListenerInner onSelectionChange={onSelectionChange} />;
  }

  return null;
}

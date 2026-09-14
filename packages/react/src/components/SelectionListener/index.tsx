/*
 * This is a helper component for calling the onSelectionChange listener.
 * It will only be mounted if the user has passed an onSelectionChange listener
 * or is using the useOnSelectionChange hook.
 * @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
 */
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import {
  useCustomDiff,
  useReactFlowStore,
  useNodesStore,
  useEdgesStore,
  useReactFlowStoreApi,
} from '../../hooks/useReactFlowStore';
import type { ReactFlowState, NodesStore, EdgesStore, OnSelectionChangeFunc, Node, Edge } from '../../types';

type SelectionListenerProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  onSelectionChange?: OnSelectionChangeFunc<NodeType, EdgeType>;
};

const nodesSelector = (s: NodesStore) => {
  const selectedNodes = [];

  for (const [, node] of s.nodeLookup) {
    if (node.selected) {
      selectedNodes.push(node.internals.userNode);
    }
  }

  return selectedNodes;
};

const edgesSelector = (s: EdgesStore) => {
  const selectedEdges = [];
  for (const [, edge] of s.edgeLookup) {
    if (edge.selected) {
      selectedEdges.push(edge);
    }
  }

  return selectedEdges;
};

const selectId = (obj: Node | Edge) => obj.id;

function areEqual(a: (Node | Edge)[], b: (Node | Edge)[]) {
  return shallow(a.map(selectId), b.map(selectId));
}

function SelectionListenerInner<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  onSelectionChange,
}: SelectionListenerProps<NodeType, EdgeType>) {
  const store = useReactFlowStoreApi<NodeType, EdgeType>();
  const selectedNodes = useNodesStore(useCustomDiff(nodesSelector, areEqual));
  const selectedEdges = useEdgesStore(useCustomDiff(edgesSelector, areEqual));

  useEffect(() => {
    // Either membership change should report the current objects from both stores.
    const params = {
      nodes: nodesSelector(store.nodesStore.getState()) as NodeType[],
      edges: edgesSelector(store.edgesStore.getState()) as EdgeType[],
    };

    onSelectionChange?.(params);
    store.getState().onSelectionChangeHandlers.forEach((fn) => fn(params));
  }, [selectedNodes, selectedEdges, onSelectionChange, store]);

  return null;
}

const changeSelector = (s: ReactFlowState) => !!s.onSelectionChangeHandlers;

export function SelectionListener<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  onSelectionChange,
}: SelectionListenerProps<NodeType, EdgeType>) {
  const storeHasSelectionChangeHandlers = useReactFlowStore(changeSelector);

  if (onSelectionChange || storeHasSelectionChangeHandlers) {
    return <SelectionListenerInner<NodeType, EdgeType> onSelectionChange={onSelectionChange} />;
  }

  return null;
}

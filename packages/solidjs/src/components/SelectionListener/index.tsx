/*
 * This is a helper component for calling the onSelectionChange listener.
 * It will only be mounted if the user has passed an onSelectionChange listener
 * or is using the useOnSelectionChange hook.
 * @TODO: Now that we have the onNodesChange and on EdgesChange listeners, do we still need this component?
 */

import { Show, createEffect } from 'solid-js';
import { useStore, useStoreApi } from '../../hooks/useStore';
import type { SolidFlowState, OnSelectionChangeFunc, Node, Edge } from '../../types';

type SelectionListenerProps = {
  onSelectionChange?: OnSelectionChangeFunc;
};

const selector = (s: SolidFlowState) => {
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

// type SelectorSlice = ReturnType<typeof selector>;

// const selectId = (obj: Node | Edge) => obj.id;

// function areEqual(a: SelectorSlice, b: SelectorSlice) {
//   return (
//     shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) &&
//     shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId))
//   );
// }

function SelectionListenerInner({ onSelectionChange }: SelectionListenerProps) {
  const store = useStoreApi();
  const storeData = useStore(selector);

  createEffect(() => {
    const params = { nodes: storeData.selectedNodes, edges: storeData.selectedEdges };

    onSelectionChange?.(params);
    store.onSelectionChangeHandlers.get().forEach((fn) => fn(params));
  });

  return null;
}

const changeSelector = (s: SolidFlowState) => !!s.onSelectionChangeHandlers;

export function SelectionListener(p: SelectionListenerProps) {
  const storeHasSelectionChangeHandlers = useStore(changeSelector);

  return (
    <Show when={storeHasSelectionChangeHandlers && p.onSelectionChange}>
      {(onSelectionChange) => {
        return <SelectionListenerInner onSelectionChange={onSelectionChange} />;
      }}
    </Show>
  );
}

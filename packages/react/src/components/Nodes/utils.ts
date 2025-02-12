import type { RefObject } from 'react';
import type { StoreApi } from 'zustand';
import { errorMessages } from '@xyflow/system';

import type { ReactFlowState } from '../../types';

/*
 * this handler is called by
 * 1. the click handler when node is not draggable or selectNodesOnDrag = false
 * or
 * 2. the on drag start handler when node is draggable and selectNodesOnDrag = true
 */
export function handleNodeClick({
  id,
  store,
  unselect = false,
  nodeRef,
}: {
  id: string;
  store: {
    getState: StoreApi<ReactFlowState>['getState'];
    setState: StoreApi<ReactFlowState>['setState'];
  };
  unselect?: boolean;
  nodeRef?: RefObject<HTMLDivElement>;
}) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeLookup, onError } = store.getState();
  const node = nodeLookup.get(id);

  if (!node) {
    onError?.('012', errorMessages['error012'](id));
    return;
  }

  store.setState({ nodesSelectionActive: false });

  if (!node.selected) {
    addSelectedNodes([id]);
  } else if (unselect || (node.selected && multiSelectionActive)) {
    unselectNodesAndEdges({ nodes: [node], edges: [] });

    requestAnimationFrame(() => nodeRef?.current?.blur());
  }
}

import type { RefObject } from 'react';
import { errorMessages } from '@xyflow/system';

import type { ReactFlowStoreApi } from '../../types';

/*
 * this handler is called by
 * 1. the click handler when node is not draggable or selectNodesOnDrag = false
 * or
 * 2. the on drag start handler when node is draggable and selectNodesOnDrag = true
 */
export function handleNodeClick({
  id,
  store,
  nodesStore,
  unselect = false,
  nodeRef,
}: {
  id: string;
  store: ReactFlowStoreApi['store'];
  nodesStore: ReactFlowStoreApi['nodesStore'];
  unselect?: boolean;
  nodeRef?: RefObject<HTMLDivElement>;
}) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, onError } = store.getState();
  const { nodeLookup } = nodesStore.getState();
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

import { MouseEvent } from 'react';
import { StoreApi } from 'zustand';

import { getDimensions } from '../../utils';
import { Position } from '../../types';
import type { HandleElement, Node, NodeOrigin, ReactFlowState } from '../../types';

export const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  zoom: number,
  nodeOrigin: NodeOrigin
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];
  const nodeBounds = nodeElement.getBoundingClientRect();
  const nodeOffset = {
    x: nodeBounds.width * nodeOrigin[0],
    y: nodeBounds.height * nodeOrigin[1],
  };

  return handlesArray.map((handle): HandleElement => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
      y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
      ...getDimensions(handle),
    };
  });
};

export function getMouseHandler(
  id: string,
  getState: StoreApi<ReactFlowState>['getState'],
  handler?: (event: MouseEvent, node: Node) => void
) {
  return handler === undefined
    ? handler
    : (event: MouseEvent) => {
        const node = getState().nodeInternals.get(id)!;
        handler(event, { ...node });
      };
}

// this handler is called by
// 1. the click handler when node is not draggable or selectNodesOnDrag = false
// or
// 2. the on drag start handler when node is draggable and selectNodesOnDrag = true
export function handleNodeClick({
  id,
  store,
  unselect = false,
}: {
  id: string;
  store: {
    getState: StoreApi<ReactFlowState>['getState'];
    setState: StoreApi<ReactFlowState>['setState'];
  };
  unselect?: boolean;
}) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals } = store.getState();
  const node = nodeInternals.get(id)!;

  store.setState({ nodesSelectionActive: false });

  if (!node.selected) {
    addSelectedNodes([id]);
  } else if (unselect || (node.selected && multiSelectionActive)) {
    unselectNodesAndEdges({ nodes: [node] });
  }
}

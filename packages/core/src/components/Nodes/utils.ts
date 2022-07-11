import { MouseEvent } from 'react';
import { GetState, SetState } from 'zustand';

import { HandleElement, Node, Position, ReactFlowState } from '../../types';
import { getDimensions } from '../../utils';

export const getHandleBounds = (nodeElement: HTMLDivElement, scale: number) => {
  const bounds = nodeElement.getBoundingClientRect();

  return {
    source: getHandleBoundsByHandleType('.source', nodeElement, bounds, scale),
    target: getHandleBoundsByHandleType('.target', nodeElement, bounds, scale),
  };
};

export const getHandleBoundsByHandleType = (
  selector: string,
  nodeElement: HTMLDivElement,
  parentBounds: DOMRect,
  k: number
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  return handlesArray.map((handle): HandleElement => {
    const bounds = handle.getBoundingClientRect();
    const dimensions = getDimensions(handle);
    const handleId = handle.getAttribute('data-handleid');
    const handlePosition = handle.getAttribute('data-handlepos') as unknown as Position;

    return {
      id: handleId,
      position: handlePosition,
      x: (bounds.left - parentBounds.left) / k,
      y: (bounds.top - parentBounds.top) / k,
      ...dimensions,
    };
  });
};

export function getMouseHandler(
  id: string,
  getState: GetState<ReactFlowState>,
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
}: {
  id: string;
  store: {
    getState: GetState<ReactFlowState>;
    setState: SetState<ReactFlowState>;
  };
}) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals } = store.getState();
  const node = nodeInternals.get(id)!;

  store.setState({ nodesSelectionActive: false });

  if (!node.selected) {
    addSelectedNodes([id]);
  } else if (node.selected && multiSelectionActive) {
    unselectNodesAndEdges({ nodes: [node] });
  }
}

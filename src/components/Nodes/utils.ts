import { MouseEvent } from 'react';
import { GetState, SetState } from 'zustand';

import { HandleElement, Node, Position, ReactFlowState } from '../../types';
import { getDimensions } from '../../utils';

function getTranslateValues(domNode: HTMLDivElement): [number, number] {
  if (typeof window === 'undefined' || !window.DOMMatrixReadOnly) {
    return [0, 0];
  }

  const style = window.getComputedStyle(domNode);
  const { m41, m42 } = new window.DOMMatrixReadOnly(style.transform);
  return [m41, m42];
}

export const getHandleBounds = (selector: string, nodeElement: HTMLDivElement): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  return handlesArray.map((handle): HandleElement => {
    // we don't use getBoundingClientRect here, because it includes the transform of the parent (scaled viewport)
    // that we would then need to calculate out again in order to get the correct position.
    const [translateX, translateY] = getTranslateValues(handle);

    return {
      id: handle.getAttribute('data-handleid'),
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: handle.offsetLeft + nodeElement.clientLeft + translateX,
      y: handle.offsetTop + nodeElement.clientTop + translateY,
      ...getDimensions(handle),
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

import { get, type Writable } from 'svelte/store';
import { drag as d3Drag, type D3DragEvent, type SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';
import type { XYPosition, CoordinateExtent, Transform } from '@reactflow/system';

import { getDragItems, hasSelector, calcNextPosition } from './utils';
import type { Node } from '$lib/types';
import type { SvelteFlowStore } from '$lib/store/types';

export type UseDragData = { dx: number; dy: number };
export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type NodeDragItem = {
  id: string;
  position: XYPosition;
  positionAbsolute: XYPosition;
  // distance from the mouse cursor to the node when start dragging
  distance: XYPosition;
  width?: number | null;
  height?: number | null;
  extent?: 'parent' | CoordinateExtent;
  parentNode?: string;
  dragging?: boolean;
};

type UseDragParams = {
  handleSelector?: string;
  nodeId?: string;
  updateNodePositions: (dragItems: NodeDragItem[], d: boolean, p: boolean) => void;
  nodes: SvelteFlowStore['nodes'];
  transform: SvelteFlowStore['transform'];
  snapGrid: SvelteFlowStore['snapGrid'];
};

export default function drag(
  nodeRef: Element,
  {
    handleSelector,
    nodeId,
    updateNodePositions,
    nodes,
    transform: transformStore,
    snapGrid: snapGridStore
  }: UseDragParams
) {
  let dragging = false;
  let dragItems: NodeDragItem[] = [];
  let lastPos: { x: number | null; y: number | null } = { x: null, y: null };

  const selection = select(nodeRef);

  const getPointerPosition = ({ sourceEvent }: UseDragEvent) => {
    const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
    const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
    const transform = get(transformStore);
    const snapGrid = get(snapGridStore);

    const pointerPos = {
      x: (x - transform[0]) / transform[2],
      y: (y - transform[1]) / transform[2]
    };

    // we need the snapped position in order to be able to skip unnecessary drag events
    return {
      xSnapped: snapGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
      ySnapped: snapGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
      ...pointerPos
    };
  };

  const updateNodes = ({ x, y }: XYPosition) => {
    let hasChange = false;
    const snapGrid = get(snapGridStore);

    dragItems = dragItems.map((n) => {
      const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };

      if (snapGrid) {
        nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
        nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
      }

      const updatedPos = calcNextPosition(n, nextPosition, get(nodes));

      // we want to make sure that we only fire a change event when there is a changes
      hasChange =
        hasChange ||
        n.position.x !== updatedPos.position.x ||
        n.position.y !== updatedPos.position.y;

      n.position = updatedPos.position;
      n.positionAbsolute = updatedPos.positionAbsolute;

      return n;
    });

    if (!hasChange) {
      return;
    }

    updateNodePositions(dragItems, true, true);
    dragging = true;
  };

  const dragHandler = d3Drag()
    .on('start', (event: UseDragEvent) => {
      const pointerPos = getPointerPosition(event);
      lastPos = pointerPos;
      dragItems = getDragItems(get(nodes), pointerPos, nodeId);
    })
    .on('drag', (event: UseDragEvent) => {
      const pointerPos = getPointerPosition(event);

      // skip events without movement
      if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems) {
        lastPos = pointerPos;
        updateNodes(pointerPos);
      }
    })
    .on('end', (event: UseDragEvent) => {
      dragging = false;

      if (dragItems) {
        updateNodePositions(dragItems, false, false);
      }
    })
    .filter((event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      const isDraggable =
        !event.button &&
        !hasSelector(target, '.nodrag', nodeRef) &&
        (!handleSelector || hasSelector(target, handleSelector, nodeRef));

      return isDraggable;
    });

  selection.call(dragHandler);
}

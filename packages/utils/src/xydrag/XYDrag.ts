import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import type { NodeDragItem, UseDragEvent, XYPosition } from '@reactflow/system';

import { calcAutoPan, getEventPosition } from '../';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition, wrapSelectionDragFunc } from './utils';

type XYDragParams = {
  domNode: Element;
  nodeId?: string;
  getStoreItemsItems: (items: string[]) => unknown[];
  getPointerPosition: (event: UseDragEvent) => XYPosition & { xSnapped: number; ySnapped: number };
  onDraggingChange: (dragging: boolean) => void;
  handleNodeClick?: () => void;
};

export type XYDragInstance = {
  enable: (p: DragEnableParams) => void;
  disable: () => void;
};

export type DragEnableParams = {
  noDragClassName?: string;
  handleSelector?: string;
  domNode: Element;
  isSelectable?: boolean;
  selectNodesOnDrag?: boolean;
};

export function XYDrag({
  domNode,
  nodeId: _nodeId,
  handleNodeClick: _handleNodeClick,
  getStoreItemsItems,
  getPointerPosition,
  onDraggingChange,
}: XYDragParams): XYDragInstance {
  let lastPos: { x: number | null; y: number | null } = { x: null, y: null };
  let autoPanId = 0;
  let dragItems: NodeDragItem[] = [];
  let autoPanStarted = false;
  let mousePosition: XYPosition = { x: 0, y: 0 };
  let dragEvent: MouseEvent | null = null;
  let containerBounds: DOMRect | null = null;

  const getStoreItems = getStoreItemsItems;
  const getPointer = getPointerPosition;

  const d3Selection = select(domNode);
  const nodeId = _nodeId;
  const handleNodeClick = _handleNodeClick;

  const updateNodes = ({ x, y }: XYPosition) => {
    const [
      nodeInternals,
      onNodeDrag,
      onSelectionDrag,
      updateNodePositions,
      nodeExtent,
      snapGrid,
      snapToGrid,
      nodeOrigin,
      onError,
    ] = getStoreItems([
      'nodeInternals',
      'onNodeDrag',
      'onSelectionDrag',
      'updateNodePositions',
      'nodeExtent',
      'snapGrid',
      'snapToGrid',
      'nodeOrigin',
      'onError',
    ]);

    lastPos = { x, y };

    let hasChange = false;
    const nodes = Array.from(nodeInternals.values());

    dragItems = dragItems.map((n) => {
      const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };

      if (snapToGrid) {
        nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
        nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
      }

      const updatedPos = calcNextPosition(n, nextPosition, nodes, nodeExtent, nodeOrigin, onError);

      // we want to make sure that we only fire a change event when there is a changes
      hasChange = hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;

      n.position = updatedPos.position;
      n.positionAbsolute = updatedPos.positionAbsolute;

      return n;
    });

    if (!hasChange) {
      return;
    }

    updateNodePositions(dragItems, true, true);
    onDraggingChange(true);

    const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);

    if (onDrag && dragEvent) {
      const [currentNode, currentNodes] = getEventHandlerParams({
        nodeId,
        dragItems: dragItems,
        nodes,
      });
      onDrag(dragEvent as MouseEvent, currentNode, currentNodes);
    }
  };

  const autoPan = (): void => {
    if (!containerBounds) {
      return;
    }

    const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds);

    if (xMovement !== 0 || yMovement !== 0) {
      const [transform, panBy] = getStoreItems(['transform', 'panBy']);

      lastPos.x = (lastPos.x ?? 0) - xMovement / transform[2];
      lastPos.y = (lastPos.y ?? 0) - yMovement / transform[2];

      if (panBy({ x: xMovement, y: yMovement })) {
        updateNodes(lastPos as XYPosition);
      }
    }
    autoPanId = requestAnimationFrame(autoPan);
  };

  // public functions

  function enable({ noDragClassName, handleSelector, domNode, isSelectable, selectNodesOnDrag }: DragEnableParams) {
    const d3DragInstance = drag()
      .on('start', (event: UseDragEvent) => {
        const [
          nodeInternals,
          multiSelectionActive,
          domNode,
          nodesDraggable,
          unselectNodesAndEdges,
          onNodeDragStart,
          onSelectionDragStart,
        ] = getStoreItems([
          'nodeInternals',
          'multiSelectionActive',
          'domNode',
          'nodesDraggable',
          'unselectNodesAndEdges',
          'onNodeDragStart',
          'onSelectionDragStart',
        ]);

        const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);

        if (!selectNodesOnDrag && !multiSelectionActive && nodeId) {
          if (!nodeInternals.get(nodeId)?.selected) {
            // we need to reset selected nodes when selectNodesOnDrag=false
            unselectNodesAndEdges();
          }
        }

        if (isSelectable && selectNodesOnDrag) {
          handleNodeClick?.();
        }

        const pointerPos = getPointer(event);
        const nodes = Array.from(nodeInternals.values());
        lastPos = pointerPos;
        dragItems = getDragItems(nodes, nodesDraggable, pointerPos, nodeId);

        if (onStart && dragItems) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodes,
          });
          onStart(event.sourceEvent as MouseEvent, currentNode, currentNodes);
        }

        containerBounds = domNode?.getBoundingClientRect() || null;
        mousePosition = getEventPosition(event.sourceEvent, containerBounds!);
      })
      .on('drag', (event: UseDragEvent) => {
        const pointerPos = getPointer(event);
        const [autoPanOnNodeDrag] = getStoreItems(['autoPanOnNodeDrag']);

        if (!autoPanStarted && autoPanOnNodeDrag) {
          autoPanStarted = true;
          autoPan();
        }

        // skip events without movement
        if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems) {
          dragEvent = event.sourceEvent as MouseEvent;
          mousePosition = getEventPosition(event.sourceEvent, containerBounds!);

          updateNodes(pointerPos);
        }
      })
      .on('end', (event: UseDragEvent) => {
        onDraggingChange(false);
        autoPanStarted = false;
        cancelAnimationFrame(autoPanId);

        if (dragItems) {
          const [updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop] = getStoreItems([
            'updateNodePositions',
            'nodeInternals',
            'onNodeDragStop',
            'onSelectionDragStop',
          ]);
          const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
          const nodes = Array.from(nodeInternals.values());

          updateNodePositions(dragItems, false, false);

          if (onStop) {
            const [currentNode, currentNodes] = getEventHandlerParams({
              nodeId,
              dragItems,
              nodes,
            });
            onStop(event.sourceEvent as MouseEvent, currentNode, currentNodes);
          }
        }
      })
      .filter((event: MouseEvent) => {
        const target = event.target as HTMLDivElement;
        const isDraggable =
          !event.button &&
          (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, domNode)) &&
          (!handleSelector || hasSelector(target, handleSelector, domNode));

        return isDraggable;
      });

    d3Selection.call(d3DragInstance);
  }

  function disable() {
    d3Selection.on('.drag', null);
  }

  return {
    enable,
    disable,
  };
}

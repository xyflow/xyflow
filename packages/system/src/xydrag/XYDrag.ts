import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import {
  calcAutoPan,
  getEventPosition,
  getPointerPosition,
  calcNextPosition,
  snapPosition,
  getRectOfNodes,
  rectToBox,
} from '../utils';
import { getDragItems, getEventHandlerParams, hasSelector, wrapSelectionDragFunc } from './utils';
import type {
  NodeBase,
  NodeDragItem,
  UseDragEvent,
  XYPosition,
  EdgeBase,
  CoordinateExtent,
  NodeOrigin,
  OnError,
  SnapGrid,
  Transform,
  PanBy,
  OnNodeDrag,
  OnSelectionDrag,
  UpdateNodePositions,
  Box,
} from '../types';

export type OnDrag = (event: MouseEvent, dragItems: NodeDragItem[], node: NodeBase, nodes: NodeBase[]) => void;

type StoreItems = {
  nodes: NodeBase[];
  edges: EdgeBase[];
  nodeExtent: CoordinateExtent;
  snapGrid: SnapGrid;
  snapToGrid: boolean;
  nodeOrigin: NodeOrigin;
  multiSelectionActive: boolean;
  domNode?: Element | null;
  transform: Transform;
  autoPanOnNodeDrag: boolean;
  nodesDraggable: boolean;
  selectNodesOnDrag: boolean;
  nodeDragThreshold: number;
  panBy: PanBy;
  unselectNodesAndEdges: (params?: { nodes?: NodeBase[]; edges?: EdgeBase[] }) => void;
  onError?: OnError;
  onNodeDragStart?: OnNodeDrag;
  onNodeDrag?: OnNodeDrag;
  onNodeDragStop?: OnNodeDrag;
  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;
  updateNodePositions: UpdateNodePositions;
};

export type XYDragParams = {
  domNode: Element;
  getStoreItems: () => StoreItems;
  onDragStart?: OnDrag;
  onDrag?: OnDrag;
  onDragStop?: OnDrag;
  onNodeMouseDown?: (id: string) => void;
};

export type XYDragInstance = {
  update: (params: DragUpdateParams) => void;
  destroy: () => void;
};

export type DragUpdateParams = {
  noDragClassName?: string;
  handleSelector?: string;
  isSelectable?: boolean;
  nodeId?: string;
  domNode: Element;
};

export function XYDrag({
  domNode,
  onNodeMouseDown,
  getStoreItems,
  onDragStart,
  onDrag,
  onDragStop,
}: XYDragParams): XYDragInstance {
  let lastPos: { x: number | null; y: number | null } = { x: null, y: null };
  let autoPanId = 0;
  let dragItems: NodeDragItem[] = [];
  let autoPanStarted = false;
  let mousePosition: XYPosition = { x: 0, y: 0 };
  let dragEvent: MouseEvent | null = null;
  let containerBounds: DOMRect | null = null;
  let dragStarted = false;

  const d3Selection = select(domNode);

  // public functions
  function update({ noDragClassName, handleSelector, domNode, isSelectable, nodeId }: DragUpdateParams) {
    function updateNodes({ x, y }: XYPosition) {
      const {
        nodes,
        nodeExtent,
        snapGrid,
        snapToGrid,
        nodeOrigin,
        onNodeDrag,
        onSelectionDrag,
        onError,
        updateNodePositions,
      } = getStoreItems();

      lastPos = { x, y };

      let hasChange = false;
      let nodesBox: Box = { x: 0, y: 0, x2: 0, y2: 0 };

      if (dragItems.length > 1 && nodeExtent) {
        const rect = getRectOfNodes(dragItems as unknown as NodeBase[], nodeOrigin);
        nodesBox = rectToBox(rect);
      }

      dragItems = dragItems.map((n) => {
        let nextPosition = { x: x - n.distance.x, y: y - n.distance.y };

        if (snapToGrid) {
          nextPosition = snapPosition(nextPosition, snapGrid);
        }

        // if there is selection with multiple nodes and a node extent is set, we need to adjust the node extent for each node
        // based on its position so that the node stays at it's position relative to the selection.
        const adjustedNodeExtent: CoordinateExtent = [
          [nodeExtent[0][0], nodeExtent[0][1]],
          [nodeExtent[1][0], nodeExtent[1][1]],
        ];

        if (dragItems.length > 1 && nodeExtent && !n.extent) {
          adjustedNodeExtent[0][0] = n.positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
          adjustedNodeExtent[1][0] = n.positionAbsolute.x + (n.width ?? 0) - nodesBox.x2 + nodeExtent[1][0];

          adjustedNodeExtent[0][1] = n.positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
          adjustedNodeExtent[1][1] = n.positionAbsolute.y + (n.height ?? 0) - nodesBox.y2 + nodeExtent[1][1];
        }

        const updatedPos = calcNextPosition(n, nextPosition, nodes, adjustedNodeExtent, nodeOrigin, onError);

        // we want to make sure that we only fire a change event when there is a change
        hasChange = hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;

        n.position = updatedPos.position;
        n.positionAbsolute = updatedPos.positionAbsolute;

        return n;
      });

      if (!hasChange) {
        return;
      }

      updateNodePositions(dragItems, true, true);
      const onNodeOrSelectionDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);

      if (dragEvent) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodes,
        });
        onDrag?.(dragEvent as MouseEvent, dragItems, currentNode, currentNodes);
        onNodeOrSelectionDrag?.(dragEvent as MouseEvent, currentNode, currentNodes);
      }
    }

    function autoPan() {
      if (!containerBounds) {
        return;
      }

      const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds);

      if (xMovement !== 0 || yMovement !== 0) {
        const { transform, panBy } = getStoreItems();

        lastPos.x = (lastPos.x ?? 0) - xMovement / transform[2];
        lastPos.y = (lastPos.y ?? 0) - yMovement / transform[2];

        if (panBy({ x: xMovement, y: yMovement })) {
          updateNodes(lastPos as XYPosition);
        }
      }
      autoPanId = requestAnimationFrame(autoPan);
    }

    function startDrag(event: UseDragEvent) {
      const {
        nodes,
        multiSelectionActive,
        nodesDraggable,
        transform,
        snapGrid,
        snapToGrid,
        selectNodesOnDrag,
        onNodeDragStart,
        onSelectionDragStart,
        unselectNodesAndEdges,
      } = getStoreItems();

      dragStarted = true;

      if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
        if (!nodes.find((n) => n.id === nodeId)?.selected) {
          // we need to reset selected nodes when selectNodesOnDrag=false
          unselectNodesAndEdges();
        }
      }

      if (isSelectable && selectNodesOnDrag && nodeId) {
        onNodeMouseDown?.(nodeId);
      }

      const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
      lastPos = pointerPos;
      dragItems = getDragItems(nodes, nodesDraggable, pointerPos, nodeId);

      const onNodeOrSelectionDragStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);

      if (dragItems) {
        const [currentNode, currentNodes] = getEventHandlerParams({
          nodeId,
          dragItems,
          nodes,
        });
        onDragStart?.(event.sourceEvent as MouseEvent, dragItems, currentNode, currentNodes);
        onNodeOrSelectionDragStart?.(event.sourceEvent as MouseEvent, currentNode, currentNodes);
      }
    }

    const d3DragInstance = drag()
      .on('start', (event: UseDragEvent) => {
        const { domNode, nodeDragThreshold, transform, snapGrid, snapToGrid } = getStoreItems();

        if (nodeDragThreshold === 0) {
          startDrag(event);
        }

        const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
        lastPos = pointerPos;
        containerBounds = domNode?.getBoundingClientRect() || null;
        mousePosition = getEventPosition(event.sourceEvent, containerBounds!);
      })
      .on('drag', (event: UseDragEvent) => {
        const { autoPanOnNodeDrag, transform, snapGrid, snapToGrid, nodeDragThreshold } = getStoreItems();
        const pointerPos = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });

        if (!autoPanStarted && autoPanOnNodeDrag && dragStarted) {
          autoPanStarted = true;
          autoPan();
        }

        if (!dragStarted) {
          const x = pointerPos.xSnapped - (lastPos.x ?? 0);
          const y = pointerPos.ySnapped - (lastPos.y ?? 0);
          const distance = Math.sqrt(x * x + y * y);

          if (distance > nodeDragThreshold) {
            startDrag(event);
          }
        }

        // skip events without movement
        if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems && dragStarted) {
          dragEvent = event.sourceEvent as MouseEvent;
          mousePosition = getEventPosition(event.sourceEvent, containerBounds!);

          updateNodes(pointerPos);
        }
      })
      .on('end', (event: UseDragEvent) => {
        if (!dragStarted) {
          return;
        }

        autoPanStarted = false;
        dragStarted = false;
        cancelAnimationFrame(autoPanId);

        if (dragItems) {
          const { nodes, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStoreItems();
          const onNodeOrSelectionDragStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);

          updateNodePositions(dragItems, false, false);

          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodes,
          });
          onDragStop?.(event.sourceEvent as MouseEvent, dragItems, currentNode, currentNodes);
          onNodeOrSelectionDragStop?.(event.sourceEvent as MouseEvent, currentNode, currentNodes);
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

  function destroy() {
    d3Selection.on('.drag', null);
  }

  return {
    update,
    destroy,
  };
}

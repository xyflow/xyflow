import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import type {
  BaseEdge,
  BaseNode,
  CoordinateExtent,
  NodeDragItem,
  NodeOrigin,
  OnError,
  SnapGrid,
  Transform,
  UseDragEvent,
  XYPosition,
  PanBy,
  OnNodeDrag,
  OnSelectionDrag,
  UpdateNodePositions,
} from '@reactflow/system';

import { calcAutoPan, getEventPosition } from '../';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition, wrapSelectionDragFunc } from './utils';

export type OnDrag = (event: MouseEvent, dragItems: NodeDragItem[], node: BaseNode, nodes: BaseNode[]) => void;

export type BaseStore = {
  nodes: BaseNode[];
  edges: BaseEdge[];
  nodeExtent: CoordinateExtent;
  snapGrid: SnapGrid;
  snapToGrid: boolean;
  nodeOrigin: NodeOrigin;
  multiSelectionActive: boolean;
  domNode?: Element | null;
  onError?: OnError;
  transform: Transform;
  panBy: PanBy;
  autoPanOnNodeDrag: boolean;
  nodesDraggable: boolean;
  unselectNodesAndEdges: () => void;
  onNodeDragStart?: OnNodeDrag;
  onNodeDrag?: OnNodeDrag;
  onNodeDragStop?: OnNodeDrag;
  onSelectionDragStart?: OnSelectionDrag;
  onSelectionDrag?: OnSelectionDrag;
  onSelectionDragStop?: OnSelectionDrag;
  updateNodePositions: UpdateNodePositions;
};

type XYDragParams = {
  domNode: Element;
  nodeId?: string;
  getStore: () => BaseStore;
  getPointerPosition: (event: UseDragEvent) => XYPosition & { xSnapped: number; ySnapped: number };
  onDragStart?: OnDrag;
  onDrag?: OnDrag;
  onDragStop?: OnDrag;
  onNodeClick?: () => void;
};

export type XYDragInstance = {
  update: (p: DragUpdateParams) => void;
  destroy: () => void;
};

export type DragUpdateParams = {
  noDragClassName?: string;
  handleSelector?: string;
  domNode: Element;
  isSelectable?: boolean;
  selectNodesOnDrag?: boolean;
};

export function XYDrag({
  domNode,
  nodeId: _nodeId,
  onNodeClick: _onNodeClick,
  getStore: _getStore,
  getPointerPosition,
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

  const getStore = _getStore;
  const getPointer = getPointerPosition;

  const d3Selection = select(domNode);
  const nodeId = _nodeId;
  const onNodeClick = _onNodeClick;
  const onDragStartInstance = onDragStart;
  const onDragInstance = onDrag;
  const onDragStopInstance = onDragStop;

  const updateNodes = ({ x, y }: XYPosition) => {
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
    } = getStore();

    lastPos = { x, y };

    let hasChange = false;

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
    const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);

    if (dragEvent) {
      const [currentNode, currentNodes] = getEventHandlerParams({
        nodeId,
        dragItems,
        nodes,
      });
      onDragInstance?.(dragEvent as MouseEvent, dragItems, currentNode, currentNodes);
      onDrag?.(dragEvent as MouseEvent, currentNode, currentNodes);
    }
  };

  const autoPan = (): void => {
    if (!containerBounds) {
      return;
    }

    const [xMovement, yMovement] = calcAutoPan(mousePosition, containerBounds);

    if (xMovement !== 0 || yMovement !== 0) {
      const { transform, panBy } = getStore();

      lastPos.x = (lastPos.x ?? 0) - xMovement / transform[2];
      lastPos.y = (lastPos.y ?? 0) - yMovement / transform[2];

      if (panBy({ x: xMovement, y: yMovement })) {
        updateNodes(lastPos as XYPosition);
      }
    }
    autoPanId = requestAnimationFrame(autoPan);
  };

  // public functions

  function update({ noDragClassName, handleSelector, domNode, isSelectable, selectNodesOnDrag }: DragUpdateParams) {
    const d3DragInstance = drag()
      .on('start', (event: UseDragEvent) => {
        const {
          nodes,
          multiSelectionActive,
          domNode,
          nodesDraggable,
          onNodeDragStart,
          onSelectionDragStart,
          unselectNodesAndEdges,
        } = getStore();

        if (!selectNodesOnDrag && !multiSelectionActive && nodeId) {
          if (!nodes.find((n) => n.id === nodeId)?.selected) {
            // we need to reset selected nodes when selectNodesOnDrag=false
            unselectNodesAndEdges();
          }
        }

        if (isSelectable && selectNodesOnDrag) {
          onNodeClick?.();
        }

        const pointerPos = getPointer(event);
        lastPos = pointerPos;
        dragItems = getDragItems(nodes, nodesDraggable, pointerPos, nodeId);

        const onDragStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);

        if (dragItems) {
          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodes,
          });
          onDragStartInstance?.(event.sourceEvent as MouseEvent, dragItems, currentNode, currentNodes);
          onDragStart?.(event.sourceEvent as MouseEvent, currentNode, currentNodes);
        }

        containerBounds = domNode?.getBoundingClientRect() || null;
        mousePosition = getEventPosition(event.sourceEvent, containerBounds!);
      })
      .on('drag', (event: UseDragEvent) => {
        const pointerPos = getPointer(event);
        const { autoPanOnNodeDrag } = getStore();

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
        autoPanStarted = false;
        cancelAnimationFrame(autoPanId);

        if (dragItems) {
          const { nodes, updateNodePositions, onNodeDragStop, onSelectionDragStop } = getStore();
          const onDragStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);

          updateNodePositions(dragItems, false, false);

          const [currentNode, currentNodes] = getEventHandlerParams({
            nodeId,
            dragItems,
            nodes,
          });
          onDragStopInstance?.(event.sourceEvent as MouseEvent, dragItems, currentNode, currentNodes);
          onDragStop?.(event.sourceEvent as MouseEvent, currentNode, currentNodes);
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

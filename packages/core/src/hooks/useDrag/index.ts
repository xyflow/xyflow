import { useEffect, useRef, useState } from 'react';
import type { RefObject, MouseEvent } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../../hooks/useStore';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition } from './utils';
import { handleNodeClick } from '../../components/Nodes/utils';
import useGetPointerPosition from '../useGetPointerPosition';
import { calcAutoPan, getEventPosition, rectToBox } from '../../utils';
import type {
  NodeDragItem,
  Node,
  SelectionDragHandler,
  UseDragEvent,
  XYPosition,
  Box,
  CoordinateExtent,
} from '../../types';
import { getNodesBounds } from '../../utils/graph';

export type UseDragData = { dx: number; dy: number };

type UseDragParams = {
  nodeRef: RefObject<Element>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  selectNodesOnDrag?: boolean;
};

function wrapSelectionDragFunc(selectionFunc?: SelectionDragHandler) {
  return (event: MouseEvent, _: Node, nodes: Node[]) => selectionFunc?.(event, nodes);
}

function useDrag({
  nodeRef,
  disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
  selectNodesOnDrag,
}: UseDragParams) {
  const store = useStoreApi();
  const [dragging, setDragging] = useState<boolean>(false);
  const dragItems = useRef<NodeDragItem[]>([]);
  const lastPos = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const autoPanId = useRef(0);
  const containerBounds = useRef<DOMRect | null>(null);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragEvent = useRef<MouseEvent | null>(null);
  const autoPanStarted = useRef(false);
  const dragStarted = useRef(false);

  const getPointerPosition = useGetPointerPosition();

  useEffect(() => {
    if (nodeRef?.current) {
      const selection = select(nodeRef.current);

      const updateNodes = ({ x, y }: XYPosition) => {
        const {
          nodeInternals,
          onNodeDrag,
          onSelectionDrag,
          updateNodePositions,
          nodeExtent,
          snapGrid,
          snapToGrid,
          nodeOrigin,
          onError,
        } = store.getState();

        lastPos.current = { x, y };

        let hasChange = false;
        let nodesBox: Box = { x: 0, y: 0, x2: 0, y2: 0 };

        if (dragItems.current.length > 1 && nodeExtent) {
          const rect = getNodesBounds(dragItems.current as unknown as Node[], nodeOrigin);
          nodesBox = rectToBox(rect);
        }

        dragItems.current = dragItems.current.map((n) => {
          const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };

          if (snapToGrid) {
            nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
            nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
          }

          // if there is selection with multiple nodes and a node extent is set, we need to adjust the node extent for each node
          // based on its position so that the node stays at it's position relative to the selection.
          const adjustedNodeExtent: CoordinateExtent = [
            [nodeExtent[0][0], nodeExtent[0][1]],
            [nodeExtent[1][0], nodeExtent[1][1]],
          ];

          if (dragItems.current.length > 1 && nodeExtent && !n.extent) {
            adjustedNodeExtent[0][0] = n.positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
            adjustedNodeExtent[1][0] = n.positionAbsolute.x + (n.width ?? 0) - nodesBox.x2 + nodeExtent[1][0];

            adjustedNodeExtent[0][1] = n.positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
            adjustedNodeExtent[1][1] = n.positionAbsolute.y + (n.height ?? 0) - nodesBox.y2 + nodeExtent[1][1];
          }

          const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, adjustedNodeExtent, nodeOrigin, onError);

          // we want to make sure that we only fire a change event when there is a change
          hasChange = hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;

          n.position = updatedPos.position;
          n.positionAbsolute = updatedPos.positionAbsolute;

          return n;
        });

        if (!hasChange) {
          return;
        }

        updateNodePositions(dragItems.current, true, true);
        setDragging(true);

        const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);

        if (onDrag && dragEvent.current) {
          const [currentNode, nodes] = getEventHandlerParams({
            nodeId,
            dragItems: dragItems.current,
            nodeInternals,
          });
          onDrag(dragEvent.current as MouseEvent, currentNode, nodes);
        }
      };

      const autoPan = (): void => {
        if (!containerBounds.current) {
          return;
        }

        const [xMovement, yMovement] = calcAutoPan(mousePosition.current, containerBounds.current);

        if (xMovement !== 0 || yMovement !== 0) {
          const { transform, panBy } = store.getState();

          lastPos.current.x = (lastPos.current.x ?? 0) - xMovement / transform[2];
          lastPos.current.y = (lastPos.current.y ?? 0) - yMovement / transform[2];

          if (panBy({ x: xMovement, y: yMovement })) {
            updateNodes(lastPos.current as XYPosition);
          }
        }
        autoPanId.current = requestAnimationFrame(autoPan);
      };

      const startDrag = (event: UseDragEvent) => {
        const {
          nodeInternals,
          multiSelectionActive,
          nodesDraggable,
          unselectNodesAndEdges,
          onNodeDragStart,
          onSelectionDragStart,
        } = store.getState();
        dragStarted.current = true;
        const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);

        if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
          if (!nodeInternals.get(nodeId)?.selected) {
            // we need to reset selected nodes when selectNodesOnDrag=false
            unselectNodesAndEdges();
          }
        }

        if (nodeId && isSelectable && selectNodesOnDrag) {
          handleNodeClick({
            id: nodeId,
            store,
            nodeRef: nodeRef as RefObject<HTMLDivElement>,
          });
        }

        const pointerPos = getPointerPosition(event);
        lastPos.current = pointerPos;
        dragItems.current = getDragItems(nodeInternals, nodesDraggable, pointerPos, nodeId);

        if (onStart && dragItems.current) {
          const [currentNode, nodes] = getEventHandlerParams({
            nodeId,
            dragItems: dragItems.current,
            nodeInternals,
          });
          onStart(event.sourceEvent as MouseEvent, currentNode, nodes);
        }
      };

      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            const { domNode, nodeDragThreshold } = store.getState();
            if (nodeDragThreshold === 0) {
              startDrag(event);
            }

            const pointerPos = getPointerPosition(event);
            lastPos.current = pointerPos;
            containerBounds.current = domNode?.getBoundingClientRect() || null;
            mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current!);
          })
          .on('drag', (event: UseDragEvent) => {
            const pointerPos = getPointerPosition(event);
            const { autoPanOnNodeDrag, nodeDragThreshold } = store.getState();

            if (!autoPanStarted.current && dragStarted.current && autoPanOnNodeDrag) {
              autoPanStarted.current = true;
              autoPan();
            }

            if (!dragStarted.current) {
              const x = pointerPos.xSnapped - (lastPos?.current?.x ?? 0);
              const y = pointerPos.ySnapped - (lastPos?.current?.y ?? 0);
              const distance = Math.sqrt(x * x + y * y);

              if (distance > nodeDragThreshold) {
                startDrag(event);
              }
            }

            // skip events without movement
            if (
              (lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) &&
              dragItems.current &&
              dragStarted.current
            ) {
              dragEvent.current = event.sourceEvent as MouseEvent;
              mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current!);
              updateNodes(pointerPos);
            }
          })
          .on('end', (event: UseDragEvent) => {
            if (!dragStarted.current) {
              return;
            }

            setDragging(false);
            autoPanStarted.current = false;
            dragStarted.current = false;
            cancelAnimationFrame(autoPanId.current);

            if (dragItems.current) {
              const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
              const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);

              updateNodePositions(dragItems.current, false, false);

              if (onStop) {
                const [currentNode, nodes] = getEventHandlerParams({
                  nodeId,
                  dragItems: dragItems.current,
                  nodeInternals,
                });
                onStop(event.sourceEvent as MouseEvent, currentNode, nodes);
              }
            }
          })
          .filter((event: MouseEvent) => {
            const target = event.target as HTMLDivElement;
            const isDraggable =
              !event.button &&
              (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) &&
              (!handleSelector || hasSelector(target, handleSelector, nodeRef));

            return isDraggable;
          });

        selection.call(dragHandler);

        return () => {
          selection.on('.drag', null);
        };
      }
    }
  }, [
    nodeRef,
    disabled,
    noDragClassName,
    handleSelector,
    isSelectable,
    store,
    nodeId,
    selectNodesOnDrag,
    getPointerPosition,
  ]);

  return dragging;
}

export default useDrag;

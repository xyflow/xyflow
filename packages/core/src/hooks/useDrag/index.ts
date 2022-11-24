import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject, MouseEvent } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3';

import { useStoreApi } from '../../hooks/useStore';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition } from './utils';
import { handleNodeClick } from '../../components/Nodes/utils';
import type { NodeDragItem, Node, SelectionDragHandler } from '../../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
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
  const [dragging, setDragging] = useState<boolean>(false);
  const store = useStoreApi();
  const dragItems = useRef<NodeDragItem[]>();
  const lastPos = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  // returns the pointer position projected to the RF coordinate system
  const getPointerPosition = useCallback(({ sourceEvent }: UseDragEvent) => {
    const { transform, snapGrid, snapToGrid } = store.getState();
    const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
    const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;

    const pointerPos = {
      x: (x - transform[0]) / transform[2],
      y: (y - transform[1]) / transform[2],
    };

    // we need the snapped position in order to be able to skip unnecessary drag events
    return {
      xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
      ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
      ...pointerPos,
    };
  }, []);

  useEffect(() => {
    if (nodeRef?.current) {
      const selection = select(nodeRef.current);

      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            const {
              nodeInternals,
              multiSelectionActive,
              unselectNodesAndEdges,
              onNodeDragStart,
              onSelectionDragStart,
            } = store.getState();

            const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);

            if (!selectNodesOnDrag && !multiSelectionActive && nodeId) {
              if (!nodeInternals.get(nodeId)?.selected) {
                // we need to reset selected nodes when selectNodesOnDrag=false
                unselectNodesAndEdges();
              }
            }

            if (nodeId && isSelectable && selectNodesOnDrag) {
              handleNodeClick({
                id: nodeId,
                store,
              });
            }

            const pointerPos = getPointerPosition(event);
            lastPos.current = pointerPos;
            dragItems.current = getDragItems(nodeInternals, pointerPos, nodeId);

            if (onStart && dragItems.current) {
              const [currentNode, nodes] = getEventHandlerParams({
                nodeId,
                dragItems: dragItems.current,
                nodeInternals,
              });
              onStart(event.sourceEvent as MouseEvent, currentNode, nodes);
            }
          })
          .on('drag', (event: UseDragEvent) => {
            const {
              updateNodePositions,
              nodeInternals,
              nodeExtent,
              onNodeDrag,
              onSelectionDrag,
              snapGrid,
              snapToGrid,
              nodeOrigin,
            } = store.getState();
            const pointerPos = getPointerPosition(event);
            // skip events without movement
            if (
              (lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) &&
              dragItems.current
            ) {
              lastPos.current = {
                x: pointerPos.xSnapped,
                y: pointerPos.ySnapped,
              };
              dragItems.current = dragItems.current.map((n) => {
                const nextPosition = { x: pointerPos.x - n.distance.x, y: pointerPos.y - n.distance.y };

                if (snapToGrid) {
                  nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                  nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                }

                const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, nodeOrigin);

                n.position = updatedPos.position;
                n.positionAbsolute = updatedPos.positionAbsolute;

                return n;
              });

              const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);

              updateNodePositions(dragItems.current, true, true);
              setDragging(true);

              if (onDrag) {
                const [currentNode, nodes] = getEventHandlerParams({
                  nodeId,
                  dragItems: dragItems.current,
                  nodeInternals,
                });
                onDrag(event.sourceEvent as MouseEvent, currentNode, nodes);
              }
            }
          })
          .on('end', (event: UseDragEvent) => {
            setDragging(false);
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

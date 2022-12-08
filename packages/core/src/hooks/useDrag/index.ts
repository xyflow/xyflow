import { useEffect, useRef, useState } from 'react';
import type { RefObject, MouseEvent } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../../hooks/useStore';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition } from './utils';
import { handleNodeClick } from '../../components/Nodes/utils';
import useGetPointerPosition from '../useGetPointerPosition';
import type { NodeDragItem, Node, SelectionDragHandler, UseDragEvent } from '../../types';

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

  const getPointerPosition = useGetPointerPosition();

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

              let hasChange = false;

              dragItems.current = dragItems.current.map((n) => {
                const nextPosition = { x: pointerPos.x - n.distance.x, y: pointerPos.y - n.distance.y };

                if (snapToGrid) {
                  nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                  nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
                }

                const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, nodeOrigin);

                // we want to make sure that we only fire a change event when there is a changes
                hasChange =
                  hasChange || n.position.x !== updatedPos.position.x || n.position.y !== updatedPos.position.y;

                n.position = updatedPos.position;
                n.positionAbsolute = updatedPos.positionAbsolute;

                return n;
              });

              if (!hasChange) {
                return;
              }

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

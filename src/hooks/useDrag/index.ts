import { RefObject, useEffect, useRef, MouseEvent, useState, useCallback } from 'react';
import { D3DragEvent, drag, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../../store';
import { pointToRendererPoint } from '../../utils/graph';
import { NodeDragItem, Node, SelectionDragHandler } from '../../types';
import { getDragItems, getEventHandlerParams, hasSelector, updatePosition } from './utils';
import { handleNodeClick } from '../../components/Nodes/utils';

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
    const pointerPos = pointToRendererPoint({ x, y }, transform, snapToGrid, snapGrid);

    return pointerPos;
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
            const { updateNodePositions, nodeInternals, nodeExtent, onNodeDrag, onSelectionDrag } = store.getState();
            const pointerPos = getPointerPosition(event);

            // skip events without movement
            if ((lastPos.current.x !== pointerPos.x || lastPos.current.y !== pointerPos.y) && dragItems.current) {
              lastPos.current = pointerPos;
              dragItems.current = dragItems.current.map((n) =>
                updatePosition(n, pointerPos, nodeInternals, nodeExtent)
              );

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

            event.on('end', (event) => {
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
            });
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

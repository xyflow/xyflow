import { useEffect, useRef, useState } from 'react';
import type { RefObject, MouseEvent } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../../hooks/useStore';
import { getDragItems, getEventHandlerParams, hasSelector, calcNextPosition } from './utils';
import { handleNodeClick } from '../../components/Nodes/utils';
import useGetPointerPosition from '../useGetPointerPosition';
import type { NodeDragItem, Node, SelectionDragHandler, UseDragEvent, XYPosition } from '../../types';
import { getVelocity } from '../../utils';

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
  const requestAnimationFrameId = useRef(0);
  const containerBounds = useRef<DOMRect | null>(null);
  const centerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragEvent = useRef<MouseEvent | null>(null);
  const animationFrameStarted = useRef(false);

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
        } = store.getState();

        lastPos.current = { x, y };

        let hasChange = false;

        dragItems.current = dragItems.current!.map((n) => {
          const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };

          if (snapToGrid) {
            nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
            nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
          }

          const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent, nodeOrigin);

          // we want to make sure that we only fire a change event when there is a changes
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

      const updateViewport = (): void => {
        if (!containerBounds.current) {
          return;
        }

        const xMovement = getVelocity(centerPosition.current.x, 35, containerBounds.current.width - 35) * 20;
        const yMovement = getVelocity(centerPosition.current.y, 35, containerBounds.current.height - 35) * 20;

        if (xMovement !== 0 || yMovement !== 0) {
          lastPos.current.x = (lastPos.current.x ?? 0) + xMovement * -1;
          lastPos.current.y = (lastPos.current.y ?? 0) + yMovement * -1;

          updateNodes(lastPos.current as XYPosition);

          store.getState().movePane({ x: xMovement, y: yMovement });
        }
        requestAnimationFrameId.current = requestAnimationFrame(updateViewport);
      };

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
              domNode,
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

            containerBounds.current = domNode?.getBoundingClientRect() || null;
            centerPosition.current = {
              x: event.sourceEvent.clientX - (containerBounds.current?.left ?? 0),
              y: event.sourceEvent.clientY - (containerBounds.current?.top ?? 0),
            };
          })
          .on('drag', (event: UseDragEvent) => {
            const pointerPos = getPointerPosition(event);

            if (!animationFrameStarted.current) {
              animationFrameStarted.current = true;
              updateViewport();
            }

            // skip events without movement
            if (
              (lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) &&
              dragItems.current
            ) {
              dragEvent.current = event.sourceEvent as MouseEvent;
              centerPosition.current = {
                x: event.sourceEvent.clientX - (containerBounds.current?.left ?? 0),
                y: event.sourceEvent.clientY - (containerBounds.current?.top ?? 0),
              };

              updateNodes(pointerPos);
            }
          })
          .on('end', (event: UseDragEvent) => {
            setDragging(false);
            animationFrameStarted.current = false;
            cancelAnimationFrame(requestAnimationFrameId.current);
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

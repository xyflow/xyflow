import { RefObject, useEffect, useRef, MouseEvent, useState, useMemo, useCallback } from 'react';
import { D3DragEvent, drag, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../../store';
import { pointToRendererPoint } from '../../utils/graph';
import { NodeDragItem, NodeDragHandler, XYPosition } from '../../types';
import {
  getDragItems,
  getEventHandlerParams,
  getParentNodePosition,
  selectorExistsTargetToNode,
  updatePosition,
} from './utils';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type UseDragData = { dx: number; dy: number };

type UseDragParams = {
  nodeRef: RefObject<Element>;
  onStart?: NodeDragHandler;
  onDrag?: NodeDragHandler;
  onStop?: NodeDragHandler;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  selectNodesOnDrag?: boolean;
};

function useDrag({
  onStart,
  onDrag,
  onStop,
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
  const parentPos = useRef<XYPosition>({ x: 0, y: 0 });

  // TODO: should we store the ref or the bounds in the store?
  // So that it is easier / more reliable to access?
  const countainerBounds = useMemo(() => {
    if (typeof document !== 'undefined') {
      return document.querySelector('.react-flow')?.getBoundingClientRect();
    }
  }, []);

  // returns the mouse position projected to the RF coordinate system
  const getMousePosition = useCallback(
    (event: UseDragEvent) => {
      const { transform, snapGrid, snapToGrid } = store.getState();

      const mousePos = pointToRendererPoint(
        {
          x: event.sourceEvent.clientX - (countainerBounds?.x || 0) - (window.scrollX || 0),
          y: event.sourceEvent.clientY - (countainerBounds?.y || 0) - (window.scrollY || 0),
        },
        transform,
        snapToGrid,
        snapGrid
      );

      mousePos.x -= parentPos.current.x;
      mousePos.y -= parentPos.current.y;

      return mousePos;
    },
    [countainerBounds?.x, countainerBounds?.y, store]
  );

  useEffect(() => {
    if (nodeRef?.current && countainerBounds) {
      const selection = select(nodeRef.current);

      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            const { nodeInternals, addSelectedNodes, unselectNodesAndEdges, multiSelectionActive } = store.getState();
            parentPos.current = getParentNodePosition(nodeInternals, nodeId);

            // this part is the regular drag handler for a single node
            // it selects the dragged node and deselects all other nodes if multiSelectionActive = false
            if (nodeId && isSelectable) {
              const node = nodeInternals.get(nodeId)!;

              if (selectNodesOnDrag) {
                store.setState({ nodesSelectionActive: false });

                if (!node.selected) {
                  addSelectedNodes([nodeId]);
                }
              } else if (!selectNodesOnDrag && !node.selected) {
                if (multiSelectionActive) {
                  addSelectedNodes([nodeId]);
                } else {
                  unselectNodesAndEdges();
                  store.setState({ nodesSelectionActive: false });
                }
              }
            }

            const mousePos = getMousePosition(event);
            dragItems.current = getDragItems(nodeInternals, mousePos);

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
            const { updateNodePositions, nodeInternals, nodeExtent } = store.getState();
            const mousePos = getMousePosition(event);

            // skip events without movement
            if ((lastPos.current.x !== mousePos.x || lastPos.current.y !== mousePos.y) && dragItems.current) {
              lastPos.current = mousePos;
              dragItems.current = dragItems.current.map((n) => updatePosition(n, mousePos, nodeInternals, nodeExtent));

              updateNodePositions(dragItems.current);
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
              if (onStop && dragItems.current) {
                const [currentNode, nodes] = getEventHandlerParams({
                  nodeId,
                  dragItems: dragItems.current,
                  nodeInternals,
                });
                onStop(event.sourceEvent as MouseEvent, currentNode, nodes);
              }
            });
          })
          .filter((event: any) => {
            const filter = !event.ctrlKey && !event.button && !event.target.className.includes(noDragClassName);
            return handleSelector
              ? selectorExistsTargetToNode(event.target, handleSelector, nodeRef) && filter
              : filter;
          });

        selection.call(dragHandler);

        return () => {
          selection.on('.drag', null);
        };
      }
    }
  }, [
    onStart,
    onDrag,
    onStop,
    nodeRef,
    disabled,
    noDragClassName,
    handleSelector,
    isSelectable,
    store,
    nodeId,
    selectNodesOnDrag,
    countainerBounds,
    getMousePosition,
  ]);

  return dragging;
}

export default useDrag;

import { RefObject, useEffect, useRef } from 'react';
import { D3DragEvent, drag, SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';

import { useStoreApi } from '../store';
import { pointToRendererPoint } from '../utils/graph';
import { NodeInternals, XYPosition } from '../types';

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type UseDragData = { dx: number; dy: number };

type UseDragParams = {
  onStart: (event: UseDragEvent) => void;
  onDrag: (event: UseDragEvent, data: UseDragData) => void;
  onStop: (event: UseDragEvent) => void;
  nodeRef: RefObject<Element>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
};

function getOffset(event: UseDragEvent, nodeRef: RefObject<Element>): XYPosition {
  const bounds = nodeRef.current?.getBoundingClientRect() || { x: 0, y: 0 };
  const parent = (nodeRef.current as HTMLDivElement)?.offsetParent;
  const parentBounds = parent?.getBoundingClientRect() || { x: 0, y: 0 };

  return {
    x: event.x - (bounds.x - parentBounds.x - (parent?.scrollLeft || 0)),
    y: event.y - (bounds.y - parentBounds.y - (parent?.scrollTop || 0)),
  };
}

function getParentNodePosition(nodeInternals: NodeInternals, nodeId?: string): XYPosition {
  const parentNodeId = nodeId ? nodeInternals.get(nodeId)?.parentNode : null;
  const parentNode = parentNodeId ? nodeInternals.get(parentNodeId) : null;

  return {
    x: parentNode?.positionAbsolute?.x || 0,
    y: parentNode?.positionAbsolute?.y || 0,
  };
}

function selectorExistsTargetToNode(target: Element, selector: string, nodeRef: RefObject<Element>): boolean {
  let current = target;
  do {
    if (current?.matches(selector)) return true;
    if (current === nodeRef.current) return false;
    current = current.parentElement as Element;
  } while (current);

  return false;
}

function useDrag({
  onStart,
  onDrag,
  onStop,
  nodeRef,
  disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
}: UseDragParams) {
  const store = useStoreApi();
  const startPos = useRef<XYPosition>({ x: 0, y: 0 });
  const lastPos = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const parentPos = useRef<XYPosition>({ x: 0, y: 0 });

  useEffect(() => {
    if (nodeRef?.current) {
      const selection = select(nodeRef.current);

      let isDragAllowedBySelector = true;
      if (disabled) {
        selection.on('.drag', null);
      } else {
        const dragHandler = drag()
          .on('start', (event: UseDragEvent) => {
            if (handleSelector) {
              isDragAllowedBySelector = selectorExistsTargetToNode(event.sourceEvent.target, handleSelector, nodeRef);
            }
            if (isDragAllowedBySelector) {
              const { transform, nodeInternals } = store.getState();
              const offset = getOffset(event, nodeRef);
              parentPos.current = getParentNodePosition(nodeInternals, nodeId);

              startPos.current = {
                x: offset.x - transform[0],
                y: offset.y - transform[1],
              };

              onStart(event);
            }
          })
          .on('drag', (event: UseDragEvent) => {
            if (isDragAllowedBySelector) {
              const { transform, snapGrid, snapToGrid } = store.getState();
              const pos = pointToRendererPoint(
                {
                  x: event.x - startPos.current.x,
                  y: event.y - startPos.current.y,
                },
                transform,
                snapToGrid,
                snapGrid
              );

              pos.x -= parentPos.current.x;
              pos.y -= parentPos.current.y;

              // skip events without movement
              if (lastPos.current.x !== pos.x || lastPos.current.y !== pos.y) {
                lastPos.current = pos;

                onDrag(event, {
                  dx: pos.x,
                  dy: pos.y,
                });
              }

              event.on('end', (event) => {
                if (isDragAllowedBySelector) {
                  onStop(event);
                }
              });
            }
          })
          .filter((event: any) => !event.ctrlKey && !event.button && !event.target.className.includes(noDragClassName));

        selection.call(dragHandler);

        return () => {
          selection.on('.drag', null);
        };
      }
    }
  }, [onStart, onDrag, onStop, nodeRef, disabled, noDragClassName, handleSelector, nodeId]);

  return null;
}

export default useDrag;

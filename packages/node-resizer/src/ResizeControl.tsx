import { useRef, useEffect } from 'react';
import cc from 'classcat';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import {
  useStoreApi,
  useGetPointerPosition,
  NodeChange,
  NodePositionChange,
  NodeDimensionChange,
} from '@reactflow/core';
import type { Dimensions, Node, XYPosition } from '@reactflow/core';

import type { ResizeDragEvent, ResizeControlProps, ResizeControlLineProps } from './types';

function ResizeControl({
  nodeId,
  position = 'bottom-right',
  variant = 'handle',
  className,
  style = {},
  children,
}: ResizeControlProps) {
  const store = useStoreApi();
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const initialDimensionsRef = useRef<Dimensions & XYPosition & { nodeX: number; nodeY: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    nodeX: 0,
    nodeY: 0,
  });
  const nodeElementRef = useRef<HTMLDivElement | null>(null);
  const getPointerPosition = useGetPointerPosition();

  useEffect(() => {
    if (!resizeHandleRef.current) {
      return;
    }

    const selection = select(resizeHandleRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = store.getState().nodeInternals.get(nodeId);
        const pointerPos = getPointerPosition(event);

        initialDimensionsRef.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          nodeX: node?.position.x ?? 0,
          nodeY: node?.position.y ?? 0,
          x: pointerPos.xSnapped,
          y: pointerPos.ySnapped,
        };
        nodeElementRef.current = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) as HTMLDivElement;
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { updateNodePositions, nodeInternals, onNodesChange } = store.getState();
        const pointerPos = getPointerPosition(event);
        const nodeEl = nodeElementRef.current;
        const node = nodeInternals.get(nodeId);
        const enableX = position.includes('right') || position.includes('left');
        const enableY = position.includes('bottom') || position.includes('top');
        const invertX = position.includes('left');
        const invertY = position.includes('top');

        if (nodeEl && node) {
          const changes: NodeChange[] = [];
          const distX = enableX ? pointerPos.xSnapped - initialDimensionsRef.current.x : 0;
          const distY = enableY ? pointerPos.ySnapped - initialDimensionsRef.current.y : 0;
          const width = initialDimensionsRef.current.width + (invertX ? -distX : distX);
          const height = initialDimensionsRef.current.height + (invertY ? -distY : distY);

          if (invertX || invertY) {
            const x = invertX ? initialDimensionsRef.current.nodeX + distX : initialDimensionsRef.current.nodeX;
            const y = invertY ? initialDimensionsRef.current.nodeY + distY : initialDimensionsRef.current.nodeY;

            if (x !== node.position.x || y !== node.position.y) {
              const positionChanges: NodePositionChange[] | null = updateNodePositions(
                [
                  {
                    id: nodeId,
                    position: { x, y },
                  } as Node,
                ],
                true,
                false,
                false
              );

              if (positionChanges?.length) {
                changes.push(positionChanges[0]);
              }
            }
          }

          if (width !== node.width || height !== node.height) {
            const dimensionChange: NodeDimensionChange = {
              id: nodeId,
              type: 'dimensions',
              updateStyle: true,
              dimensions: {
                width: width !== node.width ? width : node.width,
                height: height !== node.height ? height : node.height,
              },
            };
            changes.push(dimensionChange);
          }

          if (changes.length) {
            onNodesChange?.(changes);
          }
        }
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  }, [nodeId, position, getPointerPosition]);

  const positionClassNames = position.split('-');

  return (
    <div
      className={cc([className, ...positionClassNames, variant, 'react-flow__resize-control', 'nodrag'])}
      ref={resizeHandleRef}
      style={style}
    >
      {children}
    </div>
  );
}

export function ResizeControlLine(props: ResizeControlLineProps) {
  return <ResizeControl {...props} variant="line" />;
}

export default ResizeControl;

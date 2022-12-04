import { useRef, useEffect, memo } from 'react';
import cc from 'classcat';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import {
  useStoreApi,
  useGetPointerPosition,
  NodeChange,
  NodeDimensionChange,
  applyNodeChanges,
  createNodeInternals,
} from '@reactflow/core';
import type { Dimensions, Node, XYPosition } from '@reactflow/core';

import { ResizeDragEvent, ResizeControlProps, ResizeControlLineProps, ResizeControlVariant } from './types';

function ResizeControl({
  nodeId,
  position = 'bottom-right',
  variant = ResizeControlVariant.Handle,
  className,
  style = {},
  children,
}: ResizeControlProps) {
  const store = useStoreApi();
  const resizeControlRef = useRef<HTMLDivElement>(null);
  const startValues = useRef<Dimensions & XYPosition & { nodeX: number; nodeY: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    nodeX: 0,
    nodeY: 0,
  });
  const getPointerPosition = useGetPointerPosition();

  useEffect(() => {
    if (!resizeControlRef.current) {
      return;
    }

    const selection = select(resizeControlRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = store.getState().nodeInternals.get(nodeId);
        const { xSnapped, ySnapped } = getPointerPosition(event);

        startValues.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          nodeX: node?.position.x ?? 0,
          nodeY: node?.position.y ?? 0,
          x: xSnapped,
          y: ySnapped,
        };
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { updateNodePositions, nodeInternals, onNodesChange, hasDefaultNodes, nodeOrigin } = store.getState();
        const { xSnapped, ySnapped } = getPointerPosition(event);
        const node = nodeInternals.get(nodeId);
        const enableX = position.includes('right') || position.includes('left');
        const enableY = position.includes('bottom') || position.includes('top');
        const invertX = position.includes('left');
        const invertY = position.includes('top');

        if (node) {
          const changes: NodeChange[] = [];
          const {
            x: startX,
            y: startY,
            width: startWidth,
            height: startHeight,
            nodeX: startNodeX,
            nodeY: startNodeY,
          } = startValues.current;
          const distX = enableX ? xSnapped - startX : 0;
          const distY = enableY ? ySnapped - startY : 0;
          const width = startWidth + (invertX ? -distX : distX);
          const height = startHeight + (invertY ? -distY : distY);

          if (invertX || invertY) {
            const x = invertX ? startNodeX + distX : startNodeX;
            const y = invertY ? startNodeY + distY : startNodeY;

            if (x !== node.position.x || y !== node.position.y) {
              const positionChanges = updateNodePositions(
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
            if (hasDefaultNodes) {
              const nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
              const nextNodeInternals = createNodeInternals(nodes, nodeInternals, nodeOrigin);
              store.setState({ nodeInternals: nextNodeInternals });
            }

            onNodesChange?.(changes);
          }
        }
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  }, [nodeId, position, getPointerPosition]);

  const positionClassNames = position?.split('-');

  return (
    <div
      className={cc(['react-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
      ref={resizeControlRef}
      style={style}
    >
      {children}
    </div>
  );
}

export function ResizeControlLine(props: ResizeControlLineProps) {
  return <ResizeControl {...props} variant={ResizeControlVariant.Line} />;
}

export default memo(ResizeControl);

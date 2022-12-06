import { useRef, useEffect, memo } from 'react';
import cc from 'classcat';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import {
  useStoreApi,
  useGetPointerPosition,
  NodeChange,
  NodeDimensionChange,
  useNodeId,
  NodePositionChange,
} from '@reactflow/core';
import type { Dimensions, XYPosition } from '@reactflow/core';

import { ResizeDragEvent, ResizeControlProps, ResizeControlLineProps, ResizeControlVariant } from './types';

function ResizeControl({
  nodeId,
  position,
  variant = ResizeControlVariant.Handle,
  className,
  style = {},
  children,
  color,
  minWidth = 1,
  minHeight = 1,
}: ResizeControlProps) {
  const contextNodeId = useNodeId();
  const id = typeof nodeId === 'string' ? nodeId : contextNodeId;
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
  const prevValues = useRef<Dimensions & XYPosition>({ width: 0, height: 0, x: 0, y: 0 });
  const getPointerPosition = useGetPointerPosition();
  const defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  const controlPosition = position ?? defaultPosition;

  useEffect(() => {
    if (!resizeControlRef.current || !id) {
      return;
    }

    const selection = select(resizeControlRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = store.getState().nodeInternals.get(id);
        const { xSnapped, ySnapped } = getPointerPosition(event);

        startValues.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          nodeX: node?.position.x ?? 0,
          nodeY: node?.position.y ?? 0,
          x: xSnapped,
          y: ySnapped,
        };

        prevValues.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          x: node?.position.x ?? 0,
          y: node?.position.y ?? 0,
        };
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { nodeInternals, triggerNodeChanges } = store.getState();
        const { xSnapped, ySnapped } = getPointerPosition(event);
        const node = nodeInternals.get(id);
        const enableX = controlPosition.includes('right') || controlPosition.includes('left');
        const enableY = controlPosition.includes('bottom') || controlPosition.includes('top');
        const invertX = controlPosition.includes('left');
        const invertY = controlPosition.includes('top');

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

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues.current;

          const distX = Math.floor(enableX ? xSnapped - startX : 0);
          const distY = Math.floor(enableY ? ySnapped - startY : 0);
          const width = Math.max(startWidth + (invertX ? -distX : distX), minWidth);
          const height = Math.max(startHeight + (invertY ? -distY : distY), minHeight);

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          if (invertX || invertY) {
            const x = invertX ? startNodeX - (width - startWidth) : startNodeX;
            const y = invertY ? startNodeY - (height - startHeight) : startNodeY;

            // only transform the node if the width or height changes
            const isXPosChange = x !== prevX && isWidthChange;
            const isYPosChange = y !== prevY && isHeightChange;

            if (isXPosChange || isYPosChange) {
              const positionChange: NodePositionChange = {
                id: node.id,
                type: 'position',
                position: {
                  x: isXPosChange ? x : prevX,
                  y: isYPosChange ? y : prevY,
                },
              };

              changes.push(positionChange);
              prevValues.current.x = positionChange.position!.x;
              prevValues.current.y = positionChange.position!.y;
            }
          }

          if (isWidthChange || isHeightChange) {
            const dimensionChange: NodeDimensionChange = {
              id: id,
              type: 'dimensions',
              updateStyle: true,
              resizing: true,
              dimensions: {
                width: width,
                height: height,
              },
            };
            changes.push(dimensionChange);
            prevValues.current.width = width;
            prevValues.current.height = height;
          }

          triggerNodeChanges(changes);
        }
      })
      .on('end', () => {
        const { triggerNodeChanges } = store.getState();

        const dimensionChange: NodeDimensionChange = {
          id: id,
          type: 'dimensions',
          resizing: true,
        };

        triggerNodeChanges([dimensionChange]);
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  }, [id, controlPosition, getPointerPosition]);

  const positionClassNames = controlPosition.split('-');
  const colorStyleProp = variant === ResizeControlVariant.Line ? 'borderColor' : 'backgroundColor';
  const controlStyle = color ? { ...style, [colorStyleProp]: color } : style;

  return (
    <div
      className={cc(['react-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
      ref={resizeControlRef}
      style={controlStyle}
    >
      {children}
    </div>
  );
}

export function ResizeControlLine(props: ResizeControlLineProps) {
  return <ResizeControl {...props} variant={ResizeControlVariant.Line} />;
}

export default memo(ResizeControl);

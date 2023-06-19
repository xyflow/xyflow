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
  clamp,
} from '@reactflow/core';

import { ResizeDragEvent, ResizeControlProps, ResizeControlLineProps, ResizeControlVariant } from './types';
import { getDirection } from './utils';

const initPrevValues = { width: 0, height: 0, x: 0, y: 0 };

const initStartValues = {
  ...initPrevValues,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1,
};

function ResizeControl({
  nodeId,
  position,
  variant = ResizeControlVariant.Handle,
  className,
  style = {},
  children,
  color,
  minWidth = 10,
  minHeight = 10,
  maxWidth = Number.MAX_VALUE,
  maxHeight = Number.MAX_VALUE,
  keepAspectRatio = false,
  shouldResize,
  onResizeStart,
  onResize,
  onResizeEnd,
}: ResizeControlProps) {
  const contextNodeId = useNodeId();
  const id = typeof nodeId === 'string' ? nodeId : contextNodeId;
  const store = useStoreApi();
  const resizeControlRef = useRef<HTMLDivElement>(null);
  const startValues = useRef<typeof initStartValues>(initStartValues);
  const prevValues = useRef<typeof initPrevValues>(initPrevValues);
  const getPointerPosition = useGetPointerPosition();
  const defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  const controlPosition = position ?? defaultPosition;

  useEffect(() => {
    if (!resizeControlRef.current || !id) {
      return;
    }

    const selection = select(resizeControlRef.current);

    const enableX = controlPosition.includes('right') || controlPosition.includes('left');
    const enableY = controlPosition.includes('bottom') || controlPosition.includes('top');
    const invertX = controlPosition.includes('left');
    const invertY = controlPosition.includes('top');

    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = store.getState().nodeInternals.get(id);
        const { xSnapped, ySnapped } = getPointerPosition(event);

        prevValues.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          x: node?.position.x ?? 0,
          y: node?.position.y ?? 0,
        };

        startValues.current = {
          ...prevValues.current,
          pointerX: xSnapped,
          pointerY: ySnapped,
          aspectRatio: prevValues.current.width / prevValues.current.height,
        };

        onResizeStart?.(event, { ...prevValues.current });
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { nodeInternals, triggerNodeChanges } = store.getState();
        const { xSnapped, ySnapped } = getPointerPosition(event);
        const node = nodeInternals.get(id);

        if (node) {
          const changes: NodeChange[] = [];
          const {
            pointerX: startX,
            pointerY: startY,
            width: startWidth,
            height: startHeight,
            x: startNodeX,
            y: startNodeY,
            aspectRatio,
          } = startValues.current;

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues.current;

          const distX = Math.floor(enableX ? xSnapped - startX : 0);
          const distY = Math.floor(enableY ? ySnapped - startY : 0);

          let width = clamp(startWidth + (invertX ? -distX : distX), minWidth, maxWidth);
          let height = clamp(startHeight + (invertY ? -distY : distY), minHeight, maxHeight);

          if (keepAspectRatio) {
            const nextAspectRatio = width / height;
            const isDiagonal = enableX && enableY;
            const isHorizontal = enableX && !enableY;
            const isVertical = enableY && !enableX;

            width = (nextAspectRatio <= aspectRatio && isDiagonal) || isVertical ? height * aspectRatio : width;
            height = (nextAspectRatio > aspectRatio && isDiagonal) || isHorizontal ? width / aspectRatio : height;

            if (width >= maxWidth) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else if (width <= minWidth) {
              width = minWidth;
              height = minWidth / aspectRatio;
            }

            if (height >= maxHeight) {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            } else if (height <= minHeight) {
              height = minHeight;
              width = minHeight * aspectRatio;
            }
          }

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

          if (changes.length === 0) {
            return;
          }

          const direction = getDirection({
            width: prevValues.current.width,
            prevWidth,
            height: prevValues.current.height,
            prevHeight,
            invertX,
            invertY,
          });

          const nextValues = { ...prevValues.current, direction };

          const callResize = shouldResize?.(event, nextValues);

          if (callResize === false) {
            return;
          }

          onResize?.(event, nextValues);
          triggerNodeChanges(changes);
        }
      })
      .on('end', (event: ResizeDragEvent) => {
        const dimensionChange: NodeDimensionChange = {
          id: id,
          type: 'dimensions',
          resizing: false,
        };

        onResizeEnd?.(event, { ...prevValues.current });
        store.getState().triggerNodeChanges([dimensionChange]);
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  }, [
    id,
    controlPosition,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    keepAspectRatio,
    getPointerPosition,
    onResizeStart,
    onResize,
    onResizeEnd,
  ]);

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

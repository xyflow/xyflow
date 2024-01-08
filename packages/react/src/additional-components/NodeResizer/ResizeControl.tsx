import { useRef, useEffect, memo } from 'react';
import cc from 'classcat';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import {
  getPointerPosition,
  getControlDirection,
  getDimensionsAfterResize,
  getPositionAfterResize,
} from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { NodeChange, NodeDimensionChange, NodePositionChange } from '../../types';
import { type ResizeDragEvent, type ResizeControlProps, type ResizeControlLineProps } from './types';
import { getResizeDirection, ResizeControlVariant } from '@xyflow/system';

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
  const defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  const controlPosition = position ?? defaultPosition;

  useEffect(() => {
    if (!resizeControlRef.current || !id) {
      return;
    }

    const selection = select(resizeControlRef.current);

    const controlDirection = getControlDirection(controlPosition);

    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const { nodeLookup, transform, snapGrid, snapToGrid } = store.getState();
        const node = nodeLookup.get(id);
        const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });

        prevValues.current = {
          width: node?.computed?.width ?? 0,
          height: node?.computed?.height ?? 0,
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
        const { nodeLookup, transform, snapGrid, snapToGrid, triggerNodeChanges } = store.getState();
        const pointerPosition = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
        const node = nodeLookup.get(id);

        if (node) {
          const changes: NodeChange[] = [];

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues.current;

          const { width, height } = getDimensionsAfterResize(
            startValues.current,
            controlDirection,
            pointerPosition,
            { minWidth, minHeight, maxWidth, maxHeight },
            keepAspectRatio
          );

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          if (controlDirection.affectsX || controlDirection.affectsY) {
            const { x, y } = getPositionAfterResize(startValues.current, controlDirection, width, height);

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

          const direction = getResizeDirection({
            width: prevValues.current.width,
            prevWidth,
            height: prevValues.current.height,
            prevHeight,
            affectsX: controlDirection.affectsX,
            affectsY: controlDirection.affectsY,
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

import { useRef, useEffect, memo } from 'react';
import cc from 'classcat';
import {
  XYResizer,
  ResizeControlVariant,
  type XYResizerInstance,
  type XYResizerChange,
  XYResizerChildChange,
} from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { NodeChange, NodeDimensionChange, NodePositionChange } from '../../types';
import type { ResizeControlProps, ResizeControlLineProps } from './types';

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
  const defaultPosition = variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  const controlPosition = position ?? defaultPosition;

  const resizer = useRef<XYResizerInstance | null>(null);

  useEffect(() => {
    if (!resizeControlRef.current || !id) {
      return;
    }

    if (!resizer.current) {
      resizer.current = XYResizer({
        domNode: resizeControlRef.current,
        nodeId: id,
        getStoreItems: () => {
          const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin } = store.getState();
          return {
            nodeLookup,
            transform,
            snapGrid,
            snapToGrid,
            nodeOrigin,
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const { triggerNodeChanges } = store.getState();

          const changes: NodeChange[] = [];

          if (change.isXPosChange || change.isYPosChange) {
            const positionChange: NodePositionChange = {
              id,
              type: 'position',
              position: {
                x: change.x,
                y: change.y,
              },
            };

            changes.push(positionChange);
          }

          if (change.isWidthChange || change.isHeightChange) {
            const dimensionChange: NodeDimensionChange = {
              id,
              type: 'dimensions',
              resizing: true,
              dimensions: {
                width: change.width,
                height: change.height,
              },
            };

            changes.push(dimensionChange);
          }

          for (const childChange of childChanges) {
            const positionChange: NodePositionChange = {
              ...childChange,
              type: 'position',
            };

            changes.push(positionChange);
          }

          triggerNodeChanges(changes);
        },
        onEnd: () => {
          const dimensionChange: NodeDimensionChange = {
            id: id,
            type: 'dimensions',
            resizing: false,
          };
          store.getState().triggerNodeChanges([dimensionChange]);
        },
      });
    }

    resizer.current.update({
      controlPosition,
      boundaries: {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
      },
      keepAspectRatio,
      onResizeStart,
      onResize,
      onResizeEnd,
      shouldResize,
    });

    return () => {
      resizer.current?.destroy();
    };
  }, [
    controlPosition,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    keepAspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
    shouldResize,
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

export const NodeResizeControl = memo(ResizeControl);

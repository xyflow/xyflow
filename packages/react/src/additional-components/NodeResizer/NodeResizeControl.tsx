import { useRef, useEffect, memo, useCallback } from 'react';
import cc from 'classcat';
import {
  XYResizer,
  ResizeControlVariant,
  type XYResizerInstance,
  type XYResizerChange,
  type XYResizerChildChange,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  XYPosition,
  ControlPosition,
} from '@xyflow/system';

import { useReactFlowStoreApi, useReactFlowStore, useShallow } from '../../hooks/useReactFlowStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { ResizeControlProps, ResizeControlLineProps } from './types';
import { ReactFlowState } from '../../types';

const scaleSelector = (calculateScale: boolean) => (store: ReactFlowState) =>
  calculateScale ? `${Math.max(1 / store.transform[2], 1)}` : undefined;

const defaultPositions: Record<ResizeControlVariant, ControlPosition> = {
  [ResizeControlVariant.Line]: 'right',
  [ResizeControlVariant.Handle]: 'bottom-right',
};

function ResizeControl({
  nodeId,
  position,
  variant = ResizeControlVariant.Handle,
  className,
  style = undefined,
  children,
  color,
  minWidth = 10,
  minHeight = 10,
  maxWidth = Number.MAX_VALUE,
  maxHeight = Number.MAX_VALUE,
  keepAspectRatio = false,
  resizeDirection,
  autoScale = true,
  shouldResize,
  onResizeStart,
  onResize,
  onResizeEnd,
}: ResizeControlProps) {
  const contextNodeId = useNodeId();
  const id = typeof nodeId === 'string' ? nodeId : contextNodeId;
  const store = useReactFlowStoreApi();
  const resizeControlRef = useRef<HTMLDivElement>(null);
  const isHandleControl = variant === ResizeControlVariant.Handle;

  const selector = useCallback(
    (s: ReactFlowState) => {
      return scaleSelector(isHandleControl && autoScale)(s);
    },
    [isHandleControl, autoScale]
  );
  const scale = useReactFlowStore(useShallow(selector));

  const resizer = useRef<XYResizerInstance | null>(null);
  const controlPosition = position ?? defaultPositions[variant];

  useEffect(() => {
    if (!resizeControlRef.current || !id) {
      return;
    }

    if (!resizer.current) {
      resizer.current = XYResizer({
        domNode: resizeControlRef.current,
        nodeId: id,
        getStoreItems: () => {
          const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin, domNode } = store.getState();
          return {
            nodeLookup,
            transform,
            snapGrid,
            snapToGrid,
            nodeOrigin,
            paneDomNode: domNode,
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const { triggerNodeChanges } = store.getState();
          const changes: NodeChange[] = [];
          const nextPosition = { x: change.x, y: change.y };

          if (nextPosition.x !== undefined && nextPosition.y !== undefined) {
            const positionChange: NodePositionChange = {
              id,
              type: 'position',
              position: { ...(nextPosition as XYPosition) },
            };
            changes.push(positionChange);
          }

          if (change.width !== undefined && change.height !== undefined) {
            const setAttributes = !resizeDirection ? true : resizeDirection === 'horizontal' ? 'width' : 'height';
            const dimensionChange: NodeDimensionChange = {
              id,
              type: 'dimensions',
              resizing: true,
              setAttributes,
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
        onEnd: ({ width, height }) => {
          const dimensionChange: NodeDimensionChange = {
            id: id,
            type: 'dimensions',
            resizing: false,
            dimensions: {
              width,
              height,
            },
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
      resizeDirection,
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
    id,
    resizeDirection,
    store,
  ]);

  const positionClassNames = controlPosition.split('-');

  return (
    <div
      className={cc(['react-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
      ref={resizeControlRef}
      style={{
        ...style,
        scale,
        ...(color && { [isHandleControl ? 'backgroundColor' : 'borderColor']: color }),
      }}
    >
      {children}
    </div>
  );
}

export function ResizeControlLine(props: ResizeControlLineProps) {
  return <ResizeControl {...props} variant={ResizeControlVariant.Line} />;
}

/**
 * To create your own resizing UI, you can use the `NodeResizeControl` component where you can pass children (such as icons).
 * @public
 *
 */
export const NodeResizeControl = memo(ResizeControl);

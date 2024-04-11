import { useRef, useEffect, memo } from 'react';
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
  handleParentExpand,
} from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { ResizeControlProps, ResizeControlLineProps } from './types';
import { InternalNode } from '../../types';

type InternalNodeWithParentExpand = InternalNode & { expandParent: true; parentId: string };

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
          const { triggerNodeChanges, nodeLookup } = store.getState();

          const changes: NodeChange[] = [];
          const newPosition = { x: change.x, y: change.y };

          const node = nodeLookup.get(id);
          if (node && node.expandParent && node.parentId) {
            const nodeWithChange = {
              ...node,
              position: {
                x: change.x,
                y: change.y,
              },
              width: change.width,
              height: change.height,
              measured: {
                width: change.width ?? node.measured?.width,
                height: change.height ?? node.measured?.height,
              },
            } as InternalNodeWithParentExpand;

            const parentExpandChanges = handleParentExpand([nodeWithChange], nodeLookup);
            if (parentExpandChanges.length > 0) {
              newPosition.x = change.x && change.x < 0 ? 0 : change.x;
              newPosition.y = change.y && change.y < 0 ? 0 : change.y;
            } else {
              console.log('there was no parent expand');
            }
            changes.push(...parentExpandChanges);
          }

          if (change.x !== undefined && change.y !== undefined) {
            console.log(newPosition);
            const positionChange: NodePositionChange = {
              id,
              type: 'position',
              position: { ...newPosition } as { x: number; y: number },
            };
            changes.push(positionChange);
          }

          if (change.width !== undefined && change.height !== undefined) {
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

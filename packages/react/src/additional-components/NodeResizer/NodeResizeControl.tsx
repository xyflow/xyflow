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
  handleExpandParent,
  evaluateAbsolutePosition,
  ParentExpandChild,
  XYPosition,
} from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
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
  rotation,
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
          const { triggerNodeChanges, nodeLookup, parentLookup, nodeOrigin } = store.getState();
          const changes: NodeChange[] = [];
          const nextPosition = { x: change.x, y: change.y };
          const node = nodeLookup.get(id);

          if (node && node.expandParent && node.parentId) {
            const origin = node.origin ?? nodeOrigin;
            const width = change.width ?? node.measured.width!;
            const height = change.height ?? node.measured.height!;

            const child: ParentExpandChild = {
              id: node.id,
              parentId: node.parentId,
              rect: {
                width,
                height,
                ...evaluateAbsolutePosition(
                  {
                    x: change.x ?? node.position.x,
                    y: change.y ?? node.position.y,
                  },
                  { width, height },
                  node.parentId,
                  nodeLookup,
                  origin
                ),
              },
            };

            const parentExpandChanges = handleExpandParent([child], nodeLookup, parentLookup, nodeOrigin);
            changes.push(...parentExpandChanges);

            // when the parent was expanded by the child node, its position will be clamped at
            // 0,0 when node origin is 0,0 and to width, height if it's 1,1
            nextPosition.x = change.x ? Math.max(origin[0] * width, change.x) : undefined;
            nextPosition.y = change.y ? Math.max(origin[1] * height, change.y) : undefined;
          }

          if (nextPosition.x !== undefined && nextPosition.y !== undefined) {
            const positionChange: NodePositionChange = {
              id,
              type: 'position',
              position: { ...(nextPosition as XYPosition) },
            };
            changes.push(positionChange);
          }

          if (change.width !== undefined && change.height !== undefined) {
            const dimensionChange: NodeDimensionChange = {
              id,
              type: 'dimensions',
              resizing: true,
              setAttributes: true,
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
      rotation,
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

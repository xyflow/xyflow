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
  evaluateNodePosition,
} from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { ResizeControlProps, ResizeControlLineProps } from './types';
import { InternalNode, Node } from '../../types';

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
          const { triggerNodeChanges, nodeLookup, parentLookup } = store.getState();

          const changes: NodeChange[] = [];
          const newPosition = { x: change.x, y: change.y };

          const node = nodeLookup.get(id);
          if (node && node.expandParent && node.parentId) {
            // We create a new node that will be used to handleExpandParent ...
            const nodeWithChange = {
              ...(node as InternalNodeWithParentExpand),
              position: {
                x: change.x ?? node.position.x,
                y: change.y ?? node.position.y,
              },
              measured: {
                width: change.width,
                height: change.height,
              },
              width: change.width,
              height: change.height,
            };

            // ...determine its new absolute position...
            nodeWithChange.internals = {
              ...nodeWithChange.internals,
              positionAbsolute: evaluateNodePosition(nodeWithChange, nodeLookup),
            };

            // ... and use it to expand the parent
            const parentExpandChanges = handleExpandParent([nodeWithChange], nodeLookup, parentLookup);
            changes.push(...parentExpandChanges);

            // when the parent was expanded by the child node, its position will be clamped at 0,0
            newPosition.x = change.x ? Math.max(0, change.x) : undefined;
            newPosition.y = change.y ? Math.max(0, change.y) : undefined;
          }

          if (change.x !== undefined && change.y !== undefined) {
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

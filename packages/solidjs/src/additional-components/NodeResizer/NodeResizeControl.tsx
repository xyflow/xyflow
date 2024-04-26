// import { useRef, useEffect, memo } from 'react';
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
import { createEffect, mergeProps } from 'solid-js';
import { useRef } from '../../utils/hooks';

import { JSX } from 'solid-js';


function ResizeControl(_p: ResizeControlProps) {
//   nodeId,
//   position,
//   variant = ResizeControlVariant.Handle,
//   className,
//   style = {},
//   children,
//   color,
//   minWidth = 10,
//   minHeight = 10,
//   maxWidth = Number.MAX_VALUE,
//   maxHeight = Number.MAX_VALUE,
//   keepAspectRatio = false,
//   shouldResize,
//   onResizeStart,
//   onResize,
//   onResizeEnd,
// }: ResizeControlProps) {

  const p = mergeProps({ variant: ResizeControlVariant.Handle, minWidth: 10, minHeight: 10, maxWidth: Number.MAX_VALUE, maxHeight: Number.MAX_VALUE, keepAspectRatio: false }, _p);

  const getContextNodeId = useNodeId();
  const getId = () => { if (typeof p.nodeId === 'string') { return p.nodeId } else { return getContextNodeId() } };
  const store = useStoreApi();
  const resizeControlRef = useRef<HTMLDivElement | null>(null);
  const defaultPosition = () => p.variant === ResizeControlVariant.Line ? 'right' : 'bottom-right';
  const controlPosition = () => p.position ?? defaultPosition();

  const resizer = useRef<XYResizerInstance | null>(null);

  createEffect(() => {
    const id = getId();

    if (!resizeControlRef.current || !id) {
      return;
    }

    if (!resizer.current) {
      resizer.current = XYResizer({
        domNode: resizeControlRef.current,
        nodeId: id,
        getStoreItems: () => {
          const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin } = store;
          return {
            nodeLookup: nodeLookup,
            transform: transform.get(),
            snapGrid: snapGrid.get(),
            snapToGrid: snapToGrid.get(),
            nodeOrigin: nodeOrigin.get(),
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const { triggerNodeChanges, nodeLookup, parentLookup, nodeOrigin } = store;

          const changes: NodeChange[] = [];
          const nextPosition = { x: change.x, y: change.y };

          const node = nodeLookup.get(id);
          if (node && node.expandParent && node.parentId) {
            const child: ParentExpandChild = {
              id: node.id,
              parentId: node.parentId,
              rect: {
                width: change.width ?? node.measured.width!,
                height: change.height ?? node.measured.height!,
                ...evaluateAbsolutePosition(
                  {
                    x: change.x ?? node.position.x,
                    y: change.y ?? node.position.y,
                  },
                  node.parentId,
                  nodeLookup,
                  node.origin ?? nodeOrigin.get()
                ),
              },
            };

            const parentExpandChanges = handleExpandParent([child], nodeLookup, parentLookup, nodeOrigin.get());
            changes.push(...parentExpandChanges);

            // when the parent was expanded by the child node, its position will be clamped at 0,0
            nextPosition.x = change.x ? Math.max(0, change.x) : undefined;
            nextPosition.y = change.y ? Math.max(0, change.y) : undefined;
          }

          if (nextPosition.x !== undefined && nextPosition.y !== undefined) {
            const positionChange: NodePositionChange = {
              id: id,
              type: 'position',
              position: { ...(nextPosition as XYPosition) },
            };
            changes.push(positionChange);
          }

          if (change.width !== undefined && change.height !== undefined) {
            const dimensionChange: NodeDimensionChange = {
              id: id,
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
            id,
            type: 'dimensions',
            resizing: false,
          };
          store.triggerNodeChanges([dimensionChange]);
        },
      });
    }

    resizer.current.update({
      controlPosition: controlPosition(),
      boundaries: {
        minWidth: p.minWidth,
        minHeight: p.minHeight,
        maxWidth: p.maxWidth,
        maxHeight: p.maxHeight,
      },
      keepAspectRatio: p.keepAspectRatio,
      onResizeStart: p.onResizeStart,
      onResize: p.onResize,
      onResizeEnd: p.onResizeEnd,
      shouldResize: p.shouldResize,
    });

    return () => {
      resizer.current?.destroy();
    };
  });

  const positionClassNames = () => controlPosition().split('-');
  const colorStyleProp = () => p.variant === ResizeControlVariant.Line ? 'borderColor' : 'backgroundColor';
  const controlStyle = (): JSX.CSSProperties | undefined=> p.color ? { ...p.style, [colorStyleProp()]: p.color } as JSX.CSSProperties : p.style;

  return (
    <div
      class={cc(['react-flow__resize-control', 'nodrag', ...positionClassNames(), p.variant, p.className])}
      ref={(el) => resizeControlRef.current = el}
      style={controlStyle()}
    >
      {p.children}
    </div>
  );
}

export function ResizeControlLine(props: ResizeControlLineProps) {
  return <ResizeControl {...props} variant={ResizeControlVariant.Line} />;
}

export const NodeResizeControl = ResizeControl

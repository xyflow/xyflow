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
import { createEffect, mergeProps, onCleanup } from 'solid-js';
import { useRef } from '../../utils/hooks';

import { JSX } from 'solid-js';

function ResizeControl(_p: ResizeControlProps) {
  const p = mergeProps(
    {
      variant: ResizeControlVariant.Handle,
      style: {},
      minWidth: 10,
      minHeight: 10,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE,
      keepAspectRatio: false,
    } satisfies Partial<ResizeControlProps>,
    _p
  );

  const contextNodeId = useNodeId();
  const id = () => (typeof p.nodeId === 'string' ? p.nodeId : contextNodeId());
  const store = useStoreApi();
  const resizeControlRef = useRef<HTMLDivElement | null>(null);
  const defaultPosition = () => (p.variant === ResizeControlVariant.Line ? 'right' : 'bottom-right');
  const controlPosition = () => p.position ?? defaultPosition();

  const resizer = useRef<XYResizerInstance | null>(null);

  createEffect(() => {
    const nodeId = id();
    if (!resizeControlRef.current || !nodeId) {
      return;
    }

    if (!resizer.current) {
      resizer.current = XYResizer({
        domNode: resizeControlRef.current,
        nodeId,
        getStoreItems: () => {
          return {
            nodeLookup: store.nodeLookup,
            transform: store.transform.get(),
            snapGrid: store.snapGrid.get(),
            snapToGrid: store.snapToGrid.get(),
            nodeOrigin: store.nodeOrigin.get(),
            paneDomNode: store.domNode.get(),
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const changes: NodeChange[] = [];
          const nextPosition = { x: change.x, y: change.y };
          const node = store.nodeLookup.get(nodeId);

          if (node && node.expandParent && node.parentId) {
            const origin = node.origin ?? store.nodeOrigin.get();
            const width = change.width ?? node.measured.width ?? 0;
            const height = change.height ?? node.measured.height ?? 0;

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
                  store.nodeLookup,
                  origin
                ),
              },
            };

            const parentExpandChanges = handleExpandParent(
              [child],
              store.nodeLookup,
              store.parentLookup,
              store.nodeOrigin.get()
            );
            changes.push(...parentExpandChanges);

            /*
             * when the parent was expanded by the child node, its position will be clamped at
             * 0,0 when node origin is 0,0 and to width, height if it's 1,1
             */
            nextPosition.x = change.x ? Math.max(origin[0] * width, change.x) : undefined;
            nextPosition.y = change.y ? Math.max(origin[1] * height, change.y) : undefined;
          }

          if (nextPosition.x !== undefined && nextPosition.y !== undefined) {
            const positionChange: NodePositionChange = {
              id: nodeId,
              type: 'position',
              position: { ...(nextPosition as XYPosition) },
            };
            changes.push(positionChange);
          }

          if (change.width !== undefined && change.height !== undefined) {
            const setAttributes = !p.resizeDirection ? true : p.resizeDirection === 'horizontal' ? 'width' : 'height';
            const dimensionChange: NodeDimensionChange = {
              id: nodeId,
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

          store.triggerNodeChanges(changes);
        },
        onEnd: ({ width, height }) => {
          const dimensionChange: NodeDimensionChange = {
            id: nodeId,
            type: 'dimensions',
            resizing: false,
            dimensions: {
              width,
              height,
            },
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
      resizeDirection: p.resizeDirection,
      onResizeStart: p.onResizeStart,
      onResize: p.onResize,
      onResizeEnd: p.onResizeEnd,
      shouldResize: p.shouldResize,
    });

    onCleanup(() => {
      resizer.current?.destroy();
    });
  });

  const positionClassNames = () => controlPosition().split('-');
  const colorStyleProp = () => (p.variant === ResizeControlVariant.Line ? 'borderColor' : 'backgroundColor');
  const controlStyle = (): JSX.CSSProperties | undefined =>
    p.color ? ({ ...p.style, [colorStyleProp()]: p.color } as JSX.CSSProperties) : p.style;

  return (
    <div
      class={cc(['react-flow__resize-control', 'nodrag', ...positionClassNames(), p.variant, p.className])}
      ref={(el) => (resizeControlRef.current = el)}
      style={controlStyle()}
    >
      {p.children}
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
export const NodeResizeControl = ResizeControl;

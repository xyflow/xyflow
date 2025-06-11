import { ResizeControlVariant, XY_RESIZER_HANDLE_POSITIONS, XY_RESIZER_LINE_POSITIONS } from '@xyflow/system';

import { NodeResizeControl } from './NodeResizeControl';
import type { NodeResizerProps } from './types';
import { For, Show, mergeProps } from 'solid-js';

/**
 * The `<NodeResizer />` component can be used to add a resize functionality to your
 * nodes. It renders draggable controls around the node to resize in all directions.
 * @public
 *
 * @example
 *```jsx
 *import { NodeResizer } from '@xyflow/solid';
 *
 *function ResizableNode({ data }) {
 *  return (
 *    <>
 *      <NodeResizer minWidth={100} minHeight={30} />
 *      <Handle type="target" position={Position.Left} />
 *      <div style={{ padding: 10 }}>{data.label}</div>
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *
 *export default ResizableNode;
 *```
 */
export function NodeResizer(_p: NodeResizerProps) {
  //   nodeId,
  //   isVisible = true,
  //   handleClassName,
  //   handleStyle,
  //   lineClassName,
  //   lineStyle,
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
  // }: NodeResizerProps) {
  const p = mergeProps(
    {
      isVisible: true,
      minWidth: 10,
      minHeight: 10,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE,
      keepAspectRatio: false,
    } satisfies Partial<NodeResizerProps>,
    _p
  );

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <Show when={p.isVisible}>
      <For each={XY_RESIZER_LINE_POSITIONS}>
        {(position) => (
          <NodeResizeControl
            className={p.lineClassName}
            style={p.lineStyle}
            nodeId={p.nodeId}
            position={position}
            variant={ResizeControlVariant.Line}
            color={p.color}
            minWidth={p.minWidth}
            minHeight={p.minHeight}
            maxWidth={p.maxWidth}
            maxHeight={p.maxHeight}
            onResizeStart={p.onResizeStart}
            keepAspectRatio={p.keepAspectRatio}
            shouldResize={p.shouldResize}
            onResize={p.onResize}
            onResizeEnd={p.onResizeEnd}
          />
        )}
      </For>
      <For each={XY_RESIZER_HANDLE_POSITIONS}>
        {(position) => (
          <NodeResizeControl
            className={p.handleClassName}
            style={p.handleStyle}
            nodeId={p.nodeId}
            position={position}
            color={p.color}
            minWidth={p.minWidth}
            minHeight={p.minHeight}
            maxWidth={p.maxWidth}
            maxHeight={p.maxHeight}
            onResizeStart={p.onResizeStart}
            keepAspectRatio={p.keepAspectRatio}
            shouldResize={p.shouldResize}
            onResize={p.onResize}
            onResizeEnd={p.onResizeEnd}
          />
        )}
      </For>
    </Show>
  );
}

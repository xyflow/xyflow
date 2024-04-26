import { ResizeControlVariant, XY_RESIZER_HANDLE_POSITIONS, XY_RESIZER_LINE_POSITIONS } from '@xyflow/system';

import { NodeResizeControl } from './NodeResizeControl';
import type { NodeResizerProps } from './types';
import { For, Show, mergeProps } from 'solid-js';

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
  const p = mergeProps({
    isVisible: true,
    minWidth: 10,
    minHeight: 10,
    maxWidth: Number.MAX_VALUE,
    maxHeight: Number.MAX_VALUE,
    keepAspectRatio: false,
  }, _p);

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <Show when={p.isVisible}>
    <For each={XY_RESIZER_LINE_POSITIONS}>
      {position => (
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
      {position => (
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

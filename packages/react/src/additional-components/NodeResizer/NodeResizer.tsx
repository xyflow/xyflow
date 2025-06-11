import { ResizeControlVariant, XY_RESIZER_HANDLE_POSITIONS, XY_RESIZER_LINE_POSITIONS } from '@xyflow/system';

import { NodeResizeControl } from './NodeResizeControl';
import type { NodeResizerProps } from './types';

/**
 * The `<NodeResizer />` component can be used to add a resize functionality to your
 * nodes. It renders draggable controls around the node to resize in all directions.
 * @public
 *
 * @example
 *```jsx
 *import { memo } from 'react';
 *import { Handle, Position, NodeResizer } from '@xyflow/react';
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
 *export default memo(ResizableNode);
 *```
 */
export function NodeResizer({
  nodeId,
  isVisible = true,
  handleClassName,
  handleStyle,
  lineClassName,
  lineStyle,
  color,
  minWidth = 10,
  minHeight = 10,
  maxWidth = Number.MAX_VALUE,
  maxHeight = Number.MAX_VALUE,
  keepAspectRatio = false,
  autoScale = true,
  shouldResize,
  onResizeStart,
  onResize,
  onResizeEnd,
}: NodeResizerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {XY_RESIZER_LINE_POSITIONS.map((position) => (
        <NodeResizeControl
          key={position}
          className={lineClassName}
          style={lineStyle}
          nodeId={nodeId}
          position={position}
          variant={ResizeControlVariant.Line}
          color={color}
          minWidth={minWidth}
          minHeight={minHeight}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onResizeStart={onResizeStart}
          keepAspectRatio={keepAspectRatio}
          autoScale={autoScale}
          shouldResize={shouldResize}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      ))}
      {XY_RESIZER_HANDLE_POSITIONS.map((position) => (
        <NodeResizeControl
          key={position}
          className={handleClassName}
          style={handleStyle}
          nodeId={nodeId}
          position={position}
          color={color}
          minWidth={minWidth}
          minHeight={minHeight}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onResizeStart={onResizeStart}
          keepAspectRatio={keepAspectRatio}
          autoScale={autoScale}
          shouldResize={shouldResize}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      ))}
    </>
  );
}

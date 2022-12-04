import ResizeControl from './ResizeControl';
import type { NodeResizerProps } from './types';

export default function NodeResizer({
  nodeId,
  handleClassName,
  handleStyle,
  lineClassName,
  lineStyle,
}: NodeResizerProps) {
  return (
    <>
      <ResizeControl className={handleClassName} style={handleStyle} nodeId={nodeId} position="top-left" />
      <ResizeControl className={lineClassName} variant="line" style={lineStyle} nodeId={nodeId} position="top" />
      <ResizeControl className={handleClassName} style={handleStyle} nodeId={nodeId} position="top-right" />

      <ResizeControl className={lineClassName} variant="line" style={lineStyle} nodeId={nodeId} position="left" />

      <ResizeControl className={handleClassName} style={handleStyle} nodeId={nodeId} position="bottom-left" />
      <ResizeControl className={lineClassName} variant="line" style={lineStyle} nodeId={nodeId} position="right" />
      <ResizeControl className={handleClassName} style={handleStyle} nodeId={nodeId} position="bottom-right" />
      <ResizeControl className={lineClassName} variant="line" position="bottom" style={lineStyle} nodeId={nodeId} />
    </>
  );
}

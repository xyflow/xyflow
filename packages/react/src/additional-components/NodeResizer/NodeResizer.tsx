import ResizeControl from './ResizeControl';
import { ControlPosition, NodeResizerProps, ResizeControlVariant, ControlLinePosition } from './types';

const handleControls: ControlPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const lineControls: ControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

export default function NodeResizer({
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
      {lineControls.map((c) => (
        <ResizeControl
          key={c}
          className={lineClassName}
          style={lineStyle}
          nodeId={nodeId}
          position={c}
          variant={ResizeControlVariant.Line}
          color={color}
          minWidth={minWidth}
          minHeight={minHeight}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onResizeStart={onResizeStart}
          keepAspectRatio={keepAspectRatio}
          shouldResize={shouldResize}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      ))}
      {handleControls.map((c) => (
        <ResizeControl
          key={c}
          className={handleClassName}
          style={handleStyle}
          nodeId={nodeId}
          position={c}
          color={color}
          minWidth={minWidth}
          minHeight={minHeight}
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          onResizeStart={onResizeStart}
          keepAspectRatio={keepAspectRatio}
          shouldResize={shouldResize}
          onResize={onResize}
          onResizeEnd={onResizeEnd}
        />
      ))}
    </>
  );
}

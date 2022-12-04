import ResizeControl from './ResizeControl';
import { ControlPosition, NodeResizerProps, ResizeControlVariant, ControlLinePosition } from './types';

const handleControls: ControlPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const lineControls: ControlLinePosition[] = ['top', 'right', 'bottom', 'left'];

export default function NodeResizer({
  nodeId,
  handleClassName,
  handleStyle,
  lineClassName,
  lineStyle,
}: NodeResizerProps) {
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
        />
      ))}
      {handleControls.map((c) => (
        <ResizeControl key={c} className={handleClassName} style={handleStyle} nodeId={nodeId} position={c} />
      ))}
    </>
  );
}

import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useKeyPress } from '@xyflow/react';

const DefaultResizerNode: FC<NodeProps> = ({ data, selected }) => {
  const keepAspectRatio = useKeyPress('k');

  return (
    <>
      <NodeResizer
        minWidth={data.minWidth ?? undefined}
        maxWidth={data.maxWidth ?? undefined}
        minHeight={data.minHeight ?? undefined}
        maxHeight={data.maxHeight ?? undefined}
        isVisible={data.isVisible ?? !!selected}
        shouldResize={data.shouldResize ?? undefined}
        onResizeStart={data.onResizeStart ?? undefined}
        onResize={data.onResize ?? undefined}
        onResizeEnd={data.onResizeEnd ?? undefined}
        keepAspectRatio={keepAspectRatio || (data.keepAspectRatio ?? undefined)}
      />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(DefaultResizerNode);

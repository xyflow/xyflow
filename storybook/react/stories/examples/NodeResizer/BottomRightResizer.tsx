import { memo, FC } from 'react';
import { Handle, Position, NodeProps, NodeResizeControl, ResizeControlVariant } from '@xyflow/react';

const CustomResizerNode: FC<NodeProps> = ({ data }) => {
  return (
    <>
      <NodeResizeControl
        variant={ResizeControlVariant.Handle}
        position="bottom-right"
        resizeDirection="horizontal"
        minWidth={100}
        maxWidth={500}
        color="orange"
        autoScale={false}
      />
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomResizerNode);

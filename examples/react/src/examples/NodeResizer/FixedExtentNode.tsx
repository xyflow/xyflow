import { FC, memo } from 'react';
import { Handle, Position, NodeResizer, NodeProps, Node } from '@xyflow/react';
import { ViewportPortal } from '@xyflow/react';

const ResizableNode: FC<NodeProps<Node<{ label: string; extent: [number, number][] }>>> = ({ data }) => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <ViewportPortal>
        <div
          style={{
            transform: `translate(${data.extent[0][0]}px, ${data.extent[0][1]}px)`,
            position: 'absolute',
            width: data.extent[1][0] - data.extent[0][0],
            height: data.extent[1][1] - data.extent[0][1],
            backgroundColor: 'rgb(255,0,0,0.25)',
          }}
        />
      </ViewportPortal>{' '}
    </>
  );
};

export default memo(ResizableNode);

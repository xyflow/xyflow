import { memo, useEffect } from 'react';
import { Position, NodeProps, useReactFlow, Handle, useNodeConnections, useNodesData } from '@xyflow/react';
import { isTextNode, type TextNode, type MyNode, type UppercaseNode } from '.';

function UppercaseNode({ id }: NodeProps<UppercaseNode>) {
  const { updateNodeData } = useReactFlow();
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData<MyNode>(connections[0]?.source);

  useEffect(() => {
    const text = nodesData?.type === 'text' ? nodesData?.data.text.toUpperCase() : undefined;
    updateNodeData(id, { text });
  }, [nodesData]);

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <Handle type="target" position={Position.Left} isConnectable={connections.length === 0} />
      <div>uppercase transform</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(UppercaseNode);

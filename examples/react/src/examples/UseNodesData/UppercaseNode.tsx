import { memo, useEffect } from 'react';
import { Position, NodeProps, useReactFlow, Handle, useNodeConnections, useNodesData } from '@xyflow/react';
import { isTextNode, type TextNode, type MyNode } from '.';

function UppercaseNode({ id }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData<MyNode>(connections[0]?.source);
  const textNode = isTextNode(nodesData) ? nodesData : null;

  useEffect(() => {
    updateNodeData(id, { text: textNode?.data.text.toUpperCase() });
  }, [textNode]);

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <Handle type="target" position={Position.Left} isConnectable={connections.length === 0} />
      <div>uppercase transform</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(UppercaseNode);

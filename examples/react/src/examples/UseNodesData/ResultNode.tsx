import { memo } from 'react';
import { Handle, Position, useNodeConnections, useNodesData } from '@xyflow/react';
import { isTextNode, type MyNode } from '.';

function ResultNode() {
  const connections = useNodeConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData<MyNode>(connections.map((connection) => connection.source));
  const textNodes = nodesData.filter(isTextNode);

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <Handle type="target" position={Position.Left} />
      <div>incoming texts: {textNodes.map(({ data }, i) => <div key={i}>{data.text}</div>) || 'none'}</div>
    </div>
  );
}

export default memo(ResultNode);

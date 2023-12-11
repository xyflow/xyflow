import { memo, useEffect } from 'react';
import { Handle, Position, useHandleConnections, useNodesData } from '@xyflow/react';

function ResultNode() {
  const connections = useHandleConnections({
    handleType: 'target',
  });
  const nodesData = useNodesData(connections.map((connection) => connection.source));

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <Handle type="target" position={Position.Left} />
      <div>
        incoming texts:{' '}
        {nodesData?.filter((nodeData) => nodeData.text !== undefined).map(({ text }, i) => <div key={i}>{text}</div>) ||
          'none'}
      </div>
    </div>
  );
}

export default memo(ResultNode);

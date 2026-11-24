import { useCallback, useState } from 'react';
import { useNodeConnections, useReactFlow } from '@xyflow/react';

export default function ObservedNodeConnectionsNode() {
  const { setEdges } = useReactFlow();
  const [observedId, setObservedId] = useState('a');
  const [events, setEvents] = useState<string[]>([]);
  const onConnect = useCallback((connections: { edgeId: string }[]) => {
    setEvents((previous) => [...previous, ...connections.map(({ edgeId }) => `connect:${edgeId}`)]);
  }, []);
  const onDisconnect = useCallback((connections: { edgeId: string }[]) => {
    setEvents((previous) => [...previous, ...connections.map(({ edgeId }) => `disconnect:${edgeId}`)]);
  }, []);
  const connections = useNodeConnections({ id: observedId, onConnect, onDisconnect });

  return (
    <div className="nodrag nopan">
      <output data-testid="observed-connections">{connections.map(({ edgeId }) => edgeId).join(',')}</output>
      <output data-testid="observed-connection-events">{events.join(',')}</output>
      <button onClick={() => setObservedId('c')}>Observe node c</button>
      <button onClick={() => setEdges((edges) => [...edges, { id: 'ac', source: 'a', target: 'c' }])}>
        Connect a and c
      </button>
    </div>
  );
}

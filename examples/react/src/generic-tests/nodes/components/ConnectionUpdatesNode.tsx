import { useCallback, useState } from 'react';
import { useNodeConnections, useReactFlow } from '@xyflow/react';

export default function ConnectionUpdatesNode() {
  const { setEdges } = useReactFlow();
  const [events, setEvents] = useState<string[]>([]);
  const onConnect = useCallback((connections: { edgeId: string }[]) => {
    setEvents((previous) => [...previous, ...connections.map(({ edgeId }) => `connect:${edgeId}`)]);
  }, []);
  const onDisconnect = useCallback((connections: { edgeId: string }[]) => {
    setEvents((previous) => [...previous, ...connections.map(({ edgeId }) => `disconnect:${edgeId}`)]);
  }, []);
  const connections = useNodeConnections({ id: 'a', onConnect, onDisconnect });

  return (
    <div className="nodrag nopan">
      <output data-testid="connections">{connections.map(({ edgeId }) => edgeId).join(',')}</output>
      <output data-testid="connection-events">{events.join(',')}</output>
      <button onClick={() => setEdges((edges) => [...edges, { id: 'ac', source: 'a', target: 'c' }])}>
        Add connection
      </button>
      <button onClick={() => setEdges((edges) => edges.filter(({ id }) => id !== 'ab'))}>Remove connection</button>
      <button onClick={() => setEdges([])}>Remove all connections</button>
    </div>
  );
}

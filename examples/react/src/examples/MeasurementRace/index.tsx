import { useEffect, useRef, useState } from 'react';
import { ReactFlow, ReactFlowProvider, Panel, Node, useNodesState, useStore, useStoreApi } from '@xyflow/react';

const edges = [{ id: 'a-b', source: 'a', target: 'b' }];

function MeasurementStatus() {
  const status = useStore((state) => {
    const nodes = [...state.nodeLookup.values()];
    const measured = nodes.filter((node) => node.measured.width && node.measured.height).length;
    const ready = nodes.filter((node) => node.internals.handleBounds).length;
    return `${measured} measured, ${ready} ready`;
  });

  return <span data-testid="measurement-status">{status}</span>;
}

function MeasurementRace() {
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [races, setRaces] = useState(0);
  const staleNodes = useRef<Node[]>([]);
  const pendingRace = useRef(false);

  useEffect(
    () =>
      store.subscribe((state) => {
        if (pendingRace.current && state.nodeLookup.get('a')?.internals.handleBounds) {
          pendingRace.current = false;
          // Reproduce a pending StoreUpdater effect running after measurement,
          // but before updateNodeInternals delivers its dimensions changes.
          state.setNodes(staleNodes.current.map((node) => ({ ...node })));
          setRaces((count) => count + 1);
        }
      }),
    [store]
  );

  const loadNodes = (explicitDimensions: boolean) => {
    staleNodes.current = ['a', 'b'].map((id, index) => ({
      id,
      data: { label: id.toUpperCase() },
      position: { x: 100 + index * 250, y: 100 + index * 150 },
      style: { width: 200, height: 40 },
      ...(explicitDimensions ? { width: 200, height: 40 } : {}),
    }));
    pendingRace.current = true;
    setNodes(staleNodes.current);
  };

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange}>
      <Panel position="top-right">
        <button onClick={() => loadNodes(false)}>Load nodes</button>
        <button onClick={() => loadNodes(true)}>Load nodes with explicit dimensions</button>
        <button onClick={() => setNodes((current) => current.map(({ measured, ...node }) => node))}>
          Reset measurements
        </button>
        <button onClick={() => setNodes((current) => current.map((node) => ({ ...node, hidden: !node.hidden })))}>
          Toggle hidden
        </button>
        <span data-testid="measurement-races">{races}</span>
        <MeasurementStatus />
      </Panel>
    </ReactFlow>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <MeasurementRace />
    </ReactFlowProvider>
  );
}

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeChange,
  applyNodeChanges,
} from '@xyflow/react';
import { SelectionMethod } from '@xyflow/system';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 125 },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Node 4' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

interface SelectionLog {
  id: string;
  selectionMethod?: SelectionMethod;
  timestamp: Date;
  selected: boolean;
}

export default function SelectionMethodExample() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectionLog, setSelectionLog] = useState<SelectionLog[]>([]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Log selection changes with their method
      changes.forEach((change) => {
        if (change.type === 'select') {
          const logEntry: SelectionLog = {
            id: change.id,
            selectionMethod: change.selectionMethod,
            timestamp: new Date(),
            selected: change.selected,
          };
          setSelectionLog((prev) => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }
      });

      onNodesChange(changes);
    },
    [onNodesChange]
  );

  const clearLog = useCallback(() => {
    setSelectionLog([]);
  }, []);

  const selectAllNodes = useCallback(() => {
    const changes = nodes.map((node) => ({
      id: node.id,
      type: 'select' as const,
      selected: true,
    }));
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [nodes, setNodes]);

  const deselectAllNodes = useCallback(() => {
    const changes = nodes.map((node) => ({
      id: node.id,
      type: 'select' as const,
      selected: false,
    }));
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [nodes, setNodes]);

  const getMethodColor = (method: SelectionMethod | undefined) => {
    switch (method) {
      case 'click':
        return '#3b82f6'; // blue
      case 'drag':
        return '#10b981'; // green
      case 'rectangle':
        return '#f59e0b'; // yellow
      case 'keyboard':
        return '#8b5cf6'; // purple
      case 'multi-select':
        return '#ef4444'; // red
      case 'programmatic':
        return '#6b7280'; // gray
      default:
        return '#6b7280'; // gray
    }
  };

  const getMethodLabel = (method: SelectionMethod | undefined) => {
    switch (method) {
      case 'click':
        return 'Click';
      case 'drag':
        return 'Drag';
      case 'keyboard':
        return 'Keyboard';
      case 'rectangle':
        return 'Rectangle';
      case 'multi-select':
        return 'Multi-Select';
      case 'programmatic':
        return 'Programmatic';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          selectNodesOnDrag={true}
          elementsSelectable={true}
          nodesDraggable={true}
          fitView
        />
      </div>

      <div style={{ width: '300px', padding: '20px', backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Selection Method Tracker</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Test Selection Methods:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={selectAllNodes}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Select All (Programmatic)
            </button>
            <button
              onClick={deselectAllNodes}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Deselect All (Programmatic)
            </button>
            <button
              onClick={clearLog}
              style={{
                padding: '8px 12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Clear Log
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Instructions:</h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', lineHeight: '1.4' }}>
            <li>
              <strong>Click:</strong> Click on nodes
            </li>
            <li>
              <strong>Drag:</strong> Drag nodes (selectNodesOnDrag enabled)
            </li>
            <li>
              <strong>Rectangle:</strong> Hold Shift and drag to select multiple
            </li>
            <li>
              <strong>Keyboard:</strong> Focus a node and press Space/Enter
            </li>
            <li>
              <strong>Multi-Select:</strong> Hold Ctrl/Cmd and click
            </li>
            <li>
              <strong>Programmatic:</strong> Use buttons above
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>Selection Log:</h4>
          {selectionLog.length === 0 ? (
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
              No selections yet. Try interacting with the nodes!
            </p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectionLog.map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    marginBottom: '4px',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getMethodColor(log.selectionMethod),
                        marginRight: '6px',
                      }}
                    />
                    <strong style={{ color: getMethodColor(log.selectionMethod) }}>
                      {getMethodLabel(log.selectionMethod)}
                    </strong>
                    <span style={{ marginLeft: 'auto', color: '#6b7280' }}>{log.selected ? '✓' : '✗'}</span>
                  </div>
                  <div style={{ color: '#374151' }}>
                    Node:{' '}
                    <code style={{ backgroundColor: '#f1f5f9', padding: '1px 3px', borderRadius: '2px' }}>
                      {log.id}
                    </code>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '10px' }}>{log.timestamp.toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

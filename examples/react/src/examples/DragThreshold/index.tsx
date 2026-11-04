import { useCallback, useState } from 'react';
import { ReactFlow, Background, Panel, useNodesState, Node, NodeMouseHandler } from '@xyflow/react';

const initNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 200, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 0, y: 200 } },
];

let clickCount = 0;

const DragThreshold = () => {
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [dragThreshold, setDragThreshold] = useState(1);
  const [snapGridSize, setSnapGridSize] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  const log = useCallback((msg: string) => {
    clickCount++;
    setMessages((msgs) => [`#${clickCount} ${msg}`, ...msgs].slice(0, 10));
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => log(`node click: node ${node.id}`), [log]);
  const onPaneClick = useCallback(() => log('pane click'), [log]);

  const snapToGrid = snapGridSize > 0;

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodeDragThreshold={dragThreshold}
      snapToGrid={snapToGrid}
      snapGrid={snapToGrid ? [snapGridSize, snapGridSize] : undefined}
      fitView
    >
      <Background gap={snapToGrid ? snapGridSize : undefined} />
      <Panel
        position="top-left"
        style={{
          background: 'var(--xy-node-background-color-default)',
          color: 'var(--xy-node-color-default)',
          border: 'var(--xy-node-border-default)',
          borderRadius: 5,
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div>
          <label>
            nodeDragThreshold{' '}
            <input
              type="number"
              min={0}
              value={dragThreshold}
              onChange={(evt) => setDragThreshold(+evt.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            snapGrid size (0 = off){' '}
            <input type="number" min={0} value={snapGridSize} onChange={(evt) => setSnapGridSize(+evt.target.value)} />
          </label>
        </div>
        <button onClick={() => setMessages([])} style={{ alignSelf: 'flex-start' }}>
          clear
        </button>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </Panel>
    </ReactFlow>
  );
};

export default DragThreshold;

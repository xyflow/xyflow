import { MouseEvent, useCallback, useState, DragEvent, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  Node,
  Edge,
  useReactFlow,
  Panel,
  OnNodeDrag,
  FitViewOptions,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from '@xyflow/react';
import SevenSegmentNode from './SevenSegmentNode';
import AnalogJoystickNode from './AnalogJoystickNode';
import ArduinoMegaNode from './ArduinoMegaNode';
import ArduinoNanoNode from './ArduinoNanoNode';

const onNodeDrag: OnNodeDrag = (_, node: Node, nodes: Node[]) => console.log('drag', node, nodes);
const onNodeDragStart = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag start', node, nodes);
const onNodeDragStop = (_: MouseEvent, node: Node, nodes: Node[]) => console.log('drag stop', node, nodes);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);

const printSelectionEvent = (name: string) => (_: MouseEvent, nodes: Node[]) => console.log(name, nodes);

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

const defaultEdgeOptions = {
  type: 'smoothstep',
};
const fitViewOptions: FitViewOptions = {
  padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
};

const nodeTypes: NodeTypes = {
  sevenSegment: SevenSegmentNode,
  analogJoystick: AnalogJoystickNode,
  arduinoMega: ArduinoMegaNode,
  arduinoNano: ArduinoNanoNode,
};

const componentLibrary = [
  { type: 'sevenSegment', label: '7-Segment Display', color: '#ff6b6b' },
  { type: 'analogJoystick', label: 'Analog Joystick', color: '#4ecdc4' },
  { type: 'arduinoMega', label: 'Arduino Mega', color: '#45b7d1' },
  { type: 'arduinoNano', label: 'Arduino Nano', color: '#96ceb4' },
];

const BasicFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const {
    addNodes,
    getNodes,
    getEdges,
    deleteElements,
    updateNodeData,
    toObject,
    setViewport,
    fitView,
    screenToFlowPosition,
  } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const updatePos = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        return {
          ...node,
          position: {
            x: Math.random() * 400,
            y: Math.random() * 400,
          },
        };
      })
    );
  };

  const logToObject = () => console.log(toObject());
  const resetTransform = () => setViewport({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        return {
          ...node,
          className: node.className === 'light' ? 'dark' : 'light',
        };
      })
    );
  };

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }, [deleteElements]);

  const deleteSomeElements = useCallback(() => {
    deleteElements({ nodes: [{ id: '2' }], edges: [{ id: 'e1-3' }] });
  }, []);

  const onSetNodes = () => {
    setNodes([
      { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node a' } },
      { id: 'b', position: { x: 0, y: 150 }, data: { label: 'Node b' } },
    ]);

    setEdges([{ id: 'a-b', source: 'a', target: 'b' }]);
    fitView();
  };

  const onUpdateNode = () => {
    updateNodeData('1', { label: 'update' });
    updateNodeData('2', { label: 'update' });
  };
  const addNode = () => {
    addNodes({
      id: `${Math.random()}`,
      data: { label: 'Node' },
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      className: 'light',
    });
    fitView();
  };
  const [isHidden, setIsHidden] = useState(false);

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      addNodes(newNode);
    },
    [screenToFlowPosition, addNodes]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <>
      <div style={{ display: 'flex', height: '100%', width: '100%' }}>
        {/* Sidebar */}
        <div
          style={{
            width: '200px',
            padding: '20px',
            background: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
            Components
          </h3>
          {componentLibrary.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              style={{
                padding: '10px',
                margin: '10px 0',
                background: component.color,
                color: 'white',
                borderRadius: '4px',
                cursor: 'grab',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {component.label}
            </div>
          ))}
          <div style={{ marginTop: '20px', fontSize: '11px', color: '#6c757d' }}>
            Drag components onto the canvas to add them
          </div>
        </div>

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100%' }}>
              <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDragStop={onNodeDragStop}
            onNodeDragStart={onNodeDragStart}
            onNodeDrag={onNodeDrag}
            onSelectionDragStart={printSelectionEvent('selection drag start')}
            onSelectionDrag={printSelectionEvent('selection drag')}
            onSelectionDragStop={printSelectionEvent('selection drag stop')}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="react-flow-basic-example"
            style={{ display: isHidden ? 'none' : 'block' }}
            minZoom={0.2}
            maxZoom={4}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            selectNodesOnDrag={false}
            elevateEdgesOnSelect
            elevateNodesOnSelect={false}
            nodeDragThreshold={0}
            nodeTypes={nodeTypes}
          >
            <Background variant={BackgroundVariant.Dots} />
            <MiniMap />
            <Controls />

            <Panel position="top-right">
              <button onClick={resetTransform}>reset transform</button>
              <button onClick={updatePos}>change pos</button>
              <button onClick={toggleClassnames}>toggle classnames</button>
              <button onClick={logToObject}>toObject</button>

              <button onClick={deleteSelectedElements}>deleteSelectedElements</button>
              <button onClick={deleteSomeElements}>deleteSomeElements</button>
              <button onClick={onSetNodes}>setNodes</button>
              <button onClick={onUpdateNode}>updateNode</button>
              <button onClick={addNode}>addNode</button>
            </Panel>
          </ReactFlow>
          <button
            onClick={toggleVisibility}
            style={{ position: 'absolute', zIndex: 10, right: 10, top: 100 }}
          >
            {isHidden ? 'Show' : 'Hide'} Flow
          </button>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}

import { type MouseEvent, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  type Node,
  type Edge,
  useReactFlow,
  Panel,
  type OnNodeDrag,
  type FitViewOptions,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

interface BasicProps {
  nodeDragThreshold?: number;
  classNames?: string;
  isHidden?: string;
  onNodeDrag?: OnNodeDrag;
  onNodeDragStart?: (event: MouseEvent, node: Node, nodes: Node[]) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node, nodes: Node[]) => void;
  onNodeClick?: (event: MouseEvent, node: Node) => void;
}

const printSelectionEvent = (name: string) => (_: MouseEvent, nodes: Node[]) => console.log(name, nodes);

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
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

const defaultEdgeOptions = {};
const fitViewOptions: FitViewOptions = {
  padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
};

const BasicFlow = (props: BasicProps) => {
  // Default handlers that do nothing if no props are provided
  const onNodeDrag: OnNodeDrag = props.onNodeDrag || (() => {});
  const onNodeDragStart = props.onNodeDragStart || (() => {});
  const onNodeDragStop = props.onNodeDragStop || (() => {});
  const onNodeClick = props.onNodeClick || (() => {});

  const {
    addNodes,
    setNodes,
    getNodes,
    setEdges,
    getEdges,
    deleteElements,
    updateNodeData,
    toObject,
    setViewport,
    fitView,
  } = useReactFlow();

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

  return (
    <>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        onNodesChange={console.log}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onSelectionDragStart={printSelectionEvent('selection drag start')}
        onSelectionDrag={printSelectionEvent('selection drag')}
        onSelectionDragStop={printSelectionEvent('selection drag stop')}
        className={props.classNames}
        style={{ display: props.isHidden === 'hidden' ? 'none' : 'block' }}
        minZoom={0.2}
        maxZoom={4}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        selectNodesOnDrag={false}
        elevateEdgesOnSelect
        elevateNodesOnSelect={false}
        nodeDragThreshold={props.nodeDragThreshold}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />

        <Panel position="top-right">
          <button onClick={resetTransform}>reset transform</button>
          <button onClick={updatePos}>change pos</button>
          <button onClick={logToObject}>toObject</button>

          <button onClick={deleteSelectedElements}>deleteSelectedElements</button>
          <button onClick={deleteSomeElements}>deleteSomeElements</button>
          <button onClick={onSetNodes}>setNodes</button>
          <button onClick={onUpdateNode}>updateNode</button>
          <button onClick={addNode}>addNode</button>
        </Panel>
      </ReactFlow>
    </>
  );
};

export default function App(props: BasicProps) {
  return (
    <div style={{ width: '100%', height: '95vh' }}>
      <ReactFlowProvider>
        <BasicFlow {...props} />
      </ReactFlowProvider>
    </div>
  );
}

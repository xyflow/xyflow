import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Edge,
  Node,
  NodeChange,
  applyNodeChanges,
  Connection,
  addEdge,
  applyEdgeChanges,
  EdgeChange,
  Controls,
  Background,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';

import { getNodesAndEdges } from './utils';
import { FrameRecorder, generateMouseEventParamsTargetingNode, nextFrame } from './performanceUtils';

const { nodes: initialNodes, edges: initialEdges } = getNodesAndEdges(25, 25);

const StressFlow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { fitView } = useReactFlow();
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const dragInViewport = async () => {
    // Note: selecting specifically node 18, as it’s normally located in the right part of the viewport –
    // which means dragging it left is safe to do without scrolling the viewport.
    const nodeElement = document.querySelector('.react-flow__node[data-id="18"]');
    if (!nodeElement) throw new Error('Node with id 18 not found');

    const frameRecorder = new FrameRecorder();

    // Hold down the mouse
    frameRecorder.setStage('mousedown');
    const mouseDownEvent = generateMouseEventParamsTargetingNode(nodeElement);
    nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseDownEvent));
    await nextFrame();

    // Start at the node position and move the mouse 5px to the left on every frame
    frameRecorder.setStage('mousemove');
    let currentXPosition = mouseDownEvent.clientX;
    for (let iteration = 0; iteration < 20; ++iteration) {
      const movementX = -5;
      currentXPosition += movementX;

      nodeElement.dispatchEvent(
        new MouseEvent('mousemove', {
          ...mouseDownEvent,
          clientX: currentXPosition,
          screenX: currentXPosition,
          movementX,
        })
      );
      await nextFrame();
    }

    // Release the mouse
    frameRecorder.setStage('mouseup');
    nodeElement.dispatchEvent(
      new MouseEvent('mouseup', {
        ...mouseDownEvent,
        clientX: currentXPosition,
        screenX: currentXPosition,
      })
    );
    await nextFrame();

    // Log the results
    await frameRecorder.endRecordingAsync();
    console.log('Frame durations:', frameRecorder.getFrames());
    console.log(
      'Frame durations for Observable (copy and paste to https://observablehq.com/@iamakulov/long-frame-visualizer):',
      frameRecorder.getFramesForObservable()
    );
  };

  const dragOutsideViewport = async () => {
    const randomNodeIndex = Math.floor(Math.random() * nodes.length);
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${nodes[randomNodeIndex].id}"]`);
    if (!nodeElement) throw new Error('Node not found');

    const frameRecorder = new FrameRecorder();

    // Hold down the mouse
    frameRecorder.setStage('mousedown');
    const mouseDownEvent = generateMouseEventParamsTargetingNode(nodeElement);
    nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseDownEvent));
    await nextFrame();

    // Move the mouse to the top of the viewport (so that the viewport starts
    // scrolling up). Then, wiggle the mouse up and down to keep the viewport
    // scrolling.
    frameRecorder.setStage('mousemove');
    let currentYPosition = 50;
    for (let iteration = 0; iteration < 20; ++iteration) {
      const movementY = Math.random() > 0.5 ? +2 : -2;
      currentYPosition += movementY;

      nodeElement.dispatchEvent(
        new MouseEvent('mousemove', {
          ...mouseDownEvent,
          clientY: currentYPosition,
          screenY: currentYPosition,
          movementY,
        })
      );
      await nextFrame();
    }

    // Release the mouse
    frameRecorder.setStage('mouseup');
    nodeElement.dispatchEvent(
      new MouseEvent('mouseup', {
        ...mouseDownEvent,
        clientY: currentYPosition,
        screenY: currentYPosition,
      })
    );
    await nextFrame();

    // Log the results
    await frameRecorder.endRecordingAsync();
    console.log('Frame durations:', frameRecorder.getFrames());
    console.log(
      'Frame durations for Observable (copy and paste to https://observablehq.com/@iamakulov/long-frame-visualizer):',
      frameRecorder.getFramesForObservable()
    );
  };

  const selectNode = async () => {
    const randomNodeIndex = Math.floor(Math.random() * nodes.length);
    const nodeElement = document.querySelector(`.react-flow__node[data-id="${nodes[randomNodeIndex].id}"]`);
    if (!nodeElement) throw new Error('Node not found');

    const frameRecorder = new FrameRecorder();

    const mouseEvent = generateMouseEventParamsTargetingNode(nodeElement);

    // mousedown
    frameRecorder.setStage('mousedown');
    nodeElement.dispatchEvent(new MouseEvent('mousedown', mouseEvent));
    await nextFrame();

    // click
    frameRecorder.setStage('click');
    nodeElement.dispatchEvent(new MouseEvent('click', mouseEvent));
    await nextFrame();

    // mouseup
    frameRecorder.setStage('mouseup');
    nodeElement.dispatchEvent(new MouseEvent('mouseup', mouseEvent));
    await nextFrame();

    // Log the results
    await frameRecorder.endRecordingAsync();
    console.log('Frame durations:', frameRecorder.getFrames());
    console.log(
      'Frame durations for Observable (copy and paste to https://observablehq.com/@iamakulov/long-frame-visualizer):',
      frameRecorder.getFramesForObservable()
    );
  };

  const [key, setKey] = useState(0);
  const frameRecorderRef = useRef<FrameRecorder | null>(null);
  function remount() {
    frameRecorderRef.current = new FrameRecorder();
    setKey((k) => k + 1);
  }
  useEffect(() => {
    const frameRecorder = frameRecorderRef.current;
    if (!frameRecorder) return;

    frameRecorder.endRecordingAsync().then(() => {
      console.log('Frame durations:', frameRecorder.getFrames());
      console.log(
        'Frame durations for Observable (copy and paste to https://observablehq.com/@iamakulov/long-frame-visualizer):',
        frameRecorder.getFramesForObservable()
      );

      frameRecorderRef.current = null;
    });
  }, [key]);

  const updatePos = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        return {
          ...n,
          position: {
            x: Math.random() * window.innerWidth * 4,
            y: Math.random() * window.innerHeight * 4,
          },
        };
      });
    });
    fitView();
  };

  const updateElements = () => {
    const grid = Math.ceil(Math.random() * 10);
    const initialElements = getNodesAndEdges(grid, grid);
    setNodes(initialElements.nodes);
    setEdges(initialElements.edges);
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgeChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  return (
    <ReactFlow
      key={key}
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgeChange}
      minZoom={0.2}
      fitView
    >
      <Controls />
      <Background />

      <Panel position="top-right">
        <button onClick={selectNode}>select node</button>
        <button onClick={dragInViewport}>drag node within the viewport</button>
        <button onClick={dragOutsideViewport}>drag node outside of the viewport</button>
        <button onClick={remount}>re-mount</button>
        <button onClick={updatePos}>change pos</button>
        <button onClick={updateElements}>update elements</button>
        <button
          onClick={() => {
            setNodes((nds) => [
              ...nds,
              { id: (nds.length + 1).toString(), position: { x: 0, y: 0 }, data: { label: `Node ${nds.length + 1}` } },
            ]);
          }}
        >
          Add element
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default function StressFlowProvider() {
  return (
    <ReactFlowProvider>
      <StressFlow />
    </ReactFlowProvider>
  );
}

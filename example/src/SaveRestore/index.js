import React, { memo, useCallback, useState } from 'react';
import localforage from 'localforage';
import ReactFlow, { ReactFlowProvider, useZoomPanHelper, removeElements, addEdge } from 'react-flow-renderer';

import './save.css';

localforage.config({
  name: 'react-flow',
  storeName: 'flow',
});

const flowKey = 'save-restore-key';

const initialElements = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
  { id: 'e1-2', source: '1', target: '2' },
];

const getNodeId = () => `randomnode_${+new Date()}`;

const Controls = memo(({ rfInstance, setElements }) => {
  const { transform } = useZoomPanHelper();

  const onSave = useCallback(() => {
    const flow = rfInstance.toObject();
    localforage.setItem(flowKey, flow);
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const onRestoreFlow = async () => {
      const flow = await localforage.getItem(flowKey);

      if (flow) {
        const [x = 0, y = 0] = flow.position;
        setElements(flow.elements || []);
        transform({ x, y, zoom: flow.zoom || 0 });
      }
    };

    onRestoreFlow();
  }, [setElements, transform]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: `random_node-${getNodeId()}`,
      data: { label: 'Added node' },
      position: { x: Math.random() * window.innerWidth - 100, y: Math.random() * window.innerHeight },
    };
    setElements((els) => els.concat(newNode));
  }, [setElements]);

  return (
    <div className="save__controls">
      <button onClick={onSave}>save</button>
      <button onClick={onRestore}>restore</button>
      <button onClick={onAdd}>add node</button>
    </div>
  );
});

const SaveRestore = () => {
  const [rfInstance, setRfInstance] = useState(null);
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <ReactFlowProvider>
      <ReactFlow elements={elements} onElementsRemove={onElementsRemove} onConnect={onConnect} onLoad={setRfInstance}>
        {rfInstance && <Controls rfInstance={rfInstance} setElements={setElements} />}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default SaveRestore;

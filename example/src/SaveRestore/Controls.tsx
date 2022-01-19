import React, { memo, useCallback, Dispatch, FC } from 'react';
import { useReactFlow, ReactFlowInstance, Edge, Node, ReactFlowJsonObject } from 'react-flow-renderer';
import localforage from 'localforage';

localforage.config({
  name: 'react-flow',
  storeName: 'flows',
});

const flowKey = 'example-flow';

const getNodeId = () => `randomnode_${+new Date()}`;

type ControlsProps = {
  rfInstance?: ReactFlowInstance;
  setNodes: Dispatch<React.SetStateAction<Node<any>[]>>;
  setEdges: Dispatch<React.SetStateAction<Edge<any>[]>>;
};

const Controls: FC<ControlsProps> = ({ rfInstance, setNodes, setEdges }) => {
  const { setViewport } = useReactFlow();

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localforage.setItem(flowKey, flow);
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow: ReactFlowJsonObject | null = await localforage.getItem(flowKey);

      if (flow) {
        const { x, y, zoom } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom: zoom || 0 });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: `random_node-${getNodeId()}`,
      data: { label: 'Added node' },
      position: { x: Math.random() * window.innerWidth - 100, y: Math.random() * window.innerHeight },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  return (
    <div className="save__controls">
      <button onClick={onSave}>save</button>
      <button onClick={onRestore}>restore</button>
      <button onClick={onAdd}>add node</button>
    </div>
  );
};

export default memo(Controls);

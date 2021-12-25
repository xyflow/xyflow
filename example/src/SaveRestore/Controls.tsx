import React, { memo, useCallback, Dispatch, FC } from 'react';
import { useZoomPanHelper, ReactFlowInstance, Edge, Node, FlowExportObject } from 'react-flow-renderer';
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
  const { setTransform } = useZoomPanHelper();

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localforage.setItem(flowKey, flow);
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow: FlowExportObject | null = await localforage.getItem(flowKey);

      if (flow) {
        const [x = 0, y = 0] = flow.position;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setTransform({ x, y, zoom: flow.zoom || 0 });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setTransform]);

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

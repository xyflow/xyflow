import { useCallback } from 'react';

import useReactFlow from './useReactFlow';
import { Node } from '../types';

export function useSetNodeData<NodeType extends Node = Node>() {
  const { setNodes } = useReactFlow();

  const setNodeData = useCallback(
    function setNodesData(
      id: string,
      dataUpdate: object | ((node: NodeType) => object),
      options: { replace: boolean } = { replace: true }
    ) {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            const nextData = typeof dataUpdate === 'function' ? dataUpdate(node as NodeType) : dataUpdate;
            return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
          }

          return node;
        })
      );
    },
    [setNodes]
  );

  return setNodeData;
}

import { useStore } from '$lib/store';
import type { Node } from '$lib/types';

export function useSetNodeData<NodeType extends Node = Node>() {
  const { nodes } = useStore();

  const setNodeData = (
    id: string,
    dataUpdate: object | ((node: NodeType) => object),
    options: { replace: boolean } = { replace: true }
  ) => {
    nodes.update((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const nextData =
            typeof dataUpdate === 'function' ? dataUpdate(node as NodeType) : dataUpdate;
          return options.replace
            ? { ...node, data: nextData }
            : { ...node, data: { ...node.data, ...nextData } };
        }

        return node;
      })
    );
  };

  return setNodeData;
}

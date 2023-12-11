import { useStore } from '$lib/store';

export function useUpdateNodeData(): (id: string, data: unknown) => void {
  const { nodes } = useStore();

  const updateNodeData = (id: string, data: unknown) => {
    nodes.update((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data
          };
        }

        return node;
      })
    );
  };

  return updateNodeData;
}

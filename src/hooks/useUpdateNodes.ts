import { useMemo } from 'react';
import { useStoreApi } from '../store';
import { Node } from '../types';

type FunctionParams<T> = (nodes: Node<T>[], setNodes: (nodes: Node<T>[]) => void) => void;

function useUpdateNodes<T>() {
  const store = useStoreApi();

  const update = useMemo(() => {
    return (action: FunctionParams<T>): void => {
      const { nodeInternals, setNodes } = store.getState();
      const nodes = Array.from(nodeInternals.values()) as Node<T>[];

      if (typeof action === 'function') {
        action(nodes, setNodes);
      }
    };
  }, []);

  return update;
}

export default useUpdateNodes;

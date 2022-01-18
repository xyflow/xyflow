import { useMemo } from 'react';
import { useStoreApi } from '../store';
import { Edge } from '../types';

type FunctionParams<T> = (nodes: Edge<T>[], setEdges: (nodes: Edge<T>[]) => void) => void;

function useUpdateEdges<T>() {
  const store = useStoreApi();

  const update = useMemo(() => {
    return (action: FunctionParams<T>): void => {
      const { edges, setEdges } = store.getState();

      if (typeof action === 'function') {
        action(edges, setEdges);
      }
    };
  }, []);

  return update;
}

export default useUpdateEdges;

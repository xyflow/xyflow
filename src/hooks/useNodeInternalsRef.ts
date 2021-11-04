import { useRef, useEffect } from 'react';

import { useStoreApi } from '../store';

function useNodeInternalsRef() {
  const store = useStoreApi();
  const nodeInternals = useRef(store.getState().nodeInternals);

  useEffect(() => store.subscribe((state) => (nodeInternals.current = state.nodeInternals)), []);

  return nodeInternals;
}

export default useNodeInternalsRef;

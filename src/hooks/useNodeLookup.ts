import { useRef } from 'react';

import { useStoreApi } from '../store';

function useNodeLookup() {
  const store = useStoreApi();
  const nodeLookup = useRef(store.getState().nodeLookup);

  return nodeLookup;
}

export default useNodeLookup;

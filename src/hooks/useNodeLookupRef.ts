import { useRef, useEffect } from 'react';

import { useStoreApi } from '../store';

function useNodeLookupRef() {
  const store = useStoreApi();
  const nodeLookup = useRef(store.getState().nodeLookup);

  useEffect(() => store.subscribe((state) => (nodeLookup.current = state.nodeLookup)), []);

  return nodeLookup;
}

export default useNodeLookupRef;

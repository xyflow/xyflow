import shallow from 'zustand/shallow';

import { useStore } from '../store';
import { Viewport, ReactFlowState } from '../types';

const viewportSelector = (state: ReactFlowState) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2],
});

function useViewport(): Viewport {
  const viewport = useStore(viewportSelector, shallow);

  return viewport;
}

export default useViewport;

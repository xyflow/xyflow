import { shallow } from 'zustand/shallow';
import type { Viewport } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import type { ReactFlowState } from '../types';

const viewportSelector = (state: ReactFlowState) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2],
});

/**
 * Hook for getting the current viewport from the store.
 *
 * @public
 * @returns The current viewport
 */
export function useViewport(): Viewport {
  const viewport = useStore(viewportSelector, shallow);

  return viewport;
}

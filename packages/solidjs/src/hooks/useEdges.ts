
import { useStore } from './useStore';
import type { Edge, SolidFlowState } from '../types';
import { Writable } from '../store/initialState';

const edgesSelector = (state: SolidFlowState) => state.edges;

/**
 * Hook for getting the current edges from the store.
 *
 * @public
 * @returns An array of edges
 */
export function useEdges<EdgeType extends Edge = Edge>(): Writable<EdgeType[]> {
  // TODO: fix this cast
  const edges = useStore(edgesSelector) as unknown as Writable<EdgeType[]>;

  return edges;
}

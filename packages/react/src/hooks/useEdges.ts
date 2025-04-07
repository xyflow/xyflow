import { shallow } from 'zustand/shallow';

import { useStore } from '../hooks/useStore';
import type { Edge, ReactFlowState } from '../types';

const edgesSelector = (state: ReactFlowState) => state.edges;

/**
 * This hook returns an array of the current edges. Components that use this hook
 * will re-render **whenever any edge changes**.
 *
 * @public
 * @returns An array of all edges currently in the flow.
 *
 * @example
 * ```tsx
 *import { useEdges } from '@xyflow/react';
 *
 *export default function () {
 *  const edges = useEdges();
 *
 *  return <div>There are currently {edges.length} edges!</div>;
 *}
 *```
 */
export function useEdges<EdgeType extends Edge = Edge>(): EdgeType[] {
  const edges = useStore(edgesSelector, shallow) as EdgeType[];

  return edges;
}

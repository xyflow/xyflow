import { useEdgesStore } from './useReactFlowStore';
import type { Node, Edge, EdgesStore } from '../types';
import { useReactFlow } from './useReactFlow';
import { useMemo } from 'react';

const edgesSelector = (state: EdgesStore) => state.edges;

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
  const edges = useEdgesStore(edgesSelector) as EdgeType[];

  return edges;
}

/**
 * This hook returns the edge with the given id. Components that use this hook
 * will re-render **whenever the edge changes**.
 *
 * @public
 * @param id - The id of the edge to return.
 * @returns The edge with the given id.
 *
 * @example
 * ```tsx
 *import { useEdge } from '@xyflow/react';
 *
 *export default function () {
 *  const edge = useEdge('1');
 *
 *  return <div>Edge: {edge?.data.label}</div>;
 *}
 *```
 */
export function useEdge<EdgeType extends Edge = Edge>(id: string): EdgeType | undefined {
  const { getEdge } = useReactFlow<Node, EdgeType>();
  useEdgesStore(edgesSelector);

  const edge = getEdge(id);

  return useMemo(() => edge, [edge]);
}

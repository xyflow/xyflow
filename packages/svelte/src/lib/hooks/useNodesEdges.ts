import { useStore } from '$lib/store';

export function useNodes() {
  const { nodes } = useStore();
  return nodes;
}

export function useEdges() {
  const { edges } = useStore();
  return edges;
}

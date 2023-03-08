import type { SvelteFlowProps } from '$lib/container/SvelteFlow/types';

export type SvelteFlowProviderProps = Pick<
  SvelteFlowProps,
  'nodes' | 'edges' | 'fitView' | 'nodeTypes'
>;

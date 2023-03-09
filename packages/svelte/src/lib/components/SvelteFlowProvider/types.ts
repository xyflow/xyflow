import type { Writable } from 'svelte/store';

import type { Edge } from '$lib/types';
import type { createNodes } from '$lib/utils';

export type SvelteFlowProviderProps = {
  nodes: ReturnType<typeof createNodes>;
  edges: Writable<Edge[]>;
};

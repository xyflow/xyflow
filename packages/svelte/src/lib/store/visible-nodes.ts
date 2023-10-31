import { derived } from 'svelte/store';
import { getNodesInside, type Transform } from '@xyflow/system';

import type { Node } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getVisibleNodes(store: SvelteFlowStoreState) {
  return derived(
    [store.nodes, store.onlyRenderVisibleElements, store.width, store.height, store.viewport],
    ([nodes, onlyRenderVisibleElements, width, height, viewport]) => {
      const transform: Transform = [viewport.x, viewport.y, viewport.zoom];

      return onlyRenderVisibleElements
        ? getNodesInside<Node>(nodes, { x: 0, y: 0, width, height }, transform, true)
        : nodes;
    }
  );
}

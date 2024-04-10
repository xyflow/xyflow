import { derived } from 'svelte/store';
import { getNodesInside, type Transform } from '@xyflow/system';
import type { SvelteFlowStoreState } from './types';

export function getVisibleNodes(store: SvelteFlowStoreState) {
  return derived(
    [
      store.nodeLookup,
      store.onlyRenderVisibleElements,
      store.width,
      store.height,
      store.viewport,
      store.nodes
    ],
    ([nodeLookup, onlyRenderVisibleElements, width, height, viewport]) => {
      const transform: Transform = [viewport.x, viewport.y, viewport.zoom];

      return onlyRenderVisibleElements
        ? getNodesInside(nodeLookup, { x: 0, y: 0, width, height }, transform, true)
        : Array.from(nodeLookup.values());
    }
  );
}

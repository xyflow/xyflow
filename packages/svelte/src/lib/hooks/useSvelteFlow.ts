import type { Viewport, ZoomInOut } from '@reactflow/system';

import { useStore } from '$lib/store';
import type { FitViewOptions } from '$lib/types';
import { get, writable, type Writable } from 'svelte/store';
import type { SvelteFlowStore } from '$lib/store/types';

export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  fitView: (options?: FitViewOptions) => void;
  viewport: Writable<Viewport>;
  nodes: SvelteFlowStore['nodes'];
  edges: SvelteFlowStore['edges'];
} {
  // how to get the new context here? fit view doesn't work, because the store is not updated (uses old nodes store)
  const { zoomIn, zoomOut, fitView, transform, nodes, edges } = useStore();

  const transformValues = get(transform);
  const viewportWritable = writable({
    x: transformValues[0],
    y: transformValues[1],
    zoom: transformValues[2]
  });

  transform.subscribe((ts) =>
    viewportWritable.set({
      x: ts[0],
      y: ts[1],
      zoom: ts[2]
    })
  );

  return {
    zoomIn,
    zoomOut,
    fitView,
    nodes,
    edges,
    viewport: viewportWritable
  };
}

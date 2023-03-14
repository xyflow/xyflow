import type { Project, Viewport, XYPosition, ZoomInOut } from '@reactflow/system';

import { useStore } from '$lib/store';
import type { FitViewOptions } from '$lib/types';
import { get, writable, type Writable } from 'svelte/store';
import type { SvelteFlowStore } from '$lib/store/types';
import { pointToRendererPoint } from '@reactflow/utils';

export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  fitView: (options?: FitViewOptions) => void;
  viewport: Writable<Viewport>;
  nodes: SvelteFlowStore['nodes'];
  edges: SvelteFlowStore['edges'];
  project: Project;
} {
  // how to get the new context here? fit view doesn't work, because the store is not updated (uses old nodes store)
  const { zoomIn, zoomOut, fitView, snapGrid: snapGridStore, transform, nodes, edges } = useStore();

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
    project: (position: XYPosition) => {
      const snapGrid = get(snapGridStore);
      return pointToRendererPoint(position, get(transform), snapGrid !== null, snapGrid || [1, 1]);
    },
    nodes,
    edges,
    viewport: viewportWritable
  };
}

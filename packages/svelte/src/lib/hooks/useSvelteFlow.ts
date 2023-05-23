import { get, writable, type Writable } from 'svelte/store';
import type {
  Project,
  SetCenterOptions,
  Viewport,
  ViewportHelperFunctionOptions,
  XYPosition,
  ZoomInOut
} from '@reactflow/system';
import { pointToRendererPoint } from '@reactflow/utils';

import { useStore } from '$lib/store';
import type { FitViewOptions } from '$lib/types';
import type { SvelteFlowStore } from '$lib/store/types';

export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  setZoom: (zoomLevel: number, options?: ViewportHelperFunctionOptions) => void;
  getZoom: () => number;
  setCenter: (x: number, y: number, options?: SetCenterOptions) => void;
  setViewport: (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void;
  getViewport: () => Viewport;
  fitView: (options?: FitViewOptions) => void;
  project: Project;
  viewport: Writable<Viewport>;
  nodes: SvelteFlowStore['nodes'];
  edges: SvelteFlowStore['edges'];
} {
  // how to get the new context here? fit view doesn't work, because the store is not updated (uses old nodes store)
  const {
    zoomIn,
    zoomOut,
    fitView,
    snapGrid,
    transform,
    width,
    height,
    maxZoom,
    panZoom,
    nodes,
    edges
  } = useStore();

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
    setZoom: (zoomLevel, options) => {
      get(panZoom)?.scaleTo(zoomLevel, { duration: options?.duration });
    },
    getZoom: () => get(transform)[2],
    setViewport: (viewport, options) => {
      const [x, y, zoom] = get(transform);

      get(panZoom)?.setTransformXYZ(
        {
          x: viewport.x ?? x,
          y: viewport.y ?? y,
          zoom: viewport.zoom ?? zoom
        },
        { duration: options?.duration }
      );
    },
    getViewport: () => {
      const [x, y, zoom] = get(transform);
      return { x, y, zoom };
    },
    setCenter: (x, y, options) => {
      const _width = get(width);
      const _height = get(height);
      const _maxZoom = get(maxZoom);

      const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : _maxZoom;
      const centerX = _width / 2 - x * nextZoom;
      const centerY = _height / 2 - y * nextZoom;

      get(panZoom)?.setTransformXYZ(
        {
          x: centerX,
          y: centerY,
          zoom: nextZoom
        },
        { duration: options?.duration }
      );
    },
    fitView,
    project: (position: XYPosition) => {
      const _snapGrid = get(snapGrid);
      return pointToRendererPoint(
        position,
        get(transform),
        _snapGrid !== null,
        _snapGrid || [1, 1]
      );
    },
    nodes,
    edges,
    viewport: viewportWritable
  };
}

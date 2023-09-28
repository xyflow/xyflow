import { get, writable, type Writable } from 'svelte/store';
import {
  pointToRendererPoint,
  type Project,
  type SetCenterOptions,
  type Viewport,
  type ViewportHelperFunctionOptions,
  type XYPosition,
  type ZoomInOut
} from '@xyflow/system';

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
  const {
    zoomIn,
    zoomOut,
    fitView,
    snapGrid,
    viewport,
    width,
    height,
    maxZoom,
    panZoom,
    nodes,
    edges
  } = useStore();

  return {
    zoomIn,
    zoomOut,
    setZoom: (zoomLevel, options) => {
      get(panZoom)?.scaleTo(zoomLevel, { duration: options?.duration });
    },
    getZoom: () => get(viewport).zoom,
    setViewport: (viewport, options) => {
      const { x, y, zoom } = get(viewport);

      get(panZoom)?.setViewport(
        {
          x: viewport.x ?? x,
          y: viewport.y ?? y,
          zoom: viewport.zoom ?? zoom
        },
        { duration: options?.duration }
      );
    },
    getViewport: () => get(viewport),
    setCenter: (x, y, options) => {
      const _width = get(width);
      const _height = get(height);
      const _maxZoom = get(maxZoom);

      const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : _maxZoom;

      get(panZoom)?.setViewport(
        {
          x: _width / 2 - x * nextZoom,
          y: _height / 2 - y * nextZoom,
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
        [$viewport.x, $viewport.y, $viewport.zoom],
        _snapGrid !== null,
        _snapGrid || [1, 1]
      );
    },
    nodes,
    edges,
    viewport: viewport
  };
}

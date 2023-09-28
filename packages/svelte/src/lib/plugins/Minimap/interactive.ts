import { get, type Writable } from 'svelte/store';
import {
  XYMinimap,
  type PanZoomInstance,
  type Viewport,
  type XYMinimapUpdate
} from '@xyflow/system';

export type UseInteractiveParams = {
  panZoom: PanZoomInstance;
  viewport: Writable<Viewport>;
  getViewScale: () => number;
} & XYMinimapUpdate;

export default function interactive(domNode: Element, params: UseInteractiveParams) {
  const minimap = XYMinimap({
    domNode,
    panZoom: params.panZoom,
    getTransform: () => {
      const viewport = get(params.viewport);
      return [viewport.x, viewport.y, viewport.zoom];
    },
    getViewScale: params.getViewScale
  });

  function update(params: UseInteractiveParams) {
    minimap.update({
      translateExtent: params.translateExtent,
      width: params.width,
      height: params.height,
      inversePan: params.inversePan,
      zoomStep: params.zoomStep,
      pannable: params.pannable,
      zoomable: params.zoomable
    });
  }

  return {
    update,
    destroy() {
      minimap.destroy();
    }
  };
}

import { get, type Writable } from 'svelte/store';
import {
  XYMinimap,
  type PanZoomInstance,
  type Transform,
  type XYMinimapUpdate
} from '@xyflow/system';

export type UseInteractiveParams = {
  panZoom: PanZoomInstance;
  transform: Writable<Transform>;
  getViewScale: () => number;
} & XYMinimapUpdate;

export default function interactive(domNode: Element, params: UseInteractiveParams) {
  const minimap = XYMinimap({
    domNode,
    panZoom: params.panZoom,
    getTransform: () => get(params.transform),
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

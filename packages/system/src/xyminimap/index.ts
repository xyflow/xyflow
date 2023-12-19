import { type D3ZoomEvent, zoom } from 'd3-zoom';
import { select, pointer } from 'd3-selection';

import type { CoordinateExtent, PanZoomInstance, Transform } from '../types';

export type XYMinimapInstance = {
  update: (params: XYMinimapUpdate) => void;
  destroy: () => void;
  pointer: typeof pointer;
};

export type XYMinimapParams = {
  panZoom: PanZoomInstance;
  domNode: Element;
  getTransform: () => Transform;
  getViewScale: () => number;
};

export type XYMinimapUpdate = {
  translateExtent: CoordinateExtent;
  width: number;
  height: number;
  inversePan?: boolean;
  zoomStep?: number;
  pannable?: boolean;
  zoomable?: boolean;
};

export function XYMinimap({ domNode, panZoom, getTransform, getViewScale }: XYMinimapParams) {
  const selection = select(domNode);

  function update({
    translateExtent,
    width,
    height,
    zoomStep = 10,
    pannable = true,
    zoomable = true,
    inversePan = false,
  }: XYMinimapUpdate) {
    const zoomHandler = (event: D3ZoomEvent<SVGSVGElement, any>) => {
      const transform = getTransform();

      if (event.sourceEvent.type !== 'wheel' || !panZoom) {
        return;
      }

      const pinchDelta =
        -event.sourceEvent.deltaY *
        (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 0.002) *
        zoomStep;
      const nextZoom = transform[2] * Math.pow(2, pinchDelta);

      panZoom.scaleTo(nextZoom);
    };

    const panHandler = (event: D3ZoomEvent<HTMLDivElement, any>) => {
      const transform = getTransform();

      if (event.sourceEvent.type !== 'mousemove' || !panZoom) {
        return;
      }

      const moveScale = getViewScale() * Math.max(transform[2], Math.log(transform[2])) * (inversePan ? -1 : 1);
      const position = {
        x: transform[0] - event.sourceEvent.movementX * moveScale,
        y: transform[1] - event.sourceEvent.movementY * moveScale,
      };
      const extent: CoordinateExtent = [
        [0, 0],
        [width, height],
      ];

      panZoom.setViewportConstrained(
        {
          x: position.x,
          y: position.y,
          zoom: transform[2],
        },
        extent,
        translateExtent
      );
    };

    const zoomAndPanHandler = zoom()
      // @ts-ignore
      .on('zoom', pannable ? panHandler : null)
      // @ts-ignore
      .on('zoom.wheel', zoomable ? zoomHandler : null);

    selection.call(zoomAndPanHandler, {});
  }

  function destroy() {
    selection.on('zoom', null);
  }

  return {
    update,
    destroy,
    pointer,
  };
}

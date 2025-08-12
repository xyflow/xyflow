import { type D3ZoomEvent, zoom } from 'd3-zoom';
import { select, pointer } from 'd3-selection';

import type { CoordinateExtent, PanZoomInstance, Transform } from '../types';
import { isMacOs } from '../utils';

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
    zoomStep = 1,
    pannable = true,
    zoomable = true,
    inversePan = false,
  }: XYMinimapUpdate) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zoomHandler = (event: D3ZoomEvent<SVGSVGElement, any>) => {
      if (event.sourceEvent.type !== 'wheel' || !panZoom) {
        return;
      }
      const transform = getTransform();
      const factor = event.sourceEvent.ctrlKey && isMacOs() ? 10 : 1;
      const pinchDelta =
        -event.sourceEvent.deltaY *
        (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 0.002) *
        zoomStep;
      const nextZoom = transform[2] * Math.pow(2, pinchDelta * factor);

      panZoom.scaleTo(nextZoom);
    };

    let panStart = [0, 0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const panStartHandler = (event: D3ZoomEvent<HTMLDivElement, any>) => {
      if (event.sourceEvent.type === 'mousedown' || event.sourceEvent.type === 'touchstart') {
        panStart = [
          event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
          event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY,
        ];
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const panHandler = (event: D3ZoomEvent<HTMLDivElement, any>) => {
      const transform = getTransform();

      if ((event.sourceEvent.type !== 'mousemove' && event.sourceEvent.type !== 'touchmove') || !panZoom) {
        return;
      }

      const panCurrent = [
        event.sourceEvent.clientX ?? event.sourceEvent.touches[0].clientX,
        event.sourceEvent.clientY ?? event.sourceEvent.touches[0].clientY,
      ];
      const panDelta = [panCurrent[0] - panStart[0], panCurrent[1] - panStart[1]];
      panStart = panCurrent;

      const moveScale = getViewScale() * Math.max(transform[2], Math.log(transform[2])) * (inversePan ? -1 : 1);
      const position = {
        x: transform[0] - panDelta[0] * moveScale,
        y: transform[1] - panDelta[1] * moveScale,
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
      .on('start', panStartHandler)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .on('zoom', pannable ? panHandler : null)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

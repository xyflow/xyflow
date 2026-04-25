import { modifier } from 'ember-modifier';
import {
  XYResizer,
  type ControlPosition,
  type OnResize,
  type OnResizeEnd,
  type OnResizeStart,
  type ResizeControlDirection,
  type ShouldResize,
  type XYResizerChange,
} from '@xyflow/system';

import { getFlowStore } from '../store/context.js';

type ResizeControlArgs = [
  string | undefined,
  ControlPosition,
  number,
  number,
  number,
  number,
  boolean,
  ResizeControlDirection | undefined,
  ShouldResize | undefined,
  OnResizeStart | undefined,
  OnResize | undefined,
  OnResizeEnd | undefined,
];

function dispatchResize(element: HTMLElement, id: string, change: XYResizerChange, resizing: boolean) {
  let store = getFlowStore(element);
  let node = store?.getNode(id);

  if (!store || !node) {
    return;
  }

  let currentPosition = store.getNodeUserPosition(node);
  let dimensions = {
    width: change.width ?? store.getNodeWidth(node),
    height: change.height ?? store.getNodeHeight(node),
  };
  let position = {
    x: change.x ?? currentPosition.x,
    y: change.y ?? currentPosition.y,
  };

  element.dispatchEvent(
    new CustomEvent('ember-flow:node-resize', {
      bubbles: true,
      detail: {
        id,
        position,
        dimensions,
        direction: [0, 0],
        resizing,
      },
    })
  );
}

export default modifier<HTMLDivElement, ResizeControlArgs>(
  (
    element,
    [
      nodeId,
      controlPosition,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      keepAspectRatio,
      resizeDirection,
      shouldResize,
      onResizeStart,
      onResize,
      onResizeEnd,
    ]
  ) => {
    let resizer: ReturnType<typeof XYResizer> | undefined;
    let frame: number | undefined;

    let install = () => {
      let store = getFlowStore(element);
      let id = nodeId ?? element.closest<HTMLElement>('.ember-flow__node')?.dataset['id'];

      if (!store || !id) {
        frame = requestAnimationFrame(install);
        return;
      }

      resizer = XYResizer({
        domNode: element,
        nodeId: id,
        getStoreItems: () => ({
          nodeLookup: store.nodeLookup,
          transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
          snapGrid: store.snapGrid,
          snapToGrid: store.snapToGrid,
          nodeOrigin: store.nodeOrigin,
          paneDomNode: store.domNode,
          panBy: store.panBy.bind(store),
          autoPanOnResize: store.autoPanOnNodeDrag,
          autoPanSpeed: store.autoPanSpeed,
        }),
        onChange: (change) => {
          dispatchResize(element, id, change, true);
        },
        onEnd: (change) => {
          dispatchResize(element, id, change, false);
        },
      });

      resizer.update({
        controlPosition,
        boundaries: {
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
        },
        keepAspectRatio,
        resizeDirection,
        shouldResize,
        onResizeStart,
        onResize,
        onResizeEnd,
      });
    };

    install();

    return () => {
      if (frame !== undefined) {
        cancelAnimationFrame(frame);
      }
      resizer?.destroy();
    };
  }
);

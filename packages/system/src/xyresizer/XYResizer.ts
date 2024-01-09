import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { NodeLookup, Transform } from '../types';
import { OnResize, OnResizeEnd, OnResizeStart, ResizeDragEvent, ShouldResize, ControlPosition } from './types';
import { getControlDirection, getDimensionsAfterResize, getPositionAfterResize, getResizeDirection } from './utils';
import { getPointerPosition } from '../utils';

const initPrevValues = { width: 0, height: 0, x: 0, y: 0 };

const initStartValues = {
  ...initPrevValues,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1,
};

const initChange = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  isXPosChange: false,
  isYPosChange: false,
  isWidthChange: false,
  isHeightChange: false,
};

export type XYResizerChange = typeof initChange;

type XYResizerParams = {
  domNode: HTMLDivElement;
  nodeId: string;
  getStoreItems: () => {
    nodeLookup: NodeLookup;
    transform: Transform;
    snapGrid?: [number, number];
    snapToGrid: boolean;
  };
  onChange: (changes: XYResizerChange) => void;
  onEnd?: () => void;
};

type XYResizerUpdateParams = {
  controlPosition: ControlPosition;
  boundries: {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
  keepAspectRatio: boolean;
  onResizeStart: OnResizeStart | undefined;
  onResize: OnResize | undefined;
  onResizeEnd: OnResizeEnd | undefined;
  shouldResize: ShouldResize | undefined;
};

export type XYResizerInstance = {
  update: (params: XYResizerUpdateParams) => void;
  destroy: () => void;
};

export function XYResizer({ domNode, nodeId, getStoreItems, onChange }: XYResizerParams): XYResizerInstance {
  const selection = select(domNode);

  function update({
    controlPosition,
    boundries,
    keepAspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
    shouldResize,
  }: XYResizerUpdateParams) {
    let prevValues = { ...initPrevValues };
    let startValues = { ...initStartValues };

    const controlDirection = getControlDirection(controlPosition);

    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const { nodeLookup, transform, snapGrid, snapToGrid } = getStoreItems();
        const node = nodeLookup.get(nodeId);
        const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });

        prevValues = {
          width: node?.computed?.width ?? 0,
          height: node?.computed?.height ?? 0,
          x: node?.position.x ?? 0,
          y: node?.position.y ?? 0,
        };

        startValues = {
          ...prevValues,
          pointerX: xSnapped,
          pointerY: ySnapped,
          aspectRatio: prevValues.width / prevValues.height,
        };

        onResizeStart?.(event, { ...prevValues });
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { nodeLookup, transform, snapGrid, snapToGrid } = getStoreItems();
        const pointerPosition = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
        const node = nodeLookup.get(nodeId);

        if (node) {
          const change = { ...initChange };

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;

          const { width, height } = getDimensionsAfterResize(
            startValues,
            controlDirection,
            pointerPosition,
            boundries,
            keepAspectRatio
          );

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          if (controlDirection.affectsX || controlDirection.affectsY) {
            const { x, y } = getPositionAfterResize(startValues, controlDirection, width, height);

            // only transform the node if the width or height changes
            const isXPosChange = x !== prevX && isWidthChange;
            const isYPosChange = y !== prevY && isHeightChange;

            if (isXPosChange || isYPosChange) {
              change.isXPosChange = isXPosChange;
              change.isYPosChange = isYPosChange;
              change.x = isXPosChange ? x : prevX;
              change.y = isYPosChange ? y : prevY;

              prevValues.x = change.x;
              prevValues.y = change.y;
            }
          }

          if (isWidthChange || isHeightChange) {
            change.isWidthChange = isWidthChange;
            change.isHeightChange = isHeightChange;
            change.width = width;
            change.height = height;
            prevValues.width = width;
            prevValues.height = height;
          }

          if (!change.isXPosChange && !change.isYPosChange && !isWidthChange && !isHeightChange) {
            return;
          }

          const direction = getResizeDirection({
            width: prevValues.width,
            prevWidth,
            height: prevValues.height,
            prevHeight,
            affectsX: controlDirection.affectsX,
            affectsY: controlDirection.affectsY,
          });

          const nextValues = { ...prevValues, direction };

          const callResize = shouldResize?.(event, nextValues);

          if (callResize === false) {
            return;
          }

          onResize?.(event, nextValues);
          onChange(change);
        }
      })
      .on('end', (event: ResizeDragEvent) => {
        onResizeEnd?.(event, { ...prevValues });
      });
    selection.call(dragHandler);
  }
  function destroy() {
    selection.on('.drag', null);
  }

  return {
    update,
    destroy,
  };
}

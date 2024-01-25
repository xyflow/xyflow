import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { getControlDirection, getDimensionsAfterResize, getPositionAfterResize, getResizeDirection } from './utils';
import { getPointerPosition } from '../utils';
import type { CoordinateExtent, NodeBase, NodeLookup, Transform } from '../types';
import type { OnResize, OnResizeEnd, OnResizeStart, ResizeDragEvent, ShouldResize, ControlPosition } from './types';

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

export type XYResizerChildChange = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  extent?: 'parent' | CoordinateExtent;
};

type XYResizerParams = {
  domNode: HTMLDivElement;
  nodeId: string;
  getStoreItems: () => {
    nodeLookup: NodeLookup;
    transform: Transform;
    snapGrid?: [number, number];
    snapToGrid: boolean;
  };
  onChange: (changes: XYResizerChange, childChanges: XYResizerChildChange[]) => void;
  onEnd?: () => void;
};

type XYResizerUpdateParams = {
  controlPosition: ControlPosition;
  boundaries: {
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

function nodeToParentExtent(node: NodeBase): CoordinateExtent {
  return [
    [0, 0],
    [node.computed!.width!, node.computed!.height!],
  ];
}

export function XYResizer({ domNode, nodeId, getStoreItems, onChange }: XYResizerParams): XYResizerInstance {
  const selection = select(domNode);

  function update({
    controlPosition,
    boundaries,
    keepAspectRatio,
    onResizeStart,
    onResize,
    onResizeEnd,
    shouldResize,
  }: XYResizerUpdateParams) {
    let prevValues = { ...initPrevValues };
    let startValues = { ...initStartValues };

    const controlDirection = getControlDirection(controlPosition);

    let childNodes: XYResizerChildChange[] = [];

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

        childNodes = [];
        nodeLookup.forEach((_node, _nodeId) => {
          if (_node.parentNode === nodeId) {
            childNodes.push({
              id: _nodeId,
              position: { ..._node.position },
              extent: _node.extent,
            });
          }
        });
        onResizeStart?.(event, { ...prevValues });
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { nodeLookup, transform, snapGrid, snapToGrid } = getStoreItems();
        const pointerPosition = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
        const node = nodeLookup.get(nodeId);

        let childChanges: XYResizerChildChange[] = [];

        if (node) {
          const change = { ...initChange };

          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;

          let extent = undefined;
          if (node.extent === 'parent') {
            const parentNode = nodeLookup.get(node.parentNode!);
            if (parentNode) {
              extent = nodeToParentExtent(parentNode);
            }
          }

          const { width, height, x, y } = getDimensionsAfterResize(
            startValues,
            controlDirection,
            pointerPosition,
            boundaries,
            keepAspectRatio,
            extent
          );

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          if (controlDirection.affectsX || controlDirection.affectsY) {
            // const {
            //   x,
            //   y,
            // } = getPositionAfterResize(startValues, controlDirection, width, height, extent);
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

            if (childNodes.length > 0) {
              const xChange = x - prevX;
              const yChange = y - prevY;
              childNodes.forEach((childNode) => {
                childNode.position = {
                  x: childNode.position.x - xChange,
                  y: childNode.position.y - yChange,
                };
                childChanges.push(childNode);
              });
            }
          }

          if (isWidthChange || isHeightChange) {
            if (extent) {
            }
            // console.log(clampedX, clampedY);
            change.isWidthChange = isWidthChange;
            change.isHeightChange = isHeightChange;
            change.width = width;
            change.height = height;
            prevValues.width = change.width;
            prevValues.height = change.height;
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
          onChange(change, childChanges);
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

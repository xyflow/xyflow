import { drag } from 'd3-drag';
import { select } from 'd3-selection';

import { getControlDirection, getDimensionsAfterResize, getResizeDirection } from './utils';
import { getPointerPosition } from '../utils';
import type { CoordinateExtent, NodeBase, NodeLookup, NodeOrigin, Transform, XYPosition } from '../types';
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
  position: XYPosition;
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
    nodeOrigin: NodeOrigin;
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

function nodeToChildExtent(child: NodeBase, parent: NodeBase, nodeOrigin: NodeOrigin): CoordinateExtent {
  const x = parent.position.x + child.position.x;
  const y = parent.position.y + child.position.y;
  const width = child.computed!.width! ?? 0;
  const height = child.computed!.height! ?? 0;
  const originOffsetX = nodeOrigin[0] * width;
  const originOffsetY = nodeOrigin[1] * height;

  return [
    [x - originOffsetX, y - originOffsetY],
    [x + width - originOffsetX, y + height - originOffsetY],
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

    let node: NodeBase | undefined = undefined;
    let childNodes: XYResizerChildChange[] = [];
    let parentNode: NodeBase | undefined = undefined; // Needed to fix expandParent
    let parentExtent: CoordinateExtent | undefined = undefined;
    let childExtent: CoordinateExtent | undefined = undefined;

    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const { nodeLookup, transform, snapGrid, snapToGrid, nodeOrigin } = getStoreItems();
        node = nodeLookup.get(nodeId);

        if (node) {
          const { xSnapped, ySnapped } = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });

          prevValues = {
            width: node.computed?.width ?? 0,
            height: node.computed?.height ?? 0,
            x: node.position.x ?? 0,
            y: node.position.y ?? 0,
          };

          startValues = {
            ...prevValues,
            pointerX: xSnapped,
            pointerY: ySnapped,
            aspectRatio: prevValues.width / prevValues.height,
          };

          parentNode = undefined;
          if (node.extent === 'parent' || node.expandParent) {
            parentNode = nodeLookup.get(node.parentNode!);
            if (parentNode && node.extent === 'parent') {
              parentExtent = nodeToParentExtent(parentNode);
            }
          }

          // Collect all child nodes to correct their relative positions when top/left changes
          // Determine largest minimal extent the parent node is allowed to resize to
          childNodes = [];
          childExtent = undefined;

          for (const [childId, child] of nodeLookup) {
            if (child.parentNode === nodeId) {
              childNodes.push({
                id: childId,
                position: { ...child.position },
                extent: child.extent,
              });

              if (child.extent === 'parent' || child.expandParent) {
                const extent = nodeToChildExtent(child, node!, child.origin ?? nodeOrigin);

                if (childExtent) {
                  childExtent = [
                    [Math.min(extent[0][0], childExtent[0][0]), Math.min(extent[0][1], childExtent[0][1])],
                    [Math.max(extent[1][0], childExtent[1][0]), Math.max(extent[1][1], childExtent[1][1])],
                  ];
                } else {
                  childExtent = extent;
                }
              }
            }
          }

          onResizeStart?.(event, { ...prevValues });
        }
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { transform, snapGrid, snapToGrid, nodeOrigin: storeNodeOrigin } = getStoreItems();
        const pointerPosition = getPointerPosition(event.sourceEvent, { transform, snapGrid, snapToGrid });
        const childChanges: XYResizerChildChange[] = [];

        if (node) {
          const { x: prevX, y: prevY, width: prevWidth, height: prevHeight } = prevValues;
          const change = { ...initChange };
          const nodeOrigin = node.origin ?? storeNodeOrigin;

          const { width, height, x, y } = getDimensionsAfterResize(
            startValues,
            controlDirection,
            pointerPosition,
            boundaries,
            keepAspectRatio,
            nodeOrigin,
            parentExtent,
            childExtent
          );

          const isWidthChange = width !== prevWidth;
          const isHeightChange = height !== prevHeight;

          const isXPosChange = x !== prevX && isWidthChange;
          const isYPosChange = y !== prevY && isHeightChange;

          if (isXPosChange || isYPosChange || nodeOrigin[0] === 1 || nodeOrigin[1] == 1) {
            change.isXPosChange = isXPosChange;
            change.isYPosChange = isYPosChange;
            change.x = isXPosChange ? x : prevX;
            change.y = isYPosChange ? y : prevY;

            prevValues.x = change.x;
            prevValues.y = change.y;

            // Fix expandParent when resizing from top/left
            if (parentNode && node.expandParent) {
              if (change.x < 0) {
                prevValues.x = 0;
                startValues.x = startValues.x - change.x;
              }

              if (change.y < 0) {
                prevValues.y = 0;
                startValues.y = startValues.y - change.y;
              }
            }

            if (childNodes.length > 0) {
              const xChange = x - prevX;
              const yChange = y - prevY;

              for (const childNode of childNodes) {
                childNode.position = {
                  x: childNode.position.x - xChange + nodeOrigin[0] * (width - prevWidth),
                  y: childNode.position.y - yChange + nodeOrigin[1] * (height - prevHeight),
                };
                childChanges.push(childNode);
              }
            }
          }

          if (isWidthChange || isHeightChange) {
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

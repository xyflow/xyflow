import type {
  Dimensions,
  XYPosition,
  CoordinateExtent,
  Box,
  Rect,
  NodeBase,
  NodeOrigin,
  SnapGrid,
  Transform,
  InternalNodeBase,
  NodeLookup,
  Padding,
  PaddingWithUnit,
} from '../types';
import { type Viewport } from '../types';
import { getNodePositionWithOrigin, isInternalNodeBase } from './graph';

import { defaultAriaLabelConfig, type AriaLabelConfig } from '../constants';

export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export const clampPosition = (
  position: XYPosition = { x: 0, y: 0 },
  extent: CoordinateExtent,
  dimensions: Partial<Dimensions>
) => ({
  x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
  y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0)),
});

export function clampPositionToParent<NodeType extends NodeBase>(
  childPosition: XYPosition,
  childDimensions: Dimensions,
  parent: InternalNodeBase<NodeType>
) {
  const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
  const { x: parentX, y: parentY } = parent.internals.positionAbsolute;

  return clampPosition(
    childPosition,
    [
      [parentX, parentY],
      [parentX + parentWidth, parentY + parentHeight],
    ],
    childDimensions
  );
}

/**
 * Calculates the velocity of panning when the mouse is close to the edge of the canvas
 * @internal
 * @param value - One dimensional poition of the mouse (x or y)
 * @param min - Minimal position on canvas before panning starts
 * @param max - Maximal position on canvas before panning starts
 * @returns - A number between 0 and 1 that represents the velocity of panning
 */
const calcAutoPanVelocity = (value: number, min: number, max: number): number => {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, min) / min;
  } else if (value > max) {
    return -clamp(Math.abs(value - max), 1, min) / min;
  }

  return 0;
};

export const calcAutoPan = (
  pos: XYPosition,
  bounds: Dimensions,
  speed: number = 15,
  distance: number = 40
): number[] => {
  const xMovement = calcAutoPanVelocity(pos.x, distance, bounds.width - distance) * speed;
  const yMovement = calcAutoPanVelocity(pos.y, distance, bounds.height - distance) * speed;

  return [xMovement, yMovement];
};

export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

export const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

export const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const nodeToRect = (node: InternalNodeBase | NodeBase, nodeOrigin: NodeOrigin = [0, 0]): Rect => {
  const { x, y } = isInternalNodeBase(node)
    ? node.internals.positionAbsolute
    : getNodePositionWithOrigin(node, nodeOrigin);

  return {
    x,
    y,
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0,
  };
};

export const nodeToBox = (node: InternalNodeBase | NodeBase, nodeOrigin: NodeOrigin = [0, 0]): Box => {
  const { x, y } = isInternalNodeBase(node)
    ? node.internals.positionAbsolute
    : getNodePositionWithOrigin(node, nodeOrigin);

  return {
    x,
    y,
    x2: x + (node.measured?.width ?? node.width ?? node.initialWidth ?? 0),
    y2: y + (node.measured?.height ?? node.height ?? node.initialHeight ?? 0),
  };
};

export const getBoundsOfRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

export const getOverlappingArea = (rectA: Rect, rectB: Rect): number => {
  const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
  const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));

  return Math.ceil(xOverlap * yOverlap);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRectObject = (obj: any): obj is Rect =>
  isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n);

// used for a11y key board controls for nodes and edges

export const devWarn = (id: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
  }
};

export const snapPosition = (position: XYPosition, snapGrid: SnapGrid = [1, 1]): XYPosition => {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1]),
  };
};

export const pointToRendererPoint = (
  { x, y }: XYPosition,
  [tx, ty, tScale]: Transform,
  snapToGrid = false,
  snapGrid: SnapGrid = [1, 1]
): XYPosition => {
  const position: XYPosition = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale,
  };

  return snapToGrid ? snapPosition(position, snapGrid) : position;
};

export const rendererPointToPoint = ({ x, y }: XYPosition, [tx, ty, tScale]: Transform): XYPosition => {
  return {
    x: x * tScale + tx,
    y: y * tScale + ty,
  };
};

/**
 * Parses a single padding value to a number
 * @internal
 * @param padding - Padding to parse
 * @param viewport - Width or height of the viewport
 * @returns The padding in pixels
 */
function parsePadding(padding: PaddingWithUnit, viewport: number): number {
  if (typeof padding === 'number') {
    return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
  }

  if (typeof padding === 'string' && padding.endsWith('px')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(paddingValue);
    }
  }

  if (typeof padding === 'string' && padding.endsWith('%')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(viewport * paddingValue * 0.01);
    }
  }

  console.error(
    `[React Flow] The padding value "${padding}" is invalid. Please provide a number or a string with a valid unit (px or %).`
  );
  return 0;
}

/**
 * Parses the paddings to an object with top, right, bottom, left, x and y paddings
 * @internal
 * @param padding - Padding to parse
 * @param width - Width of the viewport
 * @param height - Height of the viewport
 * @returns An object with the paddings in pixels
 */
function parsePaddings(
  padding: Padding,
  width: number,
  height: number
): { top: number; bottom: number; left: number; right: number; x: number; y: number } {
  if (typeof padding === 'string' || typeof padding === 'number') {
    const paddingY = parsePadding(padding, height);
    const paddingX = parsePadding(padding, width);
    return {
      top: paddingY,
      right: paddingX,
      bottom: paddingY,
      left: paddingX,
      x: paddingX * 2,
      y: paddingY * 2,
    };
  }

  if (typeof padding === 'object') {
    const top = parsePadding(padding.top ?? padding.y ?? 0, height);
    const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
    const left = parsePadding(padding.left ?? padding.x ?? 0, width);
    const right = parsePadding(padding.right ?? padding.x ?? 0, width);
    return { top, right, bottom, left, x: left + right, y: top + bottom };
  }

  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}

/**
 * Calculates the resulting paddings if the new viewport is applied
 * @internal
 * @param bounds - Bounds to fit inside viewport
 * @param x - X position of the viewport
 * @param y - Y position of the viewport
 * @param zoom - Zoom level of the viewport
 * @param width - Width of the viewport
 * @param height - Height of the viewport
 * @returns An object with the minimum padding required to fit the bounds inside the viewport
 */
function calculateAppliedPaddings(bounds: Rect, x: number, y: number, zoom: number, width: number, height: number) {
  const { x: left, y: top } = rendererPointToPoint(bounds, [x, y, zoom]);

  const { x: boundRight, y: boundBottom } = rendererPointToPoint(
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    [x, y, zoom]
  );

  const right = width - boundRight;
  const bottom = height - boundBottom;

  return {
    left: Math.floor(left),
    top: Math.floor(top),
    right: Math.floor(right),
    bottom: Math.floor(bottom),
  };
}

/**
 * Returns a viewport that encloses the given bounds with padding.
 * @public
 * @remarks You can determine bounds of nodes with {@link getNodesBounds} and {@link getBoundsOfRects}
 * @param bounds - Bounds to fit inside viewport.
 * @param width - Width of the viewport.
 * @param height  - Height of the viewport.
 * @param minZoom - Minimum zoom level of the resulting viewport.
 * @param maxZoom - Maximum zoom level of the resulting viewport.
 * @param padding - Padding around the bounds.
 * @returns A transformed {@link Viewport} that encloses the given bounds which you can pass to e.g. {@link setViewport}.
 * @example
 * const { x, y, zoom } = getViewportForBounds(
 * { x: 0, y: 0, width: 100, height: 100},
 * 1200, 800, 0.5, 2);
 */
export const getViewportForBounds = (
  bounds: Rect,
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  padding: Padding
): Viewport => {
  // First we resolve all the paddings to actual pixel values
  const p = parsePaddings(padding, width, height);

  const xZoom = (width - p.x) / bounds.width;
  const yZoom = (height - p.y) / bounds.height;

  // We calculate the new x, y, zoom for a centered view
  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom, minZoom, maxZoom);

  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;

  // Then we calculate the minimum padding, to respect asymmetric paddings
  const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);

  // We only want to have an offset if the newPadding is smaller than the required padding
  const offset = {
    left: Math.min(newPadding.left - p.left, 0),
    top: Math.min(newPadding.top - p.top, 0),
    right: Math.min(newPadding.right - p.right, 0),
    bottom: Math.min(newPadding.bottom - p.bottom, 0),
  };

  return {
    x: x - offset.left + offset.right,
    y: y - offset.top + offset.bottom,
    zoom: clampedZoom,
  };
};

export const isMacOs = () => typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Mac') >= 0;

export function isCoordinateExtent(extent?: CoordinateExtent | 'parent' | null): extent is CoordinateExtent {
  return extent !== undefined && extent !== null && extent !== 'parent';
}

export function getNodeDimensions(node: {
  measured?: { width?: number; height?: number };
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
}): { width: number; height: number } {
  return {
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0,
  };
}

export function nodeHasDimensions<NodeType extends NodeBase = NodeBase>(node: NodeType): boolean {
  return (
    (node.measured?.width ?? node.width ?? node.initialWidth) !== undefined &&
    (node.measured?.height ?? node.height ?? node.initialHeight) !== undefined
  );
}

/**
 * Convert child position to aboslute position
 *
 * @internal
 * @param position
 * @param parentId
 * @param nodeLookup
 * @param nodeOrigin
 * @returns an internal node with an absolute position
 */
export function evaluateAbsolutePosition(
  position: XYPosition,
  dimensions: { width?: number; height?: number } = { width: 0, height: 0 },
  parentId: string,
  nodeLookup: NodeLookup,
  nodeOrigin: NodeOrigin
): XYPosition {
  const positionAbsolute = { ...position };

  const parent = nodeLookup.get(parentId);
  if (parent) {
    const origin = parent.origin || nodeOrigin;
    positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
    positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
  }

  return positionAbsolute;
}

export function areSetsEqual(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) {
    return false;
  }

  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }

  return true;
}

/**
 * Polyfill for Promise.withResolvers until we can use it in all browsers
 * @internal
 */
export function withResolvers<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

export function mergeAriaLabelConfig(partial?: Partial<AriaLabelConfig>): AriaLabelConfig {
  return { ...defaultAriaLabelConfig, ...(partial || {}) };
}

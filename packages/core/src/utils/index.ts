import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';

import type { Dimensions, Node, XYPosition, CoordinateExtent, Box, Rect } from '../types';

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

export const clamp = (val: number, min = 0, max = 1): number => Math.min(Math.max(val, min), max);

export const clampPosition = (position: XYPosition = { x: 0, y: 0 }, extent: CoordinateExtent) => ({
  x: clamp(position.x, extent[0][0], extent[1][0]),
  y: clamp(position.y, extent[0][1], extent[1][1]),
});

// returns a number between 0 and 1 that represents the velocity of the movement
// when the mouse is close to the edge of the canvas
const calcAutoPanVelocity = (value: number, min: number, max: number): number => {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, 50) / 50;
  } else if (value > max) {
    return -clamp(Math.abs(value - max), 1, 50) / 50;
  }

  return 0;
};

export const calcAutoPan = (pos: XYPosition, bounds: Dimensions): number[] => {
  const xMovement = calcAutoPanVelocity(pos.x, 35, bounds.width - 35) * 20;
  const yMovement = calcAutoPanVelocity(pos.y, 35, bounds.height - 35) * 20;

  return [xMovement, yMovement];
};

export const getHostForElement = (element: HTMLElement): Document | ShadowRoot =>
  (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

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

export const nodeToRect = (node: Node): Rect => ({
  ...(node.positionAbsolute || { x: 0, y: 0 }),
  width: node.width || 0,
  height: node.height || 0,
});

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

export const internalsSymbol = Symbol.for('internals');

// used for a11y key board controls for nodes and edges
export const elementSelectionKeys = ['Enter', ' ', 'Escape'];

export const devWarn = (id: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
  }
};

const isReactKeyboardEvent = (event: KeyboardEvent | ReactKeyboardEvent): event is ReactKeyboardEvent =>
  'nativeEvent' in event;

export function isInputDOMNode(event: KeyboardEvent | ReactKeyboardEvent): boolean {
  const kbEvent = isReactKeyboardEvent(event) ? event.nativeEvent : event;
  // using composed path for handling shadow dom
  const target = (kbEvent.composedPath?.()?.[0] || event.target) as HTMLElement;

  const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.nodeName) || target?.hasAttribute('contenteditable');

  // when an input field is focused we don't want to trigger deletion or movement of nodes
  return isInput || !!target?.closest('.nokey');
}

export const isMouseEvent = (
  event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent
): event is MouseEvent | ReactMouseEvent => 'clientX' in event;

export const getEventPosition = (
  event: MouseEvent | ReactMouseEvent | TouchEvent | ReactTouchEvent,
  bounds?: DOMRect
) => {
  const isMouseTriggered = isMouseEvent(event);
  const evtX = isMouseTriggered ? event.clientX : event.touches?.[0].clientX;
  const evtY = isMouseTriggered ? event.clientY : event.touches?.[0].clientY;

  return {
    x: evtX - (bounds?.left ?? 0),
    y: evtY - (bounds?.top ?? 0),
  };
};

export const isMacOs = () => typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Mac') >= 0;

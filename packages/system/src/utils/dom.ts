import type { Transform, XYPosition, SnapGrid, Dimensions, Position, Handle } from '../types';
import { snapPosition, pointToRendererPoint } from './general';

export type GetPointerPositionParams = {
  transform: Transform;
  snapGrid?: SnapGrid;
  snapToGrid?: boolean;
  containerBounds: DOMRect | null;
};

export function getPointerPosition(
  event: MouseEvent | TouchEvent,
  { snapGrid = [0, 0], snapToGrid = false, transform, containerBounds }: GetPointerPositionParams
): XYPosition & { xSnapped: number; ySnapped: number } {
  const { x, y } = getEventPosition(event);
  const pointerPos = pointToRendererPoint(
    { x: x - (containerBounds?.left ?? 0), y: y - (containerBounds?.top ?? 0) },
    transform
  );
  const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;

  // we need the snapped position in order to be able to skip unnecessary drag events
  return {
    xSnapped,
    ySnapped,
    ...pointerPos,
  };
}

export const getDimensions = (node: HTMLDivElement): Dimensions => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
});

export const getHostForElement = (element: HTMLElement | EventTarget | null): Document | ShadowRoot =>
  ((element as Partial<HTMLElement> | null)?.getRootNode?.() as Document | ShadowRoot) || window?.document;

const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];

export function isInputDOMNode(event: KeyboardEvent): boolean {
  // using composed path for handling shadow dom
  const target = (event.composedPath?.()?.[0] || event.target) as Element | null;
  if (target?.nodeType !== 1 /* Node.ELEMENT_NODE */) return false;

  const isInput = inputTags.includes(target.nodeName) || target.hasAttribute('contenteditable');
  // when an input field is focused we don't want to trigger deletion or movement of nodes
  return isInput || !!target.closest('.nokey');
}

export const isMouseEvent = (event: MouseEvent | TouchEvent): event is MouseEvent => 'clientX' in event;

export const getEventPosition = (event: MouseEvent | TouchEvent, bounds?: DOMRect) => {
  const isMouse = isMouseEvent(event);
  const evtX = isMouse ? event.clientX : event.touches?.[0].clientX;
  const evtY = isMouse ? event.clientY : event.touches?.[0].clientY;

  return {
    x: evtX - (bounds?.left ?? 0),
    y: evtY - (bounds?.top ?? 0),
  };
};

/*
 * The handle bounds are calculated relative to the node element.
 * We store them in the internals object of the node in order to avoid
 * unnecessary recalculations.
 */
export const getHandleBounds = (
  type: 'source' | 'target',
  nodeElement: HTMLDivElement,
  nodeBounds: DOMRect,
  zoom: number,
  nodeId: string
): Handle[] | null => {
  const handles = nodeElement.querySelectorAll(`.${type}`);

  if (!handles || !handles.length) {
    return null;
  }

  return Array.from(handles).map((handle): Handle => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      type,
      nodeId,
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: (handleBounds.left - nodeBounds.left) / zoom,
      y: (handleBounds.top - nodeBounds.top) / zoom,
      ...getDimensions(handle as HTMLDivElement),
    };
  });
};

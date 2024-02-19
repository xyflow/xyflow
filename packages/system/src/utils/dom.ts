import type { Transform, XYPosition, SnapGrid, Dimensions, NodeOrigin, HandleElement, Position } from '../types';
import { snapPosition, pointToRendererPoint } from './general';

export type GetPointerPositionParams = {
  transform: Transform;
  snapGrid?: SnapGrid;
  snapToGrid?: boolean;
};

export function getPointerPosition(
  event: MouseEvent | TouchEvent,
  { snapGrid = [0, 0], snapToGrid = false, transform }: GetPointerPositionParams
): XYPosition & { xSnapped: number; ySnapped: number } {
  const { x, y } = getEventPosition(event);
  const pointerPos = pointToRendererPoint({ x, y }, transform);
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

export const getHostForElement = (element: HTMLElement): Document | ShadowRoot =>
  (element.getRootNode?.() as Document | ShadowRoot) || window?.document;

const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];

export function isInputDOMNode(event: KeyboardEvent): boolean {
  // using composed path for handling shadow dom
  const target = (event.composedPath?.()?.[0] || event.target) as HTMLElement;
  const isInput = inputTags.includes(target?.nodeName) || target?.hasAttribute('contenteditable');

  // when an input field is focused we don't want to trigger deletion or movement of nodes
  return isInput || !!target?.closest('.nokey');
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

// The handle bounds are calculated relative to the node element.
// We store them in the internals object of the node in order to avoid
// unnecessary recalculations.
export const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  zoom: number,
  nodeOrigin: NodeOrigin = [0, 0]
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  // @todo can't we use the node dimensions here?
  const nodeBounds = nodeElement.getBoundingClientRect();
  const nodeOffset = {
    x: nodeBounds.width * nodeOrigin[0],
    y: nodeBounds.height * nodeOrigin[1],
  };

  return handlesArray.map((handle): HandleElement => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      position: handle.getAttribute('data-handlepos') as unknown as Position,
      x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
      y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
      ...getDimensions(handle),
    };
  });
};

import type {
  Dimensions,
  XYPosition,
  CoordinateExtent,
  Box,
  Rect,
  BaseNode,
  BaseEdge,
  NodeOrigin,
  HandleElement,
  Position,
} from '../types';
import { getConnectedEdgesBase, getNodePositionWithOrigin } from './graph';

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

export const nodeToRect = (node: BaseNode, nodeOrigin: NodeOrigin = [0, 0]): Rect => {
  const { positionAbsolute } = getNodePositionWithOrigin(node, node.origin || nodeOrigin);

  return {
    ...positionAbsolute,
    width: node.width || 0,
    height: node.height || 0,
  };
};

export const nodeToBox = (node: BaseNode, nodeOrigin: NodeOrigin = [0, 0]): Box => {
  const { positionAbsolute } = getNodePositionWithOrigin(node, node.origin || nodeOrigin);

  return {
    ...positionAbsolute,
    x2: positionAbsolute.x + (node.width || 0),
    y2: positionAbsolute.y + (node.height || 0),
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
export const elementSelectionKeys = ['Enter', ' ', 'Escape'];

export const devWarn = (id: string, message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[React Flow]: ${message} Help: https://reactflow.dev/error#${id}`);
  }
};

export function isInputDOMNode(event: KeyboardEvent): boolean {
  // using composed path for handling shadow dom
  const target = (event.composedPath?.()?.[0] || event.target) as HTMLElement;

  const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.nodeName) || target?.hasAttribute('contenteditable');
  // we want to be able to do a multi selection event if we are in an input field
  const isModifierKey = event.ctrlKey || event.metaKey || event.shiftKey;

  // when an input field is focused we don't want to trigger deletion or movement of nodes
  return (isInput && !isModifierKey) || !!target?.closest('.nokey');
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

// helper function to get arrays of nodes and edges that can be deleted
// you can pass in a list of nodes and edges that should be deleted
// and the function only returns elements that are deletable and also handles connected nodes and child nodes
export function getElementsToRemove<NodeType extends BaseNode = BaseNode, EdgeType extends BaseEdge = BaseEdge>({
  nodesToRemove,
  edgesToRemove,
  nodes,
  edges,
}: {
  nodesToRemove: Partial<NodeType>[];
  edgesToRemove: Partial<EdgeType>[];
  nodes: NodeType[];
  edges: EdgeType[];
}): {
  matchingNodes: NodeType[];
  matchingEdges: EdgeType[];
} {
  const nodeIds = nodesToRemove.map((node) => node.id);
  const edgeIds = edgesToRemove.map((edge) => edge.id);

  const matchingNodes = nodes.reduce<NodeType[]>((res, node) => {
    const parentHit = !nodeIds.includes(node.id) && node.parentNode && res.find((n) => n.id === node.parentNode);
    const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
    if (deletable && (nodeIds.includes(node.id) || parentHit)) {
      res.push(node);
    }

    return res;
  }, []);
  const deletableEdges = edges.filter((e) => (typeof e.deletable === 'boolean' ? e.deletable : true));
  const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
  const connectedEdges = getConnectedEdgesBase<NodeType, EdgeType>(matchingNodes, deletableEdges);
  const matchingEdges = [...initialHitEdges, ...connectedEdges];

  return {
    matchingEdges,
    matchingNodes,
  };
}

export const getPositionWithOrigin = ({
  x,
  y,
  width,
  height,
  origin = [0, 0],
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  origin?: NodeOrigin;
}): XYPosition => {
  if (!width || !height || origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
    return { x, y };
  }

  return {
    x: x - width * origin[0],
    y: y - height * origin[1],
  };
};

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

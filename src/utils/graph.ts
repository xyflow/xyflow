import store, { StoreModel } from '../store';
import { ElementId, Node, Edge, Elements, Transform, XYPosition, Rect, FitViewParams, Box, Connection } from '../types';
import { Store } from 'easy-peasy';

export const isEdge = (element: Node | Connection | Edge): element is Edge =>
  'id' in element && 'source' in element && 'target' in element;

export const isNode = (element: Node | Connection | Edge): element is Node =>
  'id' in element && !('source' in element) && !('target' in element);

export const getOutgoers = (node: Node, elements: Elements): Node[] => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = elements.filter((e) => isEdge(e) && e.source === node.id).map((e) => (e as Edge).target);
  return elements.filter((e) => outgoerIds.includes(e.id)) as Node[];
};

export const removeElements = (elementsToRemove: Elements, elements: Elements): Elements => {
  const nodeIdsToRemove = elementsToRemove.map((n) => n.id);

  return elements.filter((element) => {
    const edgeElement = element as Edge;
    return !(
      nodeIdsToRemove.includes(element.id) ||
      nodeIdsToRemove.includes(edgeElement.target) ||
      nodeIdsToRemove.includes(edgeElement.source)
    );
  });
};

const getEdgeId = ({ source, target }: Connection): ElementId => `reactflow__edge-${source}-${target}`;

export const addEdge = (edgeParams: Edge | Connection, elements: Elements): Elements => {
  if (!edgeParams.source || !edgeParams.target) {
    throw new Error("Can't create edge. An edge needs a source and a target.");
  }

  // make sure that there is node with the target and one with the source id
  [edgeParams.source, edgeParams.target].forEach((id) => {
    const nodeId = id.includes('__') ? id.split('__')[0] : id;
    if (!elements.find((e) => isNode(e) && e.id === nodeId)) {
      throw new Error(`Can't create edge. Node with id=${nodeId} does not exist.`);
    }
  });

  if (isEdge(edgeParams)) {
    return elements.concat({ ...edgeParams });
  }

  const edge = {
    ...edgeParams,
    id: getEdgeId(edgeParams),
  } as Edge;

  return elements.concat(edge);
};

export const pointToRendererPoint = (
  { x, y }: XYPosition,
  [tx, ty, tScale]: Transform,
  snapToGrid: boolean,
  [snapX, snapY]: [number, number]
): XYPosition => {
  const position: XYPosition = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale,
  };

  if (snapToGrid) {
    return {
      x: snapX * Math.round(position.x / snapX),
      y: snapY * Math.round(position.y / snapY),
    };
  }

  return position;
};

export const onLoadProject = (currentStore: Store<StoreModel>) => {
  return (position: XYPosition): XYPosition => {
    const { transform, snapToGrid, snapGrid } = currentStore.getState();

    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
  };
};

export const project = (position: XYPosition): XYPosition => {
  const { transform, snapToGrid, snapGrid } = store.getState();

  return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
};

export const parseElement = (element: Node | Edge): Node | Edge => {
  if (!element.id) {
    throw new Error('All nodes and edges need to have an id.');
  }

  if (isEdge(element)) {
    return {
      ...element,
      source: element.source.toString(),
      target: element.target.toString(),
      id: element.id.toString(),
      type: element.type || 'default',
    };
  }

  return {
    ...element,
    id: element.id.toString(),
    type: element.type || 'default',
    __rf: {
      position: element.position,
      width: null,
      height: null,
      handleBounds: {},
    },
  } as Node;
};

const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

const rectToBox = ({ x, y, width, height }: Rect): Box => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

const boxToRect = ({ x, y, x2, y2 }: Box): Rect => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

export const getBoundsofRects = (rect1: Rect, rect2: Rect): Rect =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

export const getRectOfNodes = (nodes: Node[]): Rect => {
  const box = nodes.reduce(
    (currBox, { __rf: { position, width, height } }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width, height })),
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

export const graphPosToZoomedPos = ({ x, y }: XYPosition, [tx, ty, tScale]: Transform): XYPosition => ({
  x: x * tScale + tx,
  y: y * tScale + ty,
});

export const getNodesInside = (
  nodes: Node[],
  rect: Rect,
  [tx, ty, tScale]: Transform = [0, 0, 1],
  partially: boolean = false
): Node[] => {
  const rBox = rectToBox({
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale,
  });

  return nodes.filter(({ __rf: { position, width, height } }) => {
    const nBox = rectToBox({ ...position, width, height });
    const xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
    const yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
    const overlappingArea = xOverlap * yOverlap;

    if (width === null || height === null) {
      // at the beginnning all nodes have width & height === 0
      return true;
    }

    if (partially) {
      return overlappingArea > 0;
    }

    const area = width * height;

    return overlappingArea >= area;
  });
};

export const getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[] => {
  const nodeIds = nodes.map((n) => n.id);

  return edges.filter((e) => {
    const sourceId = e.source.split('__')[0];
    const targetId = e.target.split('__')[0];

    return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
  });
};

export const fitView = (params: FitViewParams = { padding: 0.1 }): void => {
  store.getActions().fitView(params);
};

const zoom = (amount: number): void => {
  store.getActions().zoom(amount);
};

export const zoomIn = (): void => zoom(0.2);

export const zoomOut = (): void => zoom(-0.2);

const parseElements = (nodes: Node[], edges: Edge[]): Elements => {
  return [
    ...nodes.map((node) => {
      const n = { ...node };

      delete n.__rf;
      return n;
    }),
    ...edges.map((e) => ({ ...e })),
  ];
};

export const onLoadGetElements = (currentStore: Store<StoreModel>) => {
  return (): Elements => {
    const { nodes = [], edges = [] } = currentStore.getState();

    return parseElements(nodes, edges);
  };
};

export const getElements = (): Elements => {
  const { nodes = [], edges = [] } = store.getState();

  return parseElements(nodes, edges);
};

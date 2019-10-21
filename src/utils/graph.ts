import { zoomIdentity } from 'd3-zoom';

import store from '../store';
import {
  ElementId,
  Node,
  Edge,
  Elements,
  Transform,
  XYPosition,
  Rect,
  FitViewParams,
} from '../types';

export const isEdge = (element: Node | Edge): boolean =>
  element.hasOwnProperty('source') && element.hasOwnProperty('target');

export const isNode = (element: Node | Edge): boolean =>
  !element.hasOwnProperty('source') && !element.hasOwnProperty('target');

export const getOutgoers = (node: Node, elements: Elements): Elements => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = (elements as Edge[])
    .filter(e => e.source === node.id)
    .map(e => e.target);
  return elements.filter(e => outgoerIds.includes(e.id));
};

export const removeElements = (
  elementsToRemove: Elements,
  elements: Elements
): Elements => {
  const nodeIdsToRemove = elementsToRemove.map(n => n.id);

  return elements.filter(element => {
    const edgeElement = element as Edge;
    return !(
      nodeIdsToRemove.includes(element.id) ||
      nodeIdsToRemove.includes(edgeElement.target) ||
      nodeIdsToRemove.includes(edgeElement.source)
    );
  });
};

function getEdgeId(edgeParams: Edge): ElementId {
  return `reactflow__edge-${edgeParams.source}-${edgeParams.target}`;
}

export const addEdge = (edgeParams: Edge, elements: Elements): Elements => {
  if (!edgeParams.source || !edgeParams.target) {
    throw new Error('Can not create edge. An edge needs a source and a target');
  }

  return elements.concat({
    ...edgeParams,
    id:
      typeof edgeParams.id !== 'undefined'
        ? edgeParams.id
        : getEdgeId(edgeParams),
  });
};

const pointToRendererPoint = (
  { x, y }: XYPosition,
  transform: Transform
): XYPosition => {
  const rendererX = (x - transform[0]) * (1 / transform[2]);
  const rendererY = (y - transform[1]) * (1 / transform[2]);

  return {
    x: rendererX,
    y: rendererY,
  };
};

export const parseElement = (
  element: Node | Edge,
  transform: Transform = [0, 0, 1]
): Node | Edge => {
  if (!element.id) {
    throw new Error('All elements (nodes and edges) need to have an id.');
  }

  if (isEdge(element)) {
    return {
      ...element,
      id: element.id.toString(),
      type: element.type || 'default',
    };
  }

  const nodeElement = element as Node;

  return {
    ...nodeElement,
    id: nodeElement.id.toString(),
    type: nodeElement.type || 'default',
    __rg: {
      position: pointToRendererPoint(nodeElement.position, transform),
      width: null,
      height: null,
      handleBounds: {},
    },
  };
};

export const getBoundingBox = (nodes: Node[]): Rect => {
  const bbox = nodes.reduce(
    (res, node) => {
      const { position } = node.__rg;
      const x2 = position.x + node.__rg.width;
      const y2 = position.y + node.__rg.height;

      if (position.x < res.minX) {
        res.minX = position.x;
      }

      if (x2 > res.maxX) {
        res.maxX = x2;
      }

      if (position.y < res.minY) {
        res.minY = position.y;
      }

      if (y2 > res.maxY) {
        res.maxY = y2;
      }

      return res;
    },
    {
      minX: Number.MAX_VALUE,
      minY: Number.MAX_VALUE,
      maxX: 0,
      maxY: 0,
    }
  );

  return {
    x: bbox.minX,
    y: bbox.minY,
    width: bbox.maxX - bbox.minX,
    height: bbox.maxY - bbox.minY,
  };
};

export const graphPosToZoomedPos = (
  pos: XYPosition,
  transform: Transform
): XYPosition => {
  return {
    x: pos.x * transform[2] + transform[0],
    y: pos.y * transform[2] + transform[1],
  };
};

export const getNodesInside = (
  nodes: Node[],
  bbox: Rect,
  transform: Transform = [0, 0, 1],
  partially: boolean = false
): Node[] => {
  return nodes.filter(n => {
    const bboxPos = {
      x: (bbox.x - transform[0]) * (1 / transform[2]),
      y: (bbox.y - transform[1]) * (1 / transform[2]),
    };
    const bboxWidth = bbox.width * (1 / transform[2]);
    const bboxHeight = bbox.height * (1 / transform[2]);
    const { position, width, height } = n.__rg;
    const nodeWidth = partially ? -width : width;
    const nodeHeight = partially ? 0 : height;
    const offsetX = partially ? width : 0;
    const offsetY = partially ? height : 0;

    return (
      position.x + offsetX > bboxPos.x &&
      position.x + nodeWidth < bboxPos.x + bboxWidth &&
      (position.y + offsetY > bboxPos.y &&
        position.y + nodeHeight < bboxPos.y + bboxHeight)
    );
  });
};

export const getConnectedEdges = (nodes: Node[], edges: Edge[]): Edge[] => {
  const nodeIds = nodes.map(n => n.id);

  return edges.filter(e => {
    const hasSourceHandleId = e.source.includes('__');
    const hasTargetHandleId = e.target.includes('__');

    const sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
    const targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;

    return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
  });
};

export const fitView = ({ padding }: FitViewParams = { padding: 0 }): void => {
  const state = store.getState();

  if (!state.d3Selection || !state.d3Zoom) {
    return;
  }

  const bounds = getBoundingBox(state.nodes);
  const maxBoundsSize = Math.max(bounds.width, bounds.height);
  const k =
    Math.min(state.width, state.height) /
    (maxBoundsSize + maxBoundsSize * padding);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const transform = [
    state.width / 2 - boundsCenterX * k,
    state.height / 2 - boundsCenterY * k,
  ];
  const fittedTransform = zoomIdentity
    .translate(transform[0], transform[1])
    .scale(k);

  state.d3Selection.call(state.d3Zoom.transform, fittedTransform);
};

export const zoomIn = (): void => {
  const state = store.getState();

  if (!state.d3Zoom || !state.d3Selection) {
    return;
  }

  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] + 0.2);
};

export const zoomOut = (): void => {
  const state = store.getState();

  if (!state.d3Zoom || !state.d3Selection) {
    return;
  }

  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] - 0.2);
};

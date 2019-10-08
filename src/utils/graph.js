import { zoomIdentity } from 'd3-zoom';

import store from '../store';
import { isDefined } from './index';

export const isEdge = element => element.source && element.target;

export const isNode = element => !element.source && !element.target;

export const getOutgoers = (node, elements) => {
  if (!isNode(node)) {
    return [];
  }

  const outgoerIds = elements.filter(e => e.source === node.id).map(e => e.target);
  return elements.filter(e => outgoerIds.includes(e.id));
};

export const removeElements = (elementsToRemove, elements) => {
  const nodeIdsToRemove = elementsToRemove.map(n => n.id);

  return elements.filter(e => {
    return (
      !nodeIdsToRemove.includes(e.id) &&
      !nodeIdsToRemove.includes(e.target) &&
      !nodeIdsToRemove.includes(e.source)
    );
  });
};

function getEdgeId(params) {
  return `reactflow__edge-${params.source}-${params.target}`;
}

export const addEdge = (edgeParams, elements) => {
  if (!edgeParams.source || !edgeParams.target) {
    throw new Error('Can not create edge. An edge needs a source and a target');
  }

  return elements.concat({
    ...edgeParams,
    id: isDefined(edgeParams.id) ? edgeParams.id : getEdgeId(edgeParams)
  });
}

const pointToRendererPoint = ({ x, y }, transform) => {
  const rendererX = (x - transform[0]) * (1 / [transform[2]]);
  const rendererY = (y - transform[1]) * (1 / [transform[2]]);

  return {
    x: rendererX,
    y: rendererY
  };
};

export const parseElement = (e, transform) => {
  if (!e.id) {
    throw new Error('All elements (nodes and edges) need to have an id.',)
  }

  if (isEdge(e)) {
    return {
      ...e,
      id: e.id.toString(),
      type: e.type || 'default'
    };
  }

  return {
    ...e,
    id: e.id.toString(),
    type: e.type || 'default',
    __rg: {
      position: pointToRendererPoint(e.position, transform),
      width: null,
      height: null,
      handleBounds : {}
    }
  };
};

export const getBoundingBox = (nodes) => {
  const bbox = nodes.reduce((res, node) => {
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
  }, {
    minX: Number.MAX_VALUE,
    minY: Number.MAX_VALUE,
    maxX: 0,
    maxY: 0
  });

  return {
    x: bbox.minX,
    y: bbox.minY,
    width: bbox.maxX - bbox.minX,
    height: bbox.maxY - bbox.minY
  };
};

export const graphPosToZoomedPos = (pos, transform) => {
  return {
    x: (pos.x * transform[2]) + transform[0],
    y: (pos.y * transform[2]) + transform[1]
  };
}

export const getNodesInside = (nodes, bbox, transform = [0, 0, 1], partially = false) => {
  return nodes.
    filter(n => {
      const bboxPos = {
        x: (bbox.x - transform[0]) * (1 / transform[2]),
        y: (bbox.y - transform[1]) * (1 / transform[2])
      };
      const bboxWidth = bbox.width * (1 / transform[2]);
      const bboxHeight = bbox.height * (1 / transform[2]);
      const { position, width, height } = n.__rg;
      const nodeWidth = partially ? -width : width;
      const nodeHeight = partially ? 0 : height;
      const offsetX = partially ? width : 0;
      const offsetY = partially ? height : 0;

      return (
        (position.x + offsetX > bboxPos.x && (position.x + nodeWidth) < (bboxPos.x + bboxWidth)) &&
        (position.y + offsetY > bboxPos.y && (position.y + nodeHeight) < (bboxPos.y + bboxHeight))
      );
    });
};

export const getConnectedEdges = (nodes, edges) => {
  const nodeIds = nodes.map(n => n.id);

  return edges.filter(e => {
    const hasSourceHandleId = e.source.includes('__');
    const hasTargetHandleId = e.target.includes('__');

    const sourceId = hasSourceHandleId ? e.source.split('__')[0] : e.source;
    const targetId = hasTargetHandleId ? e.target.split('__')[0] : e.target;

    return nodeIds.includes(sourceId) || nodeIds.includes(targetId);
  });
};

export const fitView = ({ padding = 0 } = {}) => {
  const state = store.getState();
  const bounds = getBoundingBox(state.nodes);
  const maxBoundsSize = Math.max(bounds.width, bounds.height);
  const k = Math.min(state.width, state.height) / (maxBoundsSize + (maxBoundsSize * padding));
  const boundsCenterX = bounds.x + (bounds.width / 2);
  const boundsCenterY = bounds.y + (bounds.height / 2);
  const transform = [(state.width / 2) - (boundsCenterX * k), (state.height / 2) - (boundsCenterY * k)];
  const fittedTransform = zoomIdentity.translate(transform[0], transform[1]).scale(k);

  state.d3Selection.call(state.d3Zoom.transform, fittedTransform);
};

export const zoomIn = () => {
  const state = store.getState();
  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] + 0.2);
};

export const zoomOut = () => {
  const state = store.getState();
  state.d3Zoom.scaleTo(state.d3Selection, state.transform[2] - 0.2);
};

export default {
  isEdge,
  getBoundingBox,
  graphPosToZoomedPos,
  getConnectedEdges,
  parseElement,
  fitView,
  zoomIn,
  zoomOut
};

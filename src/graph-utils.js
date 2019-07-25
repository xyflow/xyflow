export const isEdge = element => element.source && element.target;

export const isNode = element => !element.source && !element.target;

export const removeElements = (elements, elementsToRemove) => {
  const nodeIdsToRemove = elementsToRemove.filter(isNode).map(n => n.id);

  return elements.filter(e => {
    return (
      !nodeIdsToRemove.includes(e.id) &&
      !nodeIdsToRemove.includes(e.target) &&
      !nodeIdsToRemove.includes(e.source)
    );
  });
}

export const parseElements = e => {
  e.type = e.type || 'default';

  if (isEdge(e)) {
    return e;
  }

  return {
    ...e,
    __rg: {
      position: e.position,
      width: null,
      height: null
    }
  }
};

export const separateElements = (res, element) => {
  res.edges = res.edges ? res.edges : [];
  res.nodes = res.nodes ? res.nodes : [];

  if (isEdge(element)) {
    res.edges.push(element);
  } else {
    res.nodes.push(element);
  }

  return res;
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

export const getNodesInside = (nodes, bbox, transform = [0, 0, 1]) => {
  return nodes.
    filter(n => {
      const bboxPos = {
        x: (bbox.x - transform[0]) * (1 / transform[2]),
        y: (bbox.y - transform[1]) * (1 / transform[2])
      };
      const bboxWidth = bbox.width * (1 / transform[2]);
      const bboxHeight = bbox.height * (1 / transform[2]);
      const { position, width, height } = n.__rg;

      return (
        (position.x > bboxPos.x && (position.x + width) < (bboxPos.x + bboxWidth)) &&
        (position.y > bboxPos.y && (position.y + height) < (bboxPos.y + bboxHeight))
      );
    });
};

export const getConnectedEdges = (nodes, edges) => {
  const nodeIds = nodes.map(n => n.id);
  return edges.filter(e => nodeIds.includes(e.source) || nodeIds.includes(e.target))
}

export default {
  isEdge,
  separateElements,
  getBoundingBox,
  graphPosToZoomedPos,
  getConnectedEdges
};

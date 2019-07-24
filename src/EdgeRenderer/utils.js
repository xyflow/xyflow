import DefaultEdge from './EdgeTypes/DefaultEdge';
import wrapEdge from './EdgeTypes/wrapEdge';

export function createEdgeTypes(edgeTypes) {
  const standardTypes = {
    default: wrapEdge(edgeTypes.default || DefaultEdge),
  };

  const specialTypes = Object
    .keys(DefaultEdge)
    .filter(k => !['default'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge(nodeTypes[key] || DefaultEdge);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}

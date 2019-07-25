import DefaultEdge from './EdgeTypes/DefaultEdge';
import BezierEdge from './EdgeTypes/BezierEdge';
import wrapEdge from './EdgeTypes/wrapEdge';

export function createEdgeTypes(edgeTypes) {
  const standardTypes = {
    default: wrapEdge(edgeTypes.default || DefaultEdge),
    bezier: wrapEdge(edgeTypes.bezier || BezierEdge)
  };

  const specialTypes = Object
    .keys(DefaultEdge)
    .filter(k => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge(nodeTypes[key] || DefaultEdge);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}

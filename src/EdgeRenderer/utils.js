import StraightEdge from './EdgeTypes/StraightEdge';
import BezierEdge from './EdgeTypes/BezierEdge';
import wrapEdge from './EdgeTypes/wrapEdge';

export function createEdgeTypes(edgeTypes) {
  const standardTypes = {
    default: wrapEdge(edgeTypes.default || BezierEdge),
    straight: wrapEdge(edgeTypes.bezier || StraightEdge)
  };

  const specialTypes = Object
    .keys(edgeTypes)
    .filter(k => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge(edgeTypes[key] ||BezierEdge);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}

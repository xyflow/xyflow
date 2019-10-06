import StraightEdge from '../../components/Edges/StraightEdge';
import BezierEdge from '../../components/Edges/BezierEdge';
import wrapEdge from '../../components/Edges/wrapEdge';

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

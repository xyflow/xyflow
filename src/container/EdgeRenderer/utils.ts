import StraightEdge from '../../components/Edges/StraightEdge';
import BezierEdge from '../../components/Edges/BezierEdge';
import wrapEdge from '../../components/Edges/wrapEdge';

import { EdgeTypesType } from '../../types';

export function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType{
  const standardTypes: EdgeTypesType = {
    default: wrapEdge(edgeTypes.default || BezierEdge),
    straight: wrapEdge(edgeTypes.bezier || StraightEdge)
  };

  const specialTypes: EdgeTypesType = Object
    .keys(edgeTypes)
    .filter(k => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge(edgeTypes[key] || BezierEdge);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}

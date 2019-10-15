import { ComponentType } from 'react';

import StraightEdge from '../../components/Edges/StraightEdge';
import BezierEdge from '../../components/Edges/BezierEdge';
import wrapEdge from '../../components/Edges/wrapEdge';

import { EdgeTypesType, EdgeWrapperProps } from '../../types';

export function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType{
  const standardTypes: EdgeTypesType = {
    default: wrapEdge((edgeTypes.default || BezierEdge) as ComponentType<EdgeWrapperProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdge) as ComponentType<EdgeWrapperProps>)
  };

  const specialTypes: EdgeTypesType = Object
    .keys(edgeTypes)
    .filter(k => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge((edgeTypes[key] || BezierEdge) as ComponentType<EdgeWrapperProps>);

      return res;
    }, {});

  return {
    ...standardTypes,
    ...specialTypes
  };
}

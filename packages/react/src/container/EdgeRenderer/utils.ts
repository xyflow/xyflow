import type { ComponentType } from 'react';

import {
  BezierEdgeInternal,
  SmoothStepEdgeInternal,
  StepEdgeInternal,
  StraightEdgeInternal,
  SimpleBezierEdgeInternal,
} from '../../components/Edges';
import wrapEdge from '../../components/Edges/wrapEdge';
import type { EdgeProps, EdgeTypes, EdgeTypesWrapped } from '../../types';

export type CreateEdgeTypes = (edgeTypes: EdgeTypes) => EdgeTypesWrapped;

export function createEdgeTypes(edgeTypes: EdgeTypes): EdgeTypesWrapped {
  const standardTypes: EdgeTypesWrapped = {
    default: wrapEdge((edgeTypes.default || BezierEdgeInternal) as ComponentType<EdgeProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdgeInternal) as ComponentType<EdgeProps>),
    step: wrapEdge((edgeTypes.step || StepEdgeInternal) as ComponentType<EdgeProps>),
    smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdgeInternal) as ComponentType<EdgeProps>),
    simplebezier: wrapEdge((edgeTypes.simplebezier || SimpleBezierEdgeInternal) as ComponentType<EdgeProps>),
  };

  const wrappedTypes = {} as EdgeTypesWrapped;
  const specialTypes: EdgeTypesWrapped = Object.keys(edgeTypes)
    .filter((k) => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge((edgeTypes[key] || BezierEdgeInternal) as ComponentType<EdgeProps>);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}

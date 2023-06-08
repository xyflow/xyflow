import type { ComponentType } from 'react';

import { BezierEdge, SmoothStepEdge, StepEdge, StraightEdge, SimpleBezierEdge } from '../../components/Edges';
import wrapEdge from '../../components/Edges/wrapEdge';
import type { EdgeProps, EdgeTypes, EdgeTypesWrapped } from '../../types';

export type CreateEdgeTypes = (edgeTypes: EdgeTypes) => EdgeTypesWrapped;

export function createEdgeTypes(edgeTypes: EdgeTypes): EdgeTypesWrapped {
  const standardTypes: EdgeTypesWrapped = {
    default: wrapEdge((edgeTypes.default || BezierEdge) as ComponentType<EdgeProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdge) as ComponentType<EdgeProps>),
    step: wrapEdge((edgeTypes.step || StepEdge) as ComponentType<EdgeProps>),
    smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge) as ComponentType<EdgeProps>),
    simplebezier: wrapEdge((edgeTypes.simplebezier || SimpleBezierEdge) as ComponentType<EdgeProps>),
  };

  const wrappedTypes = {} as EdgeTypesWrapped;
  const specialTypes: EdgeTypesWrapped = Object.keys(edgeTypes)
    .filter((k) => !['default', 'bezier'].includes(k))
    .reduce((res, key) => {
      res[key] = wrapEdge((edgeTypes[key] || BezierEdge) as ComponentType<EdgeProps>);

      return res;
    }, wrappedTypes);

  return {
    ...standardTypes,
    ...specialTypes,
  };
}

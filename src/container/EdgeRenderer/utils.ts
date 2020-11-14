import { ComponentType } from 'react';

import { BezierEdge, StepEdge, SmoothStepEdge, StraightEdge } from '../../components/Edges';
import wrapEdge from '../../components/Edges/wrapEdge';

import { EdgeTypesType, EdgeProps, Position, Node, XYPosition, ElementId, HandleElement } from '../../types';

export function createEdgeTypes(edgeTypes: EdgeTypesType): EdgeTypesType {
  const standardTypes: EdgeTypesType = {
    default: wrapEdge((edgeTypes.default || BezierEdge) as ComponentType<EdgeProps>),
    straight: wrapEdge((edgeTypes.bezier || StraightEdge) as ComponentType<EdgeProps>),
    step: wrapEdge((edgeTypes.step || StepEdge) as ComponentType<EdgeProps>),
    smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge) as ComponentType<EdgeProps>),
  };

  const wrappedTypes = {} as EdgeTypesType;
  const specialTypes: EdgeTypesType = Object.keys(edgeTypes)
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

export function getHandlePosition(position: Position, node: Node, handle: any | null = null): XYPosition {
  const x = handle?.x || 0;
  const y = handle?.y || 0;
  const width = handle?.width || node.__rf.width;
  const height = handle?.height || node.__rf.height;

  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y,
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2,
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height,
      };
    case Position.Left:
      return {
        x,
        y: y + height / 2,
      };
  }
}

export function getHandle(bounds: HandleElement[], handleId: ElementId | null): HandleElement | null {
  if (!bounds) {
    return null;
  }

  let handle = null;

  // there is no handleId when there are no multiple handles/ handles with ids
  // so we just pick the first one
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find((d) => d.id === handleId);
  }

  if (typeof handle === 'undefined') {
    return null;
  }

  return handle;
}

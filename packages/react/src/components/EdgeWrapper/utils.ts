import type { ComponentType } from 'react';
import type { EdgeProps, EdgeTypes } from '../../types';
import {
  BezierEdgeInternal,
  StraightEdgeInternal,
  StepEdgeInternal,
  SmoothStepEdgeInternal,
  SimpleBezierEdgeInternal,
} from '../Edges';

export const builtinEdgeTypes: EdgeTypes = {
  default: BezierEdgeInternal as ComponentType<EdgeProps>,
  straight: StraightEdgeInternal as ComponentType<EdgeProps>,
  step: StepEdgeInternal as ComponentType<EdgeProps>,
  smoothstep: SmoothStepEdgeInternal as ComponentType<EdgeProps>,
  simplebezier: SimpleBezierEdgeInternal as ComponentType<EdgeProps>,
};

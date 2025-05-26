import type { DefaultEdgeTypes, DefaultNodeTypes } from '../types';

import BezierEdge from '../components/Edges/BezierEdge';
import SimpleBezierEdge from '../components/Edges/SimpleBezierEdge';
import SmoothStepEdge from '../components/Edges/SmoothStepEdge';
import StepEdge from '../components/Edges/StepEdge';
import StraightEdge from '../components/Edges/StraightEdge';
import DefaultNode from '../components/Nodes/DefaultNode';
import InputNode from '../components/Nodes/InputNode';
import OutputNode from '../components/Nodes/OutputNode';

export const defaultNodeTypes: DefaultNodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
};

export const defaultEdgeTypes: DefaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  simplebezier: SimpleBezierEdge,
};

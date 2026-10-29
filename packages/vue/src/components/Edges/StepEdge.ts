import type { StepEdgeProps } from '../../types';
import { defineComponent, h } from 'vue';
import SmoothStepEdge from './SmoothStepEdge';

const StepEdge = defineComponent<StepEdgeProps>({
  name: 'StepEdge',
  // see StraightEdge: keep undeclared attrs from auto-applying to the SmoothStepEdge root
  inheritAttrs: false,
  props: [
    'sourcePosition',
    'targetPosition',
    'label',
    'labelStyle',
    'labelShowBg',
    'labelBgStyle',
    'labelBgPadding',
    'labelBgBorderRadius',
    'sourceY',
    'sourceX',
    'targetX',
    'targetY',
    'markerEnd',
    'markerStart',
    'interactionWidth',
  ],
  setup(props, { attrs }) {
    return () => h(SmoothStepEdge, { ...props, ...attrs, borderRadius: 0 });
  },
});

export default StepEdge;

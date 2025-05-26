import type { StraightEdgeProps } from '../../types';
import { getStraightPath } from '@xyflow/system';
import { defineComponent, h } from 'vue';
import BaseEdge from './BaseEdge.vue';
import { baseEdgeProps } from './utils';

const StraightEdge = defineComponent<StraightEdgeProps>({
  name: 'StraightEdge',
  // attrs (the EdgeProps the component doesn't declare: source/target/selected/…) must not auto-apply to
  // the BaseEdge root and leak onto the <path>; genuine style/class are forwarded via `baseEdgeProps`
  inheritAttrs: false,
  props: [
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
  compatConfig: { MODE: 3 },
  setup(props, { attrs }) {
    return () => {
      const [path, labelX, labelY] = getStraightPath(props);

      return h(BaseEdge, { path, labelX, labelY, ...baseEdgeProps(props, attrs) });
    };
  },
});

export default StraightEdge;

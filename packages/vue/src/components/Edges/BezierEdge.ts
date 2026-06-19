import type { BezierEdgeProps } from '../../types';
import { getBezierPath, Position } from '@xyflow/system';
import { defineComponent, h } from 'vue';
import BaseEdge from './BaseEdge.vue';
import { baseEdgeProps } from './utils';

const BezierEdge = defineComponent<BezierEdgeProps>({
  name: 'BezierEdge',
  // see StraightEdge: keep undeclared attrs (source/target/…) from leaking onto the <path>
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
    'curvature',
    'markerEnd',
    'markerStart',
    'interactionWidth',
  ],
  compatConfig: { MODE: 3 },
  setup(props, { attrs }) {
    return () => {
      const [path, labelX, labelY] = getBezierPath({
        ...props,
        sourcePosition: props.sourcePosition ?? Position.Bottom,
        targetPosition: props.targetPosition ?? Position.Top,
      });

      return h(BaseEdge, { path, labelX, labelY, ...baseEdgeProps(props, attrs) });
    };
  },
});

export default BezierEdge;

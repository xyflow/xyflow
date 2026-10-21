import type { BezierEdgeProps } from '../../types';
import { getBezierPath, Position } from '@xyflow/system';
import { defineComponent } from 'vue';
import { baseEdgeProps, renderBaseEdge } from './utils';

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
    let prevBaseProps: Record<string, unknown> | null = null;

    return () => {
      const [path, labelX, labelY] = getBezierPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
        sourcePosition: props.sourcePosition ?? Position.Bottom,
        targetPosition: props.targetPosition ?? Position.Top,
        curvature: props.curvature,
      });

      const baseProps = { path, labelX, labelY, ...baseEdgeProps(props, attrs) };

      const vnode = renderBaseEdge(baseProps, prevBaseProps);
      prevBaseProps = baseProps;

      return vnode;
    };
  },
});

export default BezierEdge;

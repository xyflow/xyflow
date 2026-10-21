import type { SmoothStepEdgeProps } from '../../types';
import { getSmoothStepPath, Position } from '@xyflow/system';
import { defineComponent } from 'vue';
import { baseEdgeProps, renderBaseEdge } from './utils';

const SmoothStepEdge = defineComponent<SmoothStepEdgeProps>({
  name: 'SmoothStepEdge',
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
    'borderRadius',
    'markerEnd',
    'markerStart',
    'interactionWidth',
    'offset',
    'stepPosition',
  ],
  compatConfig: { MODE: 3 },
  setup(props, { attrs }) {
    let prevBaseProps: Record<string, unknown> | null = null;

    return () => {
      const [path, labelX, labelY] = getSmoothStepPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
        sourcePosition: props.sourcePosition ?? Position.Bottom,
        targetPosition: props.targetPosition ?? Position.Top,
        borderRadius: props.borderRadius,
        offset: props.offset,
        stepPosition: props.stepPosition,
      });

      const baseProps = { path, labelX, labelY, ...baseEdgeProps(props, attrs) };

      const vnode = renderBaseEdge(baseProps, prevBaseProps);
      prevBaseProps = baseProps;

      return vnode;
    };
  },
});

export default SmoothStepEdge;

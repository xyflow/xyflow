import type { StraightEdgeProps } from '../../types';
import { getStraightPath } from '@xyflow/system';
import { defineComponent } from 'vue';
import { baseEdgeProps, renderBaseEdge } from './utils';

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
    let prevBaseProps: Record<string, unknown> | null = null;

    return () => {
      const [path, labelX, labelY] = getStraightPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
      });

      const baseProps = { path, labelX, labelY, ...baseEdgeProps(props, attrs) };

      const vnode = renderBaseEdge(baseProps, prevBaseProps);
      prevBaseProps = baseProps;

      return vnode;
    };
  },
});

export default StraightEdge;

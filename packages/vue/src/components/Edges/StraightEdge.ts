import type { StraightEdgeProps } from '../../types';
import { getStraightPath } from '@xyflow/system';
import { defineComponent } from 'vue';
import { baseEdgeProps, createBaseEdgeRenderer } from './utils';

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
    const renderBaseEdge = createBaseEdgeRenderer();

    return () => {
      const [path, labelX, labelY] = getStraightPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
      });

      return renderBaseEdge({ path, labelX, labelY, ...baseEdgeProps(props, attrs) });
    };
  },
});

export default StraightEdge;

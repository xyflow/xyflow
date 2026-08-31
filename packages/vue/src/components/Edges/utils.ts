import type { CSSProperties } from 'vue';

/**
 * Pick only the props `BaseEdge` renders (label/marker/interaction) plus `style`/`class` fallthrough.
 */
export function baseEdgeProps(props: Record<string, any>, attrs: Record<string, any>) {
  return {
    label: props.label,
    labelStyle: props.labelStyle,
    labelShowBg: props.labelShowBg,
    labelBgStyle: props.labelBgStyle,
    labelBgPadding: props.labelBgPadding,
    labelBgBorderRadius: props.labelBgBorderRadius,
    markerStart: props.markerStart,
    markerEnd: props.markerEnd,
    interactionWidth: props.interactionWidth,
    style: attrs.style as CSSProperties | undefined,
    class: attrs.class,
  };
}

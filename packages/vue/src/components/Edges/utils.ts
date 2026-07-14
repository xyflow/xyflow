import type { CSSProperties } from 'vue';

/**
 * Pick only the props `BaseEdge` renders (label/marker/interaction) plus `style`/`class` fallthrough.
 * Built-in edges receive the full `EdgeProps` surface; forwarding `{ ...attrs, ...props }` wholesale
 * leaked geometry/identity onto the `<path>` (and re-wrote sourceX/sourceY/... every drag frame).
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

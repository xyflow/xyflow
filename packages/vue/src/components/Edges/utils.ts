import type { CSSProperties } from 'vue';

/**
 * The props `BaseEdge` actually renders (label/marker/interaction) plus genuine `style`/`class`
 * fallthrough. The built-in edge components receive the full `EdgeProps` surface (geometry like
 * `sourceX`/`sourceY` + identity like `source`/`type`/`selected`); the geometry is consumed to COMPUTE
 * the path and the identity isn't BaseEdge's concern, so forwarding `{ ...attrs, ...props }` wholesale
 * leaked all of it onto the `<path>` via BaseEdge's `v-bind="$attrs"` (and re-wrote the changing
 * `sourceX`/`sourceY`/`targetX`/`targetY` attrs every drag frame). Pick only what BaseEdge needs.
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

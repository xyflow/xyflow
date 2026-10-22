import type { Component, CSSProperties } from 'vue';
import { createChangedPropsRenderer } from '../../utils/vnode';
import BaseEdge from './BaseEdge.vue';

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

/** A {@link createChangedPropsRenderer} bound to `BaseEdge`, for the built-in edge types. */
export function createBaseEdgeRenderer() {
  const render = createChangedPropsRenderer();

  return (baseProps: Record<string, any>) => render(BaseEdge as Component, baseProps);
}

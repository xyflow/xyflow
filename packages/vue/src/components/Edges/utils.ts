import type { Component, CSSProperties, VNode } from 'vue';
import { h } from 'vue';
import { markChangedProps } from '../../utils';
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

/**
 * Render `BaseEdge` for a built-in edge type, tagging the vnode with the props that changed so
 * Vue's props fast path applies here too. A drag frame changes `path`/`labelX`/`labelY` and leaves
 * the label and marker props alone.
 */
export function renderBaseEdge(baseProps: Record<string, any>, prev: Record<string, unknown> | null): VNode {
  const vnode = h(BaseEdge as Component, baseProps);

  markChangedProps(vnode, baseProps, prev);

  return vnode;
}

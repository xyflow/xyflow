import type { Node, Edge } from '@xyflow/react';
import type { Node as SvelteNode, Edge as SvelteEdge } from '@xyflow/svelte';

function styleObjectToCss(style?: Record<string, any>): string | undefined {
  if (!style) return undefined;
  return Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());
      const cssValue = typeof value === 'number' && key !== 'opacity' ? `${value}px` : value;
      return `${cssKey}:${cssValue};`;
    })
    .join('');
}

export function reactToSvelteNodes(nodes: Node[]): SvelteNode[] {
  return nodes.map((node) => {
    const { className, style, domAttributes, ...rest } = node;

    return {
      ...rest,
      class: className,
      style: styleObjectToCss(style),
      domAttributes: undefined,
    };
  });
}

export function reactToSvelteEdges(edges: Edge[]): SvelteEdge[] {
  return edges.map((edge) => {
    const { className, style, domAttributes, reconnectable, ...rest } = edge;

    return {
      ...rest,
      class: className,
      style: styleObjectToCss(style),
      domAttributes: undefined,
      label: undefined,
      labelStyle: styleObjectToCss(edge.labelStyle),
    };
  });
}

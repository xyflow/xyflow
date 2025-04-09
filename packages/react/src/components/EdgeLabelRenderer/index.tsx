import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.domNode?.querySelector('.react-flow__edgelabel-renderer');

export type EdgeLabelRendererProps = {
  children: ReactNode
}

/**
 * Edges are SVG-based. If you want to render more complex labels you can use the
 * `<EdgeLabelRenderer />` component to access a div based renderer. This component
 * is a portal that renders the label in a `<div />` that is positioned on top of
 * the edges. You can see an example usage of the component in the
 * [edge label renderer example](/examples/edges/edge-label-renderer).
 * @public
 *
 * @example
 * ```jsx
 * import React from 'react';
 * import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
 *
 * export function CustomEdge({ id, data, ...props }) {
 *   const [edgePath, labelX, labelY] = getBezierPath(props);
 *
 *   return (
 *     <>
 *       <BaseEdge id={id} path={edgePath} />
 *       <EdgeLabelRenderer>
 *         <div
 *           style={{
 *             position: 'absolute',
 *             transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
 *             background: '#ffcc00',
 *             padding: 10,
 *         }}
 *           className="nodrag nopan"
 *         >
 *          {data.label}
 *         </div>
 *       </EdgeLabelRenderer>
 *     </>
 *   );
 * };
 * ```
 *
 * @remarks The `<EdgeLabelRenderer />` has no pointer events by default. If you want to
 * add mouse interactions you need to set the style `pointerEvents: all` and add
 * the `nopan` class on the label or the element you want to interact with.
 */
export function EdgeLabelRenderer({ children }: EdgeLabelRendererProps) {
  const edgeLabelRenderer = useStore(selector);

  if (!edgeLabelRenderer) {
    return null;
  }

  return createPortal(children, edgeLabelRenderer);
}

import cc from 'classcat';
import { getEdgeToolbarTransform, getElevatedEdgeZIndex } from '@xyflow/system';

import { EdgeLabelRenderer } from '../../components/EdgeLabelRenderer';
import { useOptionsStore, useViewportStore } from '../../hooks/useReactFlowStore';
import { useEdge } from '../../hooks/useEdges';
import { useInternalNode } from '../../hooks/useNodes';
import type { Edge } from '../../types';
import type { EdgeToolbarProps } from './types';

/**
 * This component can render a toolbar or tooltip to one side of a custom edge. This
 * toolbar doesn't scale with the viewport so that the content stays the same size.
 *
 * @public
 * @example
 * ```jsx
 * import { EdgeToolbar, BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";
 *
 * export function CustomEdge({ id, data, ...props }: EdgeProps) {
 *   const [edgePath, centerX, centerY] = getBezierPath(props);
 *
 *   return (
 *     <>
 *       <BaseEdge id={id} path={edgePath} />
 *       <EdgeToolbar edgeId={id} x={centerX} y={centerY} isVisible>
 *         <button onClick={() => console.log('edge', id, 'click')}>Click me</button>
 *       </EdgeToolbar>
 *     </>
 *   );
 * }
 * ```
 */
export function EdgeToolbar({ edgeId, isVisible, ...rest }: EdgeToolbarProps) {
  const edge = useEdge(edgeId);
  const isActive = typeof isVisible === 'boolean' ? isVisible : edge?.selected;

  if (!isActive || !edge) {
    return null;
  }

  return <EdgeToolbarInner edge={edge} {...rest} />;
}

type EdgeToolbarInnerProps = Omit<EdgeToolbarProps, 'edgeId' | 'isVisible'> & {
  edge: Edge;
};

/*
 * Only mounted while the toolbar is visible, so hidden toolbars don't subscribe
 * to the viewport or to the source/target nodes.
 */
function EdgeToolbarInner({
  edge,
  x,
  y,
  children,
  className,
  style,
  alignX = 'center',
  alignY = 'center',
  ...rest
}: EdgeToolbarInnerProps) {
  const zoom = useViewportStore((s) => s.transform[2]);
  const elevateEdgesOnSelect = useOptionsStore((s) => s.elevateEdgesOnSelect);
  const zIndexMode = useOptionsStore((s) => s.zIndexMode);
  const sourceNode = useInternalNode(edge.source);
  const targetNode = useInternalNode(edge.target);

  // same z-index as the edge (incl. elevation on select and parent nodes).
  // The label renderer comes after the edges in the DOM, so the toolbar is drawn above
  // its edge, and nodes on the same level stay above the toolbar.
  const zIndex =
    sourceNode && targetNode
      ? getElevatedEdgeZIndex({
          selected: edge.selected,
          zIndex: edge.zIndex,
          sourceNode,
          targetNode,
          elevateOnSelect: elevateEdgesOnSelect,
          zIndexMode,
        })
      : (edge.zIndex ?? 0);

  const transform = getEdgeToolbarTransform(x, y, zoom, alignX, alignY);

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform,
          zIndex,
          pointerEvents: 'all',
          transformOrigin: '0 0',
          ...style,
        }}
        className={cc(['react-flow__edge-toolbar', className])}
        data-id={edge.id}
        {...rest}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

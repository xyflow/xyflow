import { getEdgeToolbarTransform, Position } from '@xyflow/system';
import cc from 'classcat';
import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { EdgeLabelRenderer } from '../../components/EdgeLabelRenderer';
import { useStore } from '../../hooks/useStore';
import { Edge, ReactFlowState } from '../../types';
import type { EdgeToolbarProps } from './types';

const storeSelector = (state: ReactFlowState) => ({
  zoom: state.transform[2],
});

/**
 * This component can render a toolbar or tooltip to one side of a custom edge. This
 * toolbar doesn't scale with the viewport so that the content is always visible.
 *
 * @public
 * @example
 * ```jsx
 * import { EdgeToolbar } from "@xyflow/react";
 *
 * export function CustomEdge({ id, data, ...props }: EdgeProps) {
 *   const [edgePath, labelX, labelY] = getBezierPath(props);
 *
 *   return (
 *     <>
 *       <BaseEdge id={id} path={edgePath} />
 *       <EdgeToolbar edgeId={id} x={labelX} y={labelY} isVisible>
 *         <button onClick={() => {}}>Click me</button>
 *       </EdgeToolbar>
 *     </>
 *   );
 * }
 * ```
 */
export function EdgeToolbar({
  edgeId,
  x,
  y,
  children,
  className,
  style,
  isVisible,
  position = Position.Top,
  offsetX = 0,
  offsetY = 0,
  align = 'center',
  ...rest
}: EdgeToolbarProps) {
  const edgeSelector = useCallback(
    (state: ReactFlowState): Edge | undefined => {
      const edge = state.edgeLookup.get(edgeId || '');
      if (edge) {
        return edge;
      }

      return undefined;
    },
    [edgeId]
  );

  const edge = useStore(edgeSelector);

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  const isActive = typeof isVisible === 'boolean' ? isVisible : edge?.selected;

  if (!isActive || !edge) {
    return null;
  }

  const zIndex = edge.zIndex ?? 0 + 1;

  const { zoom } = useStore(storeSelector, shallow);

  const transform = getEdgeToolbarTransform(x, y, zoom, offsetX, offsetY);
  console.log('transform', transform);
  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    // TODO: offset
    transform,
    zIndex,
    ...style,
  };

  console.log('wrapperStyle', wrapperStyle);

  return (
    <EdgeLabelRenderer>
      <div
        style={{ ...wrapperStyle, pointerEvents: 'all' }}
        className={cc(['react-flow__edge-toolbar', className])}
        {...rest}
        // @todo: check if we could only do this for non-prod envs
        data-id={`${edge.id} `}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

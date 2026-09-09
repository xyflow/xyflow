import { shallow } from 'zustand/shallow';
import { useCallback } from 'react';
import cc from 'classcat';
import { getEdgeToolbarTransform } from '@xyflow/system';

import { EdgeLabelRenderer } from '../../components/EdgeLabelRenderer';
import { useReactFlowStore } from '../../hooks/useReactFlowStore';
import { Edge, ReactFlowSelectorState } from '../../types';
import type { EdgeToolbarProps } from './types';

const zoomSelector = (state: ReactFlowSelectorState) => state.transform[2];

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
 *         <button onClick={() => console.log('edge', id, 'click')}}>Click me</button>
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
  alignX = 'center',
  alignY = 'center',
  ...rest
}: EdgeToolbarProps) {
  const edgeSelector = useCallback(
    (state: ReactFlowSelectorState): Edge | undefined => state.getEdgeById(edgeId),
    [edgeId]
  );
  const edge = useReactFlowStore(edgeSelector, shallow);
  const isActive = typeof isVisible === 'boolean' ? isVisible : edge?.selected;
  const zoom = useReactFlowStore(zoomSelector);

  if (!isActive) {
    return null;
  }

  const zIndex = (edge?.zIndex ?? 0) + 1;
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
        data-id={edge?.id ?? ''}
        {...rest}
      >
        {children}
      </div>
    </EdgeLabelRenderer>
  );
}

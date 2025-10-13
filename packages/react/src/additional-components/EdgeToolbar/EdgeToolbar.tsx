import { getEdgeToolbarTransform, Position } from '@xyflow/system';
import cc from 'classcat';
import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { EdgeLabelRenderer } from '../../components/EdgeLabelRenderer';
import { useStore } from '../../hooks/useStore';
import { Edge, ReactFlowState } from '../../types';
import type { EdgeToolbarProps } from './types';

const storeSelector = (state: ReactFlowState) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2],
});

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
  console.log('edge', edge, edgeId);

  const { x, y, zoom } = useStore(storeSelector, shallow);

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  const isActive = typeof isVisible === 'boolean' ? isVisible : edge?.selected;

  if (!isActive || !edge) {
    return null;
  }

  // TODO: how to get the bounds of an edge?
  // const edgeRect = getInternalEdgesBounds(edge.source, edge.target);
  // TODO: how to get the z-index of an edge?
  const zIndex = edge.zIndex ?? 0 + 1;

  const transform = getEdgeToolbarTransform(x, y, { x, y, zoom }, 120, offsetY);
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

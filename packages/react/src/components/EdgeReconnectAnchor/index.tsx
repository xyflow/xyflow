import { useContext, type HTMLAttributes } from 'react';
import cc from 'classcat';
import type { HandleType, XYPosition } from '@xyflow/system';

import { EdgeReconnectContext } from '../../contexts/EdgeReconnectContext';
import { EdgeLabelRenderer } from '../EdgeLabelRenderer';

export type EdgeReconnectAnchorProps = HTMLAttributes<HTMLDivElement> & {
  /** The endpoint to replace when dragging the anchor. */
  type: HandleType;
  /** The center of the anchor in flow coordinates. */
  position: XYPosition;
  /** Width and height of the anchor in flow units. */
  size?: number;
  /** Drag distance before reconnection starts. Defaults to the flow's connectionDragThreshold. */
  dragThreshold?: number;
};

/**
 * Renders a draggable reconnection anchor at a custom position within a custom edge.
 * The edge must be reconnectable on the given side and the flow must provide onReconnect.
 * @public
 */
export function EdgeReconnectAnchor({
  type,
  position,
  size = 25,
  dragThreshold,
  className,
  style,
  onMouseDown,
  ...props
}: EdgeReconnectAnchorProps) {
  const context = useContext(EdgeReconnectContext);

  if (!context) {
    throw new Error('EdgeReconnectAnchor must be used within a custom edge component');
  }

  if (context.isReconnectable !== true && context.isReconnectable !== type) {
    return null;
  }

  return (
    <EdgeLabelRenderer>
      <div
        {...props}
        className={cc([
          'react-flow__edgeupdater',
          `react-flow__edgeupdater-${type}`,
          context.noPanClassName,
          className,
        ])}
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
          width: size,
          height: size,
          pointerEvents: 'auto',
          ...style,
        }}
        onMouseDown={(event) => {
          onMouseDown?.(event);
          if (!event.defaultPrevented) {
            context.startReconnect(event, type, dragThreshold);
          }
        }}
      />
    </EdgeLabelRenderer>
  );
}

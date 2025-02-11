import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

/**
 * The `<Panel />` component helps you position content above the viewport. It is
 *used internally by the [`<MiniMap />`](/api-reference/components/minimap) and [`<Controls />`](/api-reference/components/controls)
 *components.
 *
 * @public
 *
 * @example
 * ```jsx
 *import { ReactFlow, Background, Panel } from '@xyflow/react';
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[]} fitView>
 *      <Panel position="top-left">top-left</Panel>
 *      <Panel position="top-center">top-center</Panel>
 *      <Panel position="top-right">top-right</Panel>
 *      <Panel position="bottom-left">bottom-left</Panel>
 *      <Panel position="bottom-center">bottom-center</Panel>
 *      <Panel position="bottom-right">bottom-right</Panel>
 *    </ReactFlow>
 *  );
 *}
 *```
 */
export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The position of the panel
   */
  position?: PanelPosition;
  children: ReactNode;
};

const selector = (s: ReactFlowState) => (s.userSelectionActive ? 'none' : 'all');

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ position = 'top-left', children, className, style, ...rest }, ref) => {
    const pointerEvents = useStore(selector);
    const positionClasses = `${position}`.split('-');

    return (
      <div
        className={cc(['react-flow__panel', className, ...positionClasses])}
        style={{ ...style, pointerEvents }}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';

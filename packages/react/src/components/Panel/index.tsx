import { HTMLAttributes, forwardRef } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

/**
 * @expand
 */
export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * The position of the panel.
   * @default "top-left"
   */
  position?: PanelPosition;
};

/**
 * The `<Panel />` component helps you position content above the viewport.
 * It is used internally by the [`<MiniMap />`](/api-reference/components/minimap)
 * and [`<Controls />`](/api-reference/components/controls) components.
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
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ position = 'top-left', children, className, style, ...rest }, ref) => {
    const positionClasses = `${position}`.split('-');

    return (
      <div className={cc(['react-flow__panel', className, ...positionClasses])} style={style} ref={ref} {...rest}>
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';

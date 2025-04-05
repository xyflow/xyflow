import { shallow } from 'zustand/shallow';
import type { Viewport } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import type { ReactFlowState } from '../types';

const viewportSelector = (state: ReactFlowState) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2],
});

/**
 * The `useViewport` hook is a convenient way to read the current state of the
 * {@link Viewport} in a component. Components that use this hook
 * will re-render **whenever the viewport changes**.
 *
 * @public
 * @returns The current viewport.
 *
 * @example
 *
 *```jsx
 *import { useViewport } from '@xyflow/react';
 *
 *export default function ViewportDisplay() {
 *  const { x, y, zoom } = useViewport();
 *
 *  return (
 *    <div>
 *      <p>
 *        The viewport is currently at ({x}, {y}) and zoomed to {zoom}.
 *      </p>
 *    </div>
 *  );
 *}
 *```
 *
 * @remarks This hook can only be used in a component that is a child of a
 *{@link ReactFlowProvider} or a {@link ReactFlow} component.
 */
export function useViewport(): Viewport {
  const viewport = useStore(viewportSelector, shallow);

  return viewport;
}

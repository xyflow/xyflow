import { useMemo, type ReactNode, type ReactPortal } from 'react';
import { createPortal } from 'react-dom';

import { useReactFlowStore } from '../../hooks/useReactFlowStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.domNode;

/**
 * The `<ViewportPortal />` component can be used to add components to the same viewport
 * of the flow where nodes and edges are rendered. This is useful when you want to render
 * your own components that are adhere to the same coordinate system as the nodes & edges
 * and are also affected by zooming and panning
 * @public
 * @example
 *
 * ```jsx
 *import React from 'react';
 *import { ViewportPortal } from '@xyflow/react';
 *
 *export default function () {
 *  return (
 *    <ViewportPortal>
 *      <div
 *        style={{ transform: 'translate(100px, 100px)', position: 'absolute' }}
 *      >
 *        This div is positioned at [100, 100] on the flow.
 *      </div>
 *    </ViewportPortal>
 *  );
 *}
 *```
 */
export function ViewportPortal({ children }: { children: ReactNode }): ReactPortal | null {
  const domNode = useReactFlowStore(selector);
  const viewPortalDiv = useMemo(() => domNode?.querySelector('.react-flow__viewport-portal'), [domNode]);

  if (!viewPortalDiv) {
    return null;
  }

  return createPortal(children, viewPortalDiv);
}

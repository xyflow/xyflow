import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => s.domNode?.querySelector('.react-flow__viewport-portal');

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
export function ViewportPortal({ children }: { children: ReactNode }) {
  const viewPortalDiv = useStore(selector);

  if (!viewPortalDiv) {
    return null;
  }

  return createPortal(children, viewPortalDiv);
}

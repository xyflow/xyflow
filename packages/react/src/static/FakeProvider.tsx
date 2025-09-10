import { ReactNode, useMemo, useState } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import { Viewport } from '@xyflow/system';

import { Provider } from '../contexts/StoreContext';
import { ReactFlowState } from '../types/store';

/**
 * The FakeProvider mimics a ReactFlowProvider so that we can render Handle components
 * which rely on useStore and useStoreApi hooks without having to set up a full ReactFlow instance.
 */
export function FakeProvider({ viewport, children }: { viewport: Viewport; children: ReactNode }) {
  const [rfId] = useState(() => crypto.randomUUID());
  const fakeStore = useMemo(
    () =>
      createWithEqualityFn<ReactFlowState>(
        () =>
          ({
            rfId,
            transform: [viewport.x, viewport.y, viewport.zoom],
          } as unknown as ReactFlowState),
        Object.is
      ),
    [rfId, viewport.x, viewport.y, viewport.zoom]
  );

  return <Provider value={fakeStore}>{children}</Provider>;
}

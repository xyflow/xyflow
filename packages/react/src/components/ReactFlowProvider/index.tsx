import { useRef, type ReactNode, useEffect } from 'react';
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

import { Provider } from '../../contexts/RFStoreContext';
import { createRFStore } from '../../store';
import type { Node, Edge, ReactFlowStoreApi } from '../../types';

function ReactFlowProvider({
  children,
  initialNodes,
  initialEdges,
  initialWidth,
  initialHeight,
  fitView,
}: {
  children: ReactNode;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
}) {
  const storeRef = useRef<UseBoundStoreWithEqualityFn<ReactFlowStoreApi> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createRFStore({
      nodes: initialNodes,
      edges: initialEdges,
      width: initialWidth,
      height: initialHeight,
      fitView,
    });

    // Start batching all subsequent updates when the store is created...
    storeRef.current?.unsafe_startBatching();
  }

  // ...and stop batching after the first render.
  //
  // This optimizes all independent store updates that various React Flow
  // components perform from `useEffect` upon mounting – e.g.:
  // - https://github.com/xyflow/xyflow/blob/8fe8f73ed3d7fc2a14b2ecbefffb1b988b2edaf8/packages/react/src/hooks/useGlobalKeyHandler.ts#L35
  // - https://github.com/xyflow/xyflow/blob/8fe8f73ed3d7fc2a14b2ecbefffb1b988b2edaf8/packages/react/src/components/StoreUpdater/index.tsx#L167
  // - and several more by batching them together and treating them as a single
  //   store update.
  //
  // Without batching, each of these updates would update the state – and cause
  // Zustand to notify every listeners and re-run every selector.
  // - In React 17 and below, that will trigger a synchronous React rerender for
  //   every selector that returns new data. (React 18 batches all synchronous
  //   rerenders: https://github.com/reactwg/react-18/discussions/21 – so,
  //   luckily, it’s not an issue with the latest versions.)
  // - And no matter the version of React, that will re-evaluate every selector
  //   several times in a row, which gets pricey. (Re-evaluating all selectors
  //   just once costs ~20 ms with 6× CPU slowdown on an M2 Pro MacBook Pro).
  //
  // Implementation details:
  // - To stop batching, we use `useEffect`, and we put that `useEffect` in the
  //   topmost React component. React calls all `useEffect` definitions from
  //   bottom to top (https://stackoverflow.com/a/75509568/1192426), so this
  //   `useEffect` will be called after all other `useEffect` definitions in its
  //   children.
  // - We use `useRef` to track whether this is the first render. We can’t just
  //   do `useEffect(() => { unsafe_stopBatching() }, [])` since React’s Strict
  //   Mode will call it twice.
  const firstRenderCompleted = useRef<boolean>(false);
  useEffect(() => {
    if (!firstRenderCompleted.current) {
      storeRef.current?.unsafe_stopBatching();
      firstRenderCompleted.current = true;
    }
  }, []);

  return <Provider value={storeRef.current}>{children}</Provider>;
}

ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlowProvider;

// import { useContext, type ReactNode } from 'react';

import StoreContext from '../../contexts/StoreContext';
import { ReactFlowProvider } from '../../components/ReactFlowProvider';
import type { Node, Edge, FitViewOptions } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';
import { ParentProps, Show, useContext } from 'solid-js';

export function Wrapper(
  p: ParentProps<{
    nodes?: Node[];
    edges?: Edge[];
    defaultNodes?: Node[];
    defaultEdges?: Edge[];
    width?: number;
    height?: number;
    fitView?: boolean;
    fitViewOptions?: FitViewOptions;
    minZoom?: number;
    maxZoom?: number;
    nodeOrigin?: NodeOrigin;
    nodeExtent?: CoordinateExtent;
  }>
) {
  const isWrapped = useContext(StoreContext);

  // if (isWrapped) {
  //   return <>{children}</>;
  // }

  return (
    <Show
      when={!isWrapped}
      fallback={
        // TODO: not sure if this apples to solid?
        // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/051
        <>{p.children}</>
      }
    >
      <ReactFlowProvider
        initialNodes={p.nodes}
        initialEdges={p.edges}
        defaultNodes={p.defaultNodes}
        defaultEdges={p.defaultEdges}
        initialWidth={p.width}
        initialHeight={p.height}
        fitView={p.fitView}
        initialFitViewOptions={p.fitViewOptions}
        initialMinZoom={p.minZoom}
        initialMaxZoom={p.maxZoom}
        nodeOrigin={p.nodeOrigin}
        nodeExtent={p.nodeExtent}
      >
        {p.children}
      </ReactFlowProvider>
    </Show>
  );
}

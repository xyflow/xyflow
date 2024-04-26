// import { useContext, type ReactNode } from 'react';

import StoreContext from '../../contexts/StoreContext';
import { ReactFlowProvider } from '../../components/ReactFlowProvider';
import type { Node, Edge } from '../../types';
import { ParentProps, Show, useContext } from 'solid-js';

export function Wrapper(p: 
//   {
//   children,
//   nodes,
//   edges,
//   defaultNodes,
//   defaultEdges,
//   width,
//   height,
//   fitView,
// }: {
  ParentProps<{
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}>) {
  const isWrapped = useContext(StoreContext);

  // if (isWrapped) {
  //   return <>{children}</>;
  // }

  console.log('isWrapped', isWrapped);

  return (
    <Show when={!isWrapped} fallback={
      // TODO: not sure if this apples to solid? 
    // we need to wrap it with a fragment because it's not allowed for children to be a ReactNode
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
      <>
      {p.children}
      </>
    }>

    <ReactFlowProvider
      initialNodes={p.nodes}
      initialEdges={p.edges}
      defaultNodes={p.defaultNodes}
      defaultEdges={p.defaultEdges}
      initialWidth={p.width}
      initialHeight={p.height}
      fitView={p.fitView}
    >
      {p.children}
    </ReactFlowProvider>
    </Show>
  );
}

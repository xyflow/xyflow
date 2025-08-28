import { NodeChange } from '@xyflow/system';
import { useEffect, useRef } from 'react';
import { useStoreApi } from './useStore';
import { Edge, Node } from '../types';

/**
 * We identify each middleware with a symbol that is unique for each hook instance.
 */

function useSymbol() {
  const symbol = useRef<symbol>();
  if (!symbol.current) {
    symbol.current = Symbol();
  }
  return symbol;
}

export function useNodeChangeMiddleware<NodeType extends Node = Node>(
  fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]
) {
  const store = useStoreApi<NodeType, Edge>();
  const symbol = useSymbol();

  useEffect(() => {
    const { nodeChangeMiddleware } = store.getState();
    nodeChangeMiddleware.set(symbol.current!, fn);
  }, [fn]);

  useEffect(() => {
    const { nodeChangeMiddleware } = store.getState();
    return () => {
      nodeChangeMiddleware.delete(symbol.current!);
    };
  }, []);
}

export function useNodeChangeMiddlewareDynamic<NodeType extends Node = Node>(
  fn: (changes: NodeChange<NodeType>[]) => NodeChange<NodeType>[]
) {
  const store = useStoreApi<NodeType, Edge>();
  const symbol = useSymbol();

  const { nodeChangeMiddleware } = store.getState();
  nodeChangeMiddleware.delete(symbol.current!);
  nodeChangeMiddleware.set(symbol.current!, fn);
}

// export function useEdgeChangeMiddleware(fn: (changes: EdgeChange[]) => EdgeChange[]) {
//   const store = useStoreApi();
//   const symbol = useSymbol();

//   useEffect(() => {
//     const { edgeChangeMiddleware } = store.getState();
//     edgeChangeMiddleware.set(symbol.current!, fn);
//   }, [fn]);

//   useEffect(() => {
//     const { edgeChangeMiddleware } = store.getState();
//     return () => {
//       edgeChangeMiddleware.delete(symbol.current!);
//     };
//   }, []);
// }

// export function useNodeSyncMiddleware(fn: (changes: NodeChange[]) => NodeChange[]) {
//   const store = useStoreApi();
//   const symbol = useSymbol();

//   useEffect(() => {
//     const { nodeSyncMiddleware } = store.getState();
//     nodeSyncMiddleware.set(symbol.current!, fn);
//   }, [fn]);

//   useEffect(() => {
//     const { nodeSyncMiddleware } = store.getState();
//     return () => {
//       nodeSyncMiddleware.delete(symbol.current!);
//     };
//   }, []);
// }

// export function useEdgeSyncMiddleware(fn: (changes: EdgeChange[]) => EdgeChange[]) {
//   const store = useStoreApi();
//   const symbol = useSymbol();

//   useEffect(() => {
//     const { edgeSyncMiddleware } = store.getState();
//     edgeSyncMiddleware.set(symbol.current!, fn);
//   }, [fn]);

//   useEffect(() => {
//     const { edgeSyncMiddleware } = store.getState();
//     return () => {
//       edgeSyncMiddleware.delete(symbol.current!);
//     };
//   }, []);
// }

import { useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { useStoreApi } from './useStore';
import type { InternalNode, Node } from '../types';

/*
 * Per-node subscription for NodeWrapper: read this node's version from the store's per-node registry
 * so a single-node change wakes only this node, not every mounted node.
 */

export type NodeRenderSlice<NodeType extends Node = Node> = {
  node: InternalNode<NodeType>;
  internals: InternalNode<NodeType>['internals'];
  isParent: boolean;
};

export function useNode<NodeType extends Node = Node>(id: string): NodeRenderSlice<NodeType> {
  const store = useStoreApi();

  const getVersion = useCallback(() => store.getState().getNodeVersion(id), [store, id]);
  useSyncExternalStore(
    useCallback((onChange) => store.getState().subscribeNode(id, onChange), [store, id]),
    getVersion,
    getVersion // getServerSnapshot: the version is environment-agnostic, so SSR is safe
  );

  // NodeWrapper only renders ids present in nodeLookup, so the node is guaranteed here
  const { nodeLookup, parentLookup } = store.getState();
  const node = nodeLookup.get(id)! as InternalNode<NodeType>;
  // cast works around a generic-variance quirk in InternalNode<NodeType>['internals']
  return { node, internals: node.internals, isParent: parentLookup.has(id) } as NodeRenderSlice<NodeType>;
}

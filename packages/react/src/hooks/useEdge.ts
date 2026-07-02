import { useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { useStoreApi } from './useStore';
import type { Edge } from '../types';

/*
 * Per-edge subscription for EdgeWrapper, mirroring useNode: an edge wakes only when its own object
 * changes (setEdges) or one of its endpoint nodes moves (incidentEdges).
 */
export function useEdge<EdgeType extends Edge = Edge>(id: string): EdgeType {
  const store = useStoreApi();

  const getVersion = useCallback(() => store.getState().getEdgeVersion(id), [store, id]);
  useSyncExternalStore(
    useCallback((onChange) => store.getState().subscribeEdge(id, onChange), [store, id]),
    getVersion,
    getVersion // getServerSnapshot: the version is environment-agnostic, so SSR is safe
  );

  // EdgeWrapper only renders ids present in edgeLookup, so the edge is guaranteed here
  return store.getState().edgeLookup.get(id)! as EdgeType;
}

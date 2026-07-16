import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import type { Edge } from '../types';
import { computed, toValue } from 'vue';
import { warn } from '../utils';
import { useVueFlow } from './useVueFlow';

interface EdgeData<EdgeType extends Edge = Edge> {
  id: string;
  type: EdgeType['type'];
  data: NonNullable<EdgeType['data']> | null;
}

/**
 * Composable that lets you subscribe to changes of a specific edge's `data` object.
 *
 * @public
 * @param edgeId - The id (or ids) of the edge to get the data from
 * @returns An object (or array of objects) with `id`, `type`, `data` representing each edge
 */
export function useEdgesData<EdgeType extends Edge = Edge>(
  edgeId: MaybeRefOrGetter<string>,
): ComputedRef<EdgeData<EdgeType> | null>;
export function useEdgesData<EdgeType extends Edge = Edge>(edgeIds: MaybeRefOrGetter<string[]>): ComputedRef<EdgeData<EdgeType>[]>;
export function useEdgesData(_edgeIds: any): any {
  const { getEdge } = useVueFlow();

  return computed({
    get() {
      const edgeIds = toValue(_edgeIds);

      if (!Array.isArray(edgeIds)) {
        const edge = getEdge(edgeIds);

        if (edge) {
          return {
            id: edge.id,
            type: edge.type,
            data: edge.data ?? null,
          };
        }

        return null;
      }

      const data: EdgeData<Edge>[] = [];

      for (const edgeId of edgeIds) {
        const edge = getEdge(edgeId);

        if (edge) {
          data.push({
            id: edge.id,
            type: edge.type,
            data: edge.data ?? null,
          });
        }
      }

      return data;
    },
    set() {
      // noop
      warn('You are trying to set edge data via useEdgesData. This is not supported.');
    },
  });
}

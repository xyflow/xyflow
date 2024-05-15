import { get } from 'svelte/store';
import { errorMessages } from '@xyflow/system';

import { useStore } from '$lib/store';

export function useHandleEdgeSelect() {
  const store = useStore();

  return (id: string) => {
    const edge = store.edgeLookup.get(id);

    if (!edge) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    const selectable =
      edge.selectable ?? store.defaultEdgeOptions.selectable ?? store.elementsSelectable;

    if (selectable) {
      store.selectionRect = null;
      store.selectionRectMode = null;

      if (!edge.selected) {
        store.addSelectedEdges([id]);
      } else if (edge.selected && store.multiselectionKeyPressed) {
        store.unselectNodesAndEdges({ nodes: [], edges: [edge] });
      }
    }
  };
}

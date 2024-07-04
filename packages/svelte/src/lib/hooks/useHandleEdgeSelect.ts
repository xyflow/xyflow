import { get } from 'svelte/store';
import { errorMessages } from '@xyflow/system';

import { useStore } from '$lib/store';

export function useHandleEdgeSelect() {
  const {
    edgeLookup,
    selectionRect,
    selectionRectMode,
    multiselectionKeyPressed,
    addSelectedEdges,
    unselectNodesAndEdges,
    elementsSelectable
  } = useStore();

  return (id: string) => {
    const edge = get(edgeLookup).get(id);

    if (!edge) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    const selectable =
      edge.selectable || (get(elementsSelectable) && typeof edge.selectable === 'undefined');

    if (selectable) {
      selectionRect.set(null);
      selectionRectMode.set(null);

      if (!edge.selected) {
        addSelectedEdges([id]);
      } else if (edge.selected && get(multiselectionKeyPressed)) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
      }
    }
  };
}

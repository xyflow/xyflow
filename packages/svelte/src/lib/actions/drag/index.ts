import { get } from 'svelte/store';
import { XYDrag } from '@reactflow/utils';

import type { SvelteFlowStore } from '$lib/store/types';

type UseDragParams = {
  store: SvelteFlowStore;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
};

export default function drag(domNode: Element, params: UseDragParams) {
  const dragInstance = XYDrag({
    domNode,
    getStore: () => {
      const { store } = params;
      const snapGrid = get(store.snapGrid);

      return {
        nodes: get(store.nodes),
        edges: get(store.edges),
        nodeExtent: get(store.nodeExtent),
        snapGrid: snapGrid ? snapGrid : [0, 0],
        snapToGrid: !!snapGrid,
        nodeOrigin: [0, 0],
        multiSelectionActive: false,
        domNode: get(store.domNode),
        transform: get(store.transform),
        autoPanOnNodeDrag: get(store.autoPanOnNodeDrag),
        nodesDraggable: get(store.nodesDraggable),
        selectNodesOnDrag: get(store.selectNodesOnDrag),
        unselectNodesAndEdges: store.unselectNodesAndEdges,
        updateNodePositions: store.updateNodePositions,
        panBy: store.panBy
      };
    },
    onNodeClick: () => {
      console.log('node click');
    }
  });

  function updateDrag(domNode: Element, params: UseDragParams) {
    if (params.disabled) {
      dragInstance.destroy();
      return;
    }

    dragInstance.update({
      domNode,
      noDragClassName: params.noDragClassName,
      handleSelector: params.handleSelector,
      nodeId: params.nodeId,
      isSelectable: params.isSelectable
    });
  }

  updateDrag(domNode, params);

  return {
    update(params: UseDragParams) {
      updateDrag(domNode, params);
    },
    destroy() {
      dragInstance.destroy();
    }
  };
}

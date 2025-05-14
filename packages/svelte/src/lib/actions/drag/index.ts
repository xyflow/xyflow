import { XYDrag, type NodeBase, type OnDrag, type XYDragParams } from '@xyflow/system';

import type { SvelteFlowStore } from '$lib/store/types';
import type { Node, Edge, NodeTargetEventWithPointer } from '$lib/types';

export type UseDragParams<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  store: SvelteFlowStore<NodeType, EdgeType>;
  disabled?: boolean;
  noDragClass?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  nodeClickDistance?: number;
  onDrag?: OnDrag;
  onDragStart?: OnDrag;
  onDragStop?: OnDrag;
  onNodeMouseDown?: (id: string) => void;
};

export default function drag<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  domNode: Element,
  params: UseDragParams<NodeType, EdgeType>
) {
  const { store, onDrag, onDragStart, onDragStop, onNodeMouseDown } = params;
  const dragInstance = XYDrag({
    onDrag,
    onDragStart,
    onDragStop,
    onNodeMouseDown,
    getStoreItems: () => {
      const { snapGrid, viewport } = store;

      return {
        nodes: store.nodes satisfies NodeBase[],
        nodeLookup: store.nodeLookup,
        edges: store.edges,
        nodeExtent: store.nodeExtent,
        snapGrid: snapGrid ? snapGrid : [0, 0],
        snapToGrid: !!snapGrid,
        nodeOrigin: store.nodeOrigin,
        multiSelectionActive: store.multiselectionKeyPressed,
        domNode: store.domNode,
        transform: [viewport.x, viewport.y, viewport.zoom],
        autoPanOnNodeDrag: store.autoPanOnNodeDrag,
        nodesDraggable: store.nodesDraggable,
        selectNodesOnDrag: store.selectNodesOnDrag,
        nodeDragThreshold: store.nodeDragThreshold,
        unselectNodesAndEdges: store.unselectNodesAndEdges,
        updateNodePositions: store.updateNodePositions,
        onSelectionDrag: store.onselectiondrag,
        onSelectionDragStart: store.onselectiondragstart,
        onSelectionDragStop: store.onselectiondragstop,
        panBy: store.panBy
      };
    }
  } as XYDragParams<NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>>);

  function updateDrag(domNode: Element, params: UseDragParams<NodeType, EdgeType>) {
    if (params.disabled) {
      dragInstance.destroy();
      return;
    }

    dragInstance.update({
      domNode,
      noDragClassName: params.noDragClass,
      handleSelector: params.handleSelector,
      nodeId: params.nodeId,
      isSelectable: params.isSelectable,
      nodeClickDistance: params.nodeClickDistance
    });
  }

  updateDrag(domNode, params);

  return {
    update(params: UseDragParams<NodeType, EdgeType>) {
      updateDrag(domNode, params);
    },
    destroy() {
      dragInstance.destroy();
    }
  };
}

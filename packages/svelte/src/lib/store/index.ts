import { getContext } from 'svelte';
import { get } from 'svelte/store';
import { zoomIdentity } from 'd3-zoom';
import {
  type Transform,
  type NodeDragItem,
  type NodeDimensionUpdate,
  internalsSymbol,
  type NodeOrigin,
  type ViewportHelperFunctionOptions,
  type Connection,
  type XYPosition,
  type CoordinateExtent
} from '@reactflow/system';
import { fitView as fitViewUtil, getD3Transition, getDimensions } from '@reactflow/utils';

import { getHandleBounds, getConnectedEdges, addEdge as addEdgeUtil } from '$lib/utils';
import type { EdgeTypes, NodeTypes, Node, Edge, ConnectionData } from '$lib/types';
import { getEdgesLayouted } from './edges-layouted';
import { getConnectionPath } from './connection-path';
import { initConnectionData, initialStoreState } from './initial-store';
import type { SvelteFlowStore } from './types';

export const key = Symbol();

type CreateStoreProps = {
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  transform?: Transform;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  id?: string;
};

export function createStore({
  transform = [0, 0, 1],
  nodeOrigin = [0, 0],
  fitView: fitViewOnInit = false,
  nodeTypes = {},
  edgeTypes = {},
  id = '1'
}: CreateStoreProps): SvelteFlowStore {
  const store = {
    ...initialStoreState
  };

  let fitViewOnInitDone = false;

  function setEdges(edges: Edge[]) {
    store.edges.set(edges);
  }

  function addEdge(edgeParams: Edge | Connection) {
    const edges = get(store.edges);
    store.edges.set(addEdgeUtil(edgeParams, edges));
  }

  function setNodes(nodes: Node[]) {
    store.nodes.update((currentNodes) => {
      const nextNodes = nodes.map((n) => {
        const currentNode = currentNodes.find((cn) => cn.id === n.id) || {};

        return {
          ...currentNode,
          ...n,
          positionAbsolute: n.position
        };
      });

      return nextNodes;
    });
  }

  function updateNodePositions(nodeDragItems: NodeDragItem[], dragging = false) {
    store.nodes.update((nds) => {
      return nds.map((n) => {
        const nodeDragItem = nodeDragItems.find((ndi) => ndi.id === n.id);

        if (nodeDragItem) {
          return {
            ...n,
            dragging,
            positionAbsolute: nodeDragItem.positionAbsolute,
            position: nodeDragItem.position
          };
        }

        return n;
      });
    });
  }

  function updateNodeDimensions(updates: NodeDimensionUpdate[]) {
    const viewportNode = document?.querySelector('.react-flow__viewport');

    if (!viewportNode) {
      return;
    }

    const style = window.getComputedStyle(viewportNode);
    const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

    const nextNodes = get(store.nodes).map((node) => {
      const update = updates.find((u) => u.id === node.id);

      if (update) {
        const dimensions = getDimensions(update.nodeElement);

        const doUpdate = !!(
          dimensions.width &&
          dimensions.height &&
          (node.width !== dimensions.width ||
            node.height !== dimensions.height ||
            update.forceUpdate)
        );

        if (doUpdate) {
          node[internalsSymbol] = {
            ...node[internalsSymbol],
            handleBounds: {
              source: getHandleBounds('.source', update.nodeElement, zoom),
              target: getHandleBounds('.target', update.nodeElement, zoom)
            }
          };
          node.width = dimensions.width;
          node.height = dimensions.height;
        }
      }

      return node;
    });

    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    fitViewOnInitDone =
      fitViewOnInitDone || (fitViewOnInit && !!d3Zoom && !!d3Selection && fitView());

    store.nodes.set(nextNodes);
  }

  function zoomIn(options?: ViewportHelperFunctionOptions) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    if (d3Zoom && d3Selection) {
      d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1.2);
    }
  }

  function zoomOut(options?: ViewportHelperFunctionOptions) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);
    if (d3Zoom && d3Selection) {
      d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), 1 / 1.2);
    }
  }

  function fitView() {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    if (!d3Zoom || !d3Selection) {
      return false;
    }

    return fitViewUtil(
      {
        nodes: get(store.nodes),
        width: get(store.width),
        height: get(store.height),
        minZoom: 0.2,
        maxZoom: 2,
        d3Selection,
        d3Zoom,
        nodeOrigin: get(store.nodeOrigin)
      },
      {}
    );
  }

  function resetSelectedItem<T extends Node | Edge>(item: T) {
    if (item.selected) {
      return {
        ...item,
        selected: false
      };
    }

    return item;
  }

  function resetSelectedElements() {
    store.nodes.update((ns) => ns.map(resetSelectedItem));
    store.edges.update((es) => es.map(resetSelectedItem));
  }

  store.deleteKeyPressed.subscribe((deleteKeyPressed) => {
    if (deleteKeyPressed) {
      const nodes = get(store.nodes);
      const edges = get(store.edges);
      const selectedNodes = nodes.filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);

      // @todo can we put this stuff into @reactflow/utils?
      const nodeIds = selectedNodes.map((node) => node.id);
      const edgeIds = selectedEdges.map((edge) => edge.id);
      const nodesToRemove = nodes.reduce<Node[]>((res, node) => {
        const parentHit =
          !nodeIds.includes(node.id) &&
          node.parentNode &&
          res.find((n) => n.id === node.parentNode);
        const deletable = typeof node.deletable === 'boolean' ? node.deletable : true;
        if (deletable && (nodeIds.includes(node.id) || parentHit)) {
          res.push(node);
        }

        return res;
      }, []);
      const deletableEdges = edges.filter((e) =>
        typeof e.deletable === 'boolean' ? e.deletable : true
      );
      const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));

      if (nodesToRemove || initialHitEdges) {
        const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
        const edgesToRemove = [...initialHitEdges, ...connectedEdges];
        const edgeIdsToRemove = edgesToRemove.reduce<string[]>((res, edge) => {
          if (!res.includes(edge.id)) {
            res.push(edge.id);
          }
          return res;
        }, []);

        store.nodes.update((nds) => nds.filter((node) => !nodeIds.includes(node.id)));
        store.edges.update((eds) => eds.filter((edge) => !edgeIdsToRemove.includes(edge.id)));
      }
    }
  });

  function addSelectedNodes(ids: string[]) {
    store.selectionRect.set(null);
    store.selectionRectMode.set(null);

    if (get(store.multiselectionKeyPressed)) {
      // @todo handle multiselection key
    }

    store.nodes.update((ns) =>
      ns.map((node) => {
        return {
          ...node,
          selected: ids.includes(node.id)
        };
      })
    );
  }

  function panBy(delta: XYPosition) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);
    const transform = get(store.transform);
    const width = get(store.width);
    const height = get(store.height);

    if (!d3Zoom || !d3Selection || (!delta.x && !delta.y)) {
      return;
    }

    const nextTransform = zoomIdentity
      .translate(transform[0] + delta.x, transform[1] + delta.y)
      .scale(transform[2]);

    const extent: CoordinateExtent = [
      [0, 0],
      [width, height]
    ];

    const constrainedTransform = d3Zoom?.constrain()(nextTransform, extent, [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ]);
    d3Zoom.transform(d3Selection, constrainedTransform);
  }

  function updateConnection(connectionUpdate: Partial<ConnectionData> | null) {
    const currentConnectionData = get(store.connection);
    const nextConnectionData = currentConnectionData
      ? {
          ...initConnectionData,
          ...currentConnectionData,
          ...connectionUpdate
        }
      : {
          ...initConnectionData,
          ...connectionUpdate
        };

    store.connection.set(nextConnectionData);
  }

  function cancelConnection() {
    updateConnection(initConnectionData);
  }

  return {
    // state
    ...store,

    // derived state
    edgesLayouted: getEdgesLayouted(store),
    connectionPath: getConnectionPath(store),

    // actions
    setNodes,
    setEdges,
    addEdge,
    updateNodePositions,
    updateNodeDimensions,
    zoomIn,
    zoomOut,
    fitView,
    resetSelectedElements,
    addSelectedNodes,
    panBy,
    updateConnection,
    cancelConnection
  };
}

export function useStore(): SvelteFlowStore {
  const { getStore } = getContext<{ getStore: () => SvelteFlowStore }>(key);

  return getStore();
}

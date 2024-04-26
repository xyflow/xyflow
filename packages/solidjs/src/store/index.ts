// import { createWithEqualityFn } from 'zustand/traditional';
import {
  clampPosition,
  fitViewport as fitViewSystem,
  adoptUserNodes,
  updateAbsolutePositions,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  updateConnectionLookup,
  handleExpandParent,
  NodeChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  ParentExpandChild,
  InternalNodeUpdate,
  initialConnection,
  NodeOrigin,
  CoordinateExtent,
  fitViewport,
} from '@xyflow/system';

import { applyEdgeChanges, applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import getInitialState from './initialState';
import type { Node, Edge, UnselectNodesAndEdgesParams, FitViewOptions, ReactFlowActions } from '../types';
import { batch } from 'solid-js';

const createStore = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView: shouldFitView,
  fitViewOptions,
  minZoom,
  maxZoom,
  nodeOrigin,
  nodeExtent,
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  minZoom?: number;
  maxZoom?: number;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}) => {
  // createWithEqualityFn<ReactFlowState>(
  // (set, get) => ({

  const store = getInitialState({
    nodes,
    edges,
    width,
    height,
    fitView: shouldFitView,
    fitViewOptions,
    minZoom,
    maxZoom,
    nodeOrigin,
    nodeExtent,
    defaultNodes,
    defaultEdges,
  });

  async function resolveFitView() {
    const { nodeLookup, panZoom, fitViewOptions, fitViewResolver, width, height, minZoom, maxZoom } = store;

    const panZoomInstance = panZoom.get();
    if (!panZoomInstance) {
      return;
    }

    await fitViewport(
      {
        nodes: nodeLookup,
        width: width.get(),
        height: height.get(),
        panZoom: panZoomInstance,
        minZoom: minZoom.get(),
        maxZoom: maxZoom.get(),
      },
      fitViewOptions.get()
    );

    fitViewResolver.get()?.resolve(true);
    /**
     * wait for the fitViewport to resolve before deleting the resolver,
     * we want to reuse the old resolver if the user calls fitView again in the mean time
     */
    fitViewResolver.set(null);
  }

  const setNodes = (newNodes: Node[]) => {
    const { nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodes, nodeExtent, fitViewQueued } = store;
    /*
     * setNodes() is called exclusively in response to user actions:
     * - either when the `<ReactFlow nodes>` prop is updated in the controlled ReactFlow setup,
     * - or when the user calls something like `reactFlowInstance.setNodes()` in an uncontrolled ReactFlow setup.
     *
     * When this happens, we take the note objects passed by the user and extend them with fields
     * relevant for internal React Flow operations.
     */

    const nodesInitialized = adoptUserNodes(newNodes, nodeLookup, parentLookup, {
      nodeOrigin: nodeOrigin.get(),
      nodeExtent: nodeExtent.get(),
      elevateNodesOnSelect: elevateNodesOnSelect.get(),
      checkEquality: true,
    });

    if (fitViewQueued.get() && nodesInitialized) {
      resolveFitView();
      nodes.set(newNodes);
      store.nodesInitialized.set(nodesInitialized);
      fitViewQueued.set(false);
      store.fitViewOptions.set(undefined);
    } else {
      nodes.set(newNodes);
      store.nodesInitialized.set(nodesInitialized);
    }
  };
  const setEdges = (edges: Edge[]) => {
    return batch(() => {
      const { connectionLookup, edgeLookup, edges: storeEdges } = store;

      updateConnectionLookup(connectionLookup, edgeLookup, edges);

      storeEdges.set(edges);
    });
  };
  const setDefaultNodesAndEdges = (nodes?: Node[], edges?: Edge[]) => {
    return batch(() => {
      if (nodes) {
        setNodes(nodes);
        store.hasDefaultNodes.set(true);
      }
      if (edges) {
        setEdges(edges);
        store.hasDefaultEdges.set(true);
      }
    });
  };
  /*
   * Every node gets registerd at a ResizeObserver. Whenever a node
   * changes its dimensions, this function is called to measure the
   * new dimensions and update the nodes.
   */
  const updateNodeInternals = (updates: Map<string, InternalNodeUpdate>, params?: { triggerFitView: boolean }) => {
    return batch(() => {
      const { nodeLookup, parentLookup, domNode, nodeOrigin, nodeExtent, debug, fitViewQueued } = store;

      const { changes, updatedInternals } = updateNodeInternalsSystem(
        updates,
        nodeLookup,
        parentLookup,
        domNode.get(),
        nodeOrigin.get(),
        nodeExtent.get()
      );

      if (!updatedInternals) {
        return;
      }

      updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin: nodeOrigin.get(), nodeExtent: nodeExtent.get() });

      if (params?.triggerFitView || fitViewQueued.get()) {
        resolveFitView();
        fitViewQueued.set(false);
        store.fitViewOptions.set(undefined);
      } else {
        // we always want to trigger useStore calls whenever updateNodeInternals is called
        // In SolidJS, we can trigger reactivity by updating a signal
        store.width.setFromPrev((w) => w);
      }

      if (changes?.length > 0) {
        if (debug.get()) {
          console.log('React Flow: trigger node changes', changes);
        }
        triggerNodeChanges(changes);
      }
    });
  };
  const updateNodePositions: DefaultActions['updateNodePositions'] = (nodeDragItems, dragging = false) => {
    return batch(() => {
      const parentExpandChildren: ParentExpandChild[] = [];
      const changes = [];
      const { nodeLookup } = store;

      for (const [id, dragItem] of nodeDragItems) {
        // we are using the nodelookup to be sure to use the current expandParent and parentId value
        const node = nodeLookup.get(id);
        const expandParent = !!(node?.expandParent && node?.parentId && dragItem?.position);

        const change: NodeChange = {
          id,
          type: 'position',
          position: expandParent
            ? {
                x: Math.max(0, dragItem.position.x),
                y: Math.max(0, dragItem.position.y),
              }
            : dragItem.position,
          dragging,
        };

        if (expandParent && node.parentId) {
          parentExpandChildren.push({
            id,
            parentId: node.parentId,
            rect: {
              ...dragItem.internals.positionAbsolute,
              width: dragItem.measured.width ?? 0,
              height: dragItem.measured.height ?? 0,
            },
          });
        }

        changes.push(change);
      }

      if (parentExpandChildren.length > 0) {
        const { parentLookup, nodeOrigin } = store;
        const parentExpandChanges = handleExpandParent(
          parentExpandChildren,
          nodeLookup,
          parentLookup,
          nodeOrigin.get()
        );
        changes.push(...parentExpandChanges);
      }

      triggerNodeChanges(changes);
    });
  };
  const triggerNodeChanges: DefaultActions['triggerNodeChanges'] = (changes) => {
    return batch(() => {
      const { onNodesChange, nodes, hasDefaultNodes, debug } = store;

      if (changes?.length) {
        if (hasDefaultNodes.get()) {
          const updatedNodes = applyNodeChanges(changes, nodes.get());
          setNodes(updatedNodes);
        }

        if (debug.get()) {
          console.log('React Flow: trigger node changes', changes);
        }

        onNodesChange.get()?.(changes);
      }
    });
  };
  const triggerEdgeChanges: DefaultActions['triggerEdgeChanges'] = (changes) => {
    return batch(() => {
      const { onEdgesChange, edges, hasDefaultEdges, debug } = store;

      if (changes?.length) {
        if (hasDefaultEdges.get()) {
          const updatedEdges = applyEdgeChanges(changes, edges.get());
          setEdges(updatedEdges);
        }

        if (debug.get()) {
          console.log('React Flow: trigger edge changes', changes);
        }

        onEdgesChange.get()?.(changes);
      }
    });
  };
  const addSelectedNodes: DefaultActions['addSelectedNodes'] = (selectedNodeIds) => {
    return batch(() => {
      const { multiSelectionActive, edgeLookup, nodeLookup } = store;

      if (multiSelectionActive.get()) {
        const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        triggerNodeChanges(nodeChanges);
        return;
      }

      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds]), true));
      triggerEdgeChanges(getSelectionChanges(edgeLookup));
    });
  };
  const addSelectedEdges: DefaultActions['addSelectedEdges'] = (selectedEdgeIds) => {
    batch(() => {
      const { multiSelectionActive, edgeLookup, nodeLookup } = store;

      if (multiSelectionActive.get()) {
        const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        triggerEdgeChanges(changedEdges);
        return;
      }

      triggerEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set(), true));
    });
  };
  const unselectNodesAndEdges = ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
    batch(() => {
      const { edges: storeEdges, nodes: storeNodes, nodeLookup } = store;
      const nodesToUnselect = nodes ? nodes : storeNodes.get();
      const edgesToUnselect = edges ? edges : storeEdges.get();
      const nodeChanges = nodesToUnselect.map((n) => {
        const internalNode = nodeLookup.get(n.id);
        if (internalNode) {
          /*
           * we need to unselect the internal node that was selected previously before we
           * send the change to the user to prevent it to be selected while dragging the new node
           */
          internalNode.selected = false;
        }

        return createSelectionChange(n.id, false);
      });
      const edgeChanges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));

      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    });
  };
  const setMinZoom: DefaultActions['setMinZoom'] = (minZoom) => {
    batch(() => {
      const { panZoom, maxZoom, minZoom: storeMinZoom } = store;
      panZoom.get()?.setScaleExtent([minZoom, maxZoom.get()]);
      storeMinZoom.set(minZoom);
    });
  };
  const setMaxZoom: DefaultActions['setMaxZoom'] = (maxZoom) => {
    batch(() => {
      const { panZoom, minZoom, maxZoom: storeMaxZoom } = store;
      panZoom.get()?.setScaleExtent([minZoom.get(), maxZoom]);

      storeMaxZoom.set(maxZoom);
    });
  };
  const setTranslateExtent: DefaultActions['setTranslateExtent'] = (translateExtent) => {
    batch(() => {
      const { panZoom } = store;

      panZoom.get()?.setTranslateExtent(translateExtent);

      store.translateExtent.set(translateExtent);
    });
  };
  const setPaneClickDistance = (clickDistance: number) => {
    store.panZoom.get()?.setClickDistance(clickDistance);
  };
  const resetSelectedElements = () => {
    batch(() => {
      const { edges, nodes, elementsSelectable } = store;

      if (!elementsSelectable.get()) {
        return;
      }

      const nodeChanges = nodes
        .get()
        .reduce<NodeSelectionChange[]>(
          (res, node) => (node.selected ? [...res, createSelectionChange(node.id, false)] : res),
          []
        );
      const edgeChanges = edges
        .get()
        .reduce<EdgeSelectionChange[]>(
          (res, edge) => (edge.selected ? [...res, createSelectionChange(edge.id, false)] : res),
          []
        );

      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    });
  };
  const setNodeExtent: DefaultActions['setNodeExtent'] = (nextNodeExtent) => {
    batch(() => {
      const { nodes, nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodeExtent } = store;

      if (
        nextNodeExtent[0][0] === nodeExtent.get()[0][0] &&
        nextNodeExtent[0][1] === nodeExtent.get()[0][1] &&
        nextNodeExtent[1][0] === nodeExtent.get()[1][0] &&
        nextNodeExtent[1][1] === nodeExtent.get()[1][1]
      ) {
        return;
      }

      adoptUserNodes(nodes.get(), nodeLookup, parentLookup, {
        nodeOrigin: nodeOrigin.get(),
        nodeExtent: nextNodeExtent,
        elevateNodesOnSelect: elevateNodesOnSelect.get(),
        checkEquality: false,
      });

      nodeExtent.set(nextNodeExtent);
    });
  };
  const panBy: DefaultActions['panBy'] = (delta): Promise<boolean> => {
    return batch(() => {
      const { transform, width, height, panZoom, translateExtent } = store;
      return panBySystem({
        delta,
        panZoom: panZoom.get(),
        transform: transform.get(),
        translateExtent: translateExtent.get(),
        width: width.get(),
        height: height.get(),
      });
    });
  };

  const fitView = (options?: FitViewOptions): Promise<boolean> => {
    return batch(() => {
      const { width, height, minZoom, maxZoom, nodes, nodeLookup } = store;
      const panZoom = store.panZoom.get();

      if (!panZoom) {
        return Promise.resolve(false);
      }

      return fitViewport(
        {
          nodes: nodeLookup,
          width: width.get(),
          height: height.get(),
          panZoom,
          minZoom: minZoom.get(),
          maxZoom: maxZoom.get(),
        },
        options
      );
    });
  };
  const cancelConnection = () => {
    store.connection.setter()({ ...initialConnection });
  };

  const updateConnection: DefaultActions['updateConnection'] = (connection) => {
    store.connection.setter()(connection);
  };

  const reset = () => {
    batch(() => {
      // const initialState = getInitialState();
      // throw new Error('Not implemented. need to reset each field');
      // store.set({ ...getInitialState() });
      console.warn('Not implemented. need to reset each field');
    });
  };

  return {
    ...store,
    setNodes,
    setEdges,
    setDefaultNodesAndEdges,
    updateNodeInternals,
    updateNodePositions,
    triggerNodeChanges,
    triggerEdgeChanges,
    addSelectedNodes,
    addSelectedEdges,
    unselectNodesAndEdges,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setPaneClickDistance,
    resetSelectedElements,
    setNodeExtent,
    panBy,
    fitView,
    cancelConnection,
    updateConnection,
    reset,
  };
};

export { createStore };

type DefaultActions = ReactFlowActions<Node, Edge>;

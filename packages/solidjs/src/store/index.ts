// import { createWithEqualityFn } from 'zustand/traditional';
import {
  clampPosition,
  fitView as fitViewSystem,
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
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}) => {
  // createWithEqualityFn<ReactFlowState>(
  // (set, get) => ({

  const store = getInitialState({ nodes, edges, width, height, fitView: shouldFitView, defaultNodes, defaultEdges });

  const setNodes = (newNodes: Node[]) => {
    const { nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodes } = store;
    // setNodes() is called exclusively in response to user actions:
    // - either when the `<ReactFlow nodes>` prop is updated in the controlled ReactFlow setup,
    // - or when the user calls something like `reactFlowInstance.setNodes()` in an uncontrolled ReactFlow setup.
    //
    // When this happens, we take the note objects passed by the user and extend them with fields
    // relevant for internal React Flow operations.
    adoptUserNodes(newNodes, nodeLookup, parentLookup, {
      nodeOrigin: nodeOrigin.get(),
      elevateNodesOnSelect: elevateNodesOnSelect.get(),
      checkEquality: false,
    });

    nodes.set(newNodes);
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
        const { nodes: storeNodes, hasDefaultNodes } = store;

        storeNodes.set(nodes);
        hasDefaultNodes.set(true);
      }
      if (edges) {
        const { edges: storeEdges, hasDefaultEdges } = store;
        storeEdges.set(edges);
        hasDefaultEdges.set(true);
      }
    });
  };
  // Every node gets registerd at a ResizeObserver. Whenever a node
  // changes its dimensions, this function is called to measure the
  // new dimensions and update the nodes.
  const updateNodeInternals = (updates: Map<string, InternalNodeUpdate>) => {
    return batch(() => {
      const {
        onNodesChange,
        nodeLookup,
        parentLookup,
        fitViewOnInit,
        fitViewDone,
        fitViewOnInitOptions,
        domNode,
        nodeOrigin,
        debug,
      } = store;

      const { changes, updatedInternals } = updateNodeInternalsSystem(
        updates,
        nodeLookup,
        parentLookup,
        domNode.get(),
        nodeOrigin.get()
      );

      if (!updatedInternals) {
        return;
      }

      updateAbsolutePositions(nodeLookup, { nodeOrigin: nodeOrigin.get() });

      // we call fitView once initially after all dimensions are set
      let nextFitViewDone = fitViewDone.get();
      if (!fitViewDone && fitViewOnInit) {
        nextFitViewDone = fitView({
          ...fitViewOnInitOptions,
          nodes: fitViewOnInitOptions.get()?.nodes,
        });
      }

      // here we are cirmumventing the onNodesChange handler
      // in order to be able to display nodes even if the user
      // has not provided an onNodesChange handler.
      // Nodes are only rendered if they have a width and height
      // attribute which they get from this handler.
      fitViewDone.set(nextFitViewDone);
      // set({ fitViewDone: nextFitViewDone });

      if (changes?.length > 0) {
        if (debug) {
          console.log('React Flow: trigger node changes', changes);
        }
        onNodesChange.get()?.(changes);
      }
    });
  };
  const updateNodePositions: DefaultActions['updateNodePositions'] = (nodeDragItems, dragging = false) => {
    return batch(() => {
      const parentExpandChildren: ParentExpandChild[] = [];
      const changes = [];

      for (const [id, dragItem] of nodeDragItems) {
        // @todo add expandParent to drag item so that we can get rid of the look up here
        const change: NodeChange = {
          id,
          type: 'position',
          position: dragItem.position,
          dragging,
        };

        if (dragItem?.expandParent && dragItem?.parentId && change.position) {
          parentExpandChildren.push({
            id,
            parentId: dragItem.parentId,
            rect: {
              ...dragItem.internals.positionAbsolute,
              width: dragItem.measured.width!,
              height: dragItem.measured.height!,
            },
          });

          change.position.x = Math.max(0, change.position.x);
          change.position.y = Math.max(0, change.position.y);
        }

        changes.push(change);
      }

      if (parentExpandChildren.length > 0) {
        const { nodeLookup, parentLookup } = store;
        const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup);
        changes.push(...parentExpandChanges);
      }

      triggerNodeChanges(changes);
    });
  };
  const triggerNodeChanges: DefaultActions['triggerNodeChanges'] = (changes) => {
    console.log('triggerNodeChanges', changes);
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
        if (hasDefaultEdges) {
          const updatedEdges = applyEdgeChanges(changes, edges.get());
          setEdges(updatedEdges);
        }

        if (debug) {
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
        triggerNodeChanges(nodeChanges as NodeSelectionChange[]);
        return;
      }

      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds])));
      triggerEdgeChanges(getSelectionChanges(edgeLookup));
    });
  };
  const addSelectedEdges: DefaultActions['addSelectedEdges'] = (selectedEdgeIds) => {
    batch(() => {
      const { multiSelectionActive, edgeLookup, nodeLookup } = store;

      if (multiSelectionActive) {
        const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        triggerEdgeChanges(changedEdges as EdgeSelectionChange[]);
        return;
      }

      triggerEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set()));
    });
  };
  const unselectNodesAndEdges = ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
    batch(() => {
      const { edges: storeEdges, nodes: storeNodes } = store;
      const nodesToUnselect = nodes ? nodes : storeNodes.get();
      const edgesToUnselect = edges ? edges : storeEdges.get();

      const nodeChanges = nodesToUnselect.map((n) => {
        n.selected = false;
        return createSelectionChange(n.id, false);
      });
      const edgeChanges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));

      triggerNodeChanges(nodeChanges as NodeSelectionChange[]);
      triggerEdgeChanges(edgeChanges as EdgeSelectionChange[]);
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
  const resetSelectedElements = () => {
    batch(() => {
      const { edges, nodes } = store;

      const nodeChanges = nodes
        .get()
        .reduce<NodeSelectionChange[]>(
          (res, node) => (node.selected ? [...res, createSelectionChange(node.id, false) as NodeSelectionChange] : res),
          []
        );
      const edgeChanges = edges
        .get()
        .reduce<EdgeSelectionChange[]>(
          (res, edge) => (edge.selected ? [...res, createSelectionChange(edge.id, false) as EdgeSelectionChange] : res),
          []
        );

      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    });
  };
  const setNodeExtent: DefaultActions['setNodeExtent'] = (nodeExtent) => {
    batch(() => {
      const { nodeLookup, nodeExtent: storeNodeExtent } = store;

      for (const [, node] of nodeLookup) {
        const positionAbsolute = clampPosition(node.position, nodeExtent);

        nodeLookup.set(node.id, {
          ...node,
          internals: {
            ...node.internals,
            positionAbsolute,
          },
        });
      }

      storeNodeExtent.set(nodeExtent);
    });
  };
  const panBy: DefaultActions['panBy'] = (delta): boolean => {
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

  const fitView = (options?: FitViewOptions): boolean => {
    return batch(() => {
      const { width, height, minZoom, maxZoom, nodeOrigin, nodeLookup } = store;
      const panZoom = store.panZoom.get();

      if (!panZoom) {
        return false;
      }

      return fitViewSystem(
        {
          nodeLookup,
          width: width.get(),
          height: height.get(),
          panZoom,
          minZoom: minZoom.get(),
          maxZoom: maxZoom.get(),
          nodeOrigin: nodeOrigin.get(),
        },
        options
      );
    });
  };
  const cancelConnection = () => {
    return batch(() => {
      store.connectionStatus.set(null);
      store.connectionStartHandle.set(null);
      store.connectionEndHandle.set(null);
    });
  };

  const updateConnection: DefaultActions['updateConnection'] = (params) => {
    return batch(() => {
      const { connectionPosition } = store;

      const currentConnection = {
        ...params,
        connectionPosition: params.connectionPosition ?? connectionPosition.get(),
      };

      store.connectionPosition.set(currentConnection.connectionPosition);
      store.connectionStatus.set(currentConnection.connectionStatus);
      store.connectionStartHandle.set(currentConnection.connectionStartHandle);
      store.connectionEndHandle.set(currentConnection.connectionEndHandle);
    });
  };

  const reset = () => {
    batch(() => {
      const initialState = getInitialState();
      // throw new Error('Not implemented. need to reset each field');
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
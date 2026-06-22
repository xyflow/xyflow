import { createWithEqualityFn } from 'zustand/traditional';
import {
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
  initialConnection,
  NodeOrigin,
  CoordinateExtent,
  fitViewport,
  getHandlePosition,
  Position,
  ZIndexMode,
} from '@xyflow/system';

import { applyEdgeChanges, applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import getInitialState from './initialState';
import type { ReactFlowState, Node, Edge, UnselectNodesAndEdgesParams, FitViewOptions } from '../types';

const createStore = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView,
  fitViewOptions,
  minZoom,
  maxZoom,
  nodeOrigin,
  nodeExtent,
  zIndexMode,
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
  zIndexMode?: ZIndexMode;
}) =>
  createWithEqualityFn<ReactFlowState>((set, get) => {
    /*
     * Per-node subscription registry. A node subscribes to only its own internalNode (via
     * `useNode`) instead of the global notify-all store, so a single-node change no longer re-runs
     * every node's selector, the dominant cost when dragging one node out of thousands.
     *
     * Each subscribed node has a version counter that the subscriber reads through `getNodeVersion`.
     * We bump it when the node's internalNode reference changes or when its parent status
     * (`parentLookup.has(id)`) flips. The parent-status part matters because a child gaining or
     * losing `parentId` does not change the parent's own reference, so a plain ref check misses it.
     */
    const nodeListeners = new Map<string, Set<() => void>>();
    const nodeVersions = new Map<string, number>();
    const prevNodeRef = new Map<string, unknown>();
    const prevIsParent = new Map<string, boolean>();

    function notifyNode(id: string) {
      const { nodeLookup, parentLookup } = get();
      prevNodeRef.set(id, nodeLookup.get(id));
      prevIsParent.set(id, parentLookup.has(id));
      nodeVersions.set(id, (nodeVersions.get(id) ?? 0) + 1);
      const listeners = nodeListeners.get(id);
      if (listeners) {
        for (const l of listeners) l();
      }
    }

    function subscribeNode(id: string, listener: () => void) {
      let listeners = nodeListeners.get(id);
      if (!listeners) {
        listeners = new Set();
        nodeListeners.set(id, listeners);
        // record the current values in the prev maps so the first notify doesn't fire spuriously
        const { nodeLookup, parentLookup } = get();
        prevNodeRef.set(id, nodeLookup.get(id));
        prevIsParent.set(id, parentLookup.has(id));
        if (!nodeVersions.has(id)) nodeVersions.set(id, 0);
      }
      listeners.add(listener);
      return () => {
        const listenerSet = nodeListeners.get(id);
        if (listenerSet) {
          listenerSet.delete(listener);
          if (listenerSet.size === 0) {
            nodeListeners.delete(id);
            nodeVersions.delete(id);
            prevNodeRef.delete(id);
            prevIsParent.delete(id);
          }
        }
      };
    }

    function getNodeVersion(id: string) {
      return nodeVersions.get(id) ?? 0;
    }

    /*
     * `mayMoveCulledNodes`: the caller took a full-rebuild path that can move nodes the per-node
     * scan can't see, e.g. a subflow cascade (a parented graph takes the full rebuild under `auto`
     * zIndexMode, child-before-parent ordering, or a structural change, and a parent move then
     * cascades to its children) or a nodeExtent re-clamp. Only relevant under
     * onlyRenderVisibleElements, where such a node may be culled (unmounted) yet still have a
     * visible incident edge.
     */
    function notifyNodes(changedIds?: string[], mayMoveCulledNodes = false) {
      // O(changed): the caller (incremental adopt / delta write) listed exactly
      // which nodes changed and guarantees no parent-status flips.
      if (changedIds) {
        if (nodeListeners.size > 0) {
          for (const id of changedIds) {
            if (nodeListeners.has(id)) notifyNode(id);
          }
        }
        notifyIncidentEdges(changedIds);
        return;
      }

      // No change list: scan subscribed nodes, fire on a ref or parent-status change. Removed ids go
      // to the edge notify but never to notifyNode (their NodeWrapper is unmounting; useNode would
      // dereference a missing nodeLookup entry).
      if (nodeListeners.size === 0) {
        notifyIncidentEdges();
        return;
      }
      const { nodeLookup, parentLookup } = get();
      const changedForEdges: string[] = [];
      for (const id of nodeListeners.keys()) {
        const node = nodeLookup.get(id);
        if (node === undefined) {
          changedForEdges.push(id);
          continue;
        }
        if (prevNodeRef.get(id) !== node || prevIsParent.get(id) !== parentLookup.has(id)) {
          notifyNode(id);
          changedForEdges.push(id);
        }
      }
      /*
       * If the caller may have moved culled nodes and some nodes are culled (mounted < total), the
       * scan above missed any culled-but-moved node, so re-path all mounted edges. Only on-screen
       * edges are mounted under culling, so this is bounded, and it's paid only by
       * onlyRenderVisibleElements users on a full-rebuild/extent path. Without culling the scan
       * already covers every node, so this is skipped entirely.
       */
      if (mayMoveCulledNodes && nodeListeners.size < nodeLookup.size) {
        notifyIncidentEdges();
      } else {
        notifyIncidentEdges(changedForEdges);
      }
    }

    /*
     * Per-edge subscription registry, mirroring the per-node one. An edge re-renders
     * on one of its endpoint nodes moving: the `incidentEdges` map (nodeId -> edge
     * ids touching it) lets a single-node move re-path only those edges. Edge data
     * and config changes still come through cheap global useStore selectors in
     * EdgeWrapper (see there), not this registry.
     *
     * We key incident edges by bare nodeId rather than reusing connectionLookup,
     * which dedupes by handle pair and would collapse parallel edges (same endpoints
     * and handles) into one entry, missing all but one of them on a node move.
     */
    const edgeListeners = new Map<string, Set<() => void>>();
    const edgeVersions = new Map<string, number>();
    const incidentEdges = new Map<string, Set<string>>();

    function addIncidentEdge(nodeId: string, edgeId: string) {
      let edges = incidentEdges.get(nodeId);
      if (!edges) {
        edges = new Set();
        incidentEdges.set(nodeId, edges);
      }
      edges.add(edgeId);
    }

    function rebuildIncidentEdges(edges: Edge[]) {
      incidentEdges.clear();
      for (const edge of edges) {
        addIncidentEdge(edge.source, edge.id);
        addIncidentEdge(edge.target, edge.id);
      }
    }

    function notifyEdge(edgeId: string) {
      // only bump for a subscribed edge; notifyIncidentEdges fires on incident edges that may be
      // culled (unmounted) under onlyRenderVisibleElements, and an orphan version entry would leak
      const listeners = edgeListeners.get(edgeId);
      if (!listeners) {
        return;
      }
      edgeVersions.set(edgeId, (edgeVersions.get(edgeId) ?? 0) + 1);
      for (const l of listeners) l();
    }

    function notifyIncidentEdges(changedNodeIds?: string[]) {
      if (edgeListeners.size === 0) return;
      if (!changedNodeIds) {
        for (const edgeId of edgeListeners.keys()) notifyEdge(edgeId);
        return;
      }
      // dedupe so an edge spanning two changed nodes (or a parallel pair sharing a
      // moved node) fires once
      const seen = new Set<string>();
      for (const nodeId of changedNodeIds) {
        const edges = incidentEdges.get(nodeId);
        if (!edges) continue;
        for (const edgeId of edges) {
          if (!seen.has(edgeId)) {
            seen.add(edgeId);
            notifyEdge(edgeId);
          }
        }
      }
    }

    function subscribeEdge(id: string, listener: () => void) {
      let listeners = edgeListeners.get(id);
      if (!listeners) {
        listeners = new Set();
        edgeListeners.set(id, listeners);
        if (!edgeVersions.has(id)) edgeVersions.set(id, 0);
      }
      listeners.add(listener);
      return () => {
        const listenerSet = edgeListeners.get(id);
        if (listenerSet) {
          listenerSet.delete(listener);
          if (listenerSet.size === 0) {
            edgeListeners.delete(id);
            edgeVersions.delete(id);
          }
        }
      };
    }

    function getEdgeVersion(id: string) {
      return edgeVersions.get(id) ?? 0;
    }

    async function resolveFitView() {
      const { nodeLookup, panZoom, fitViewOptions, fitViewResolver, width, height, minZoom, maxZoom } = get();

      if (!panZoom) {
        return;
      }

      await fitViewport(
        {
          nodes: nodeLookup,
          width,
          height,
          panZoom,
          minZoom,
          maxZoom,
        },
        fitViewOptions
      );

      fitViewResolver?.resolve(true);
      /**
       * wait for the fitViewport to resolve before deleting the resolver,
       * we want to reuse the old resolver if the user calls fitView again in the mean time
       */
      set({ fitViewResolver: null });
    }

    // seed the incident-edge map from the initial edges so a node measurement that fires before the
    // first setEdges still re-paths its edges (setEdges rebuilds it on every later change)
    rebuildIncidentEdges(defaultEdges ?? edges ?? []);

    return {
      ...getInitialState({
        nodes,
        edges,
        width,
        height,
        fitView,
        fitViewOptions,
        minZoom,
        maxZoom,
        nodeOrigin,
        nodeExtent,
        defaultNodes,
        defaultEdges,
        zIndexMode,
      }),
      setNodes: (nodes: Node[]) => {
        const {
          nodeLookup,
          parentLookup,
          nodeOrigin,
          elevateNodesOnSelect,
          fitViewQueued,
          zIndexMode,
          nodesSelectionActive,
        } = get();

        /*
         * setNodes() is called exclusively in response to user actions:
         * - either when the `<ReactFlow nodes>` prop is updated in the controlled ReactFlow setup,
         * - or when the user calls something like `reactFlowInstance.setNodes()` in an uncontrolled ReactFlow setup.
         *
         * When this happens, we take the note objects passed by the user and extend them with fields
         * relevant for internal React Flow operations.
         */

        const { nodesInitialized, hasSelectedNodes, changedIds } = adoptUserNodes(nodes, nodeLookup, parentLookup, {
          nodeOrigin,
          nodeExtent,
          elevateNodesOnSelect,
          checkEquality: true,
          zIndexMode,
          // self-gates via canIncrementalAdopt and falls back to the full rebuild
          incremental: true,
        });

        const nextNodesSelectionActive = nodesSelectionActive && hasSelectedNodes;

        if (fitViewQueued && nodesInitialized) {
          resolveFitView();
          set({
            nodes,
            nodesInitialized,
            fitViewQueued: false,
            fitViewOptions: undefined,
            nodesSelectionActive: nextNodesSelectionActive
          });
        } else {
          set({ nodes, nodesInitialized, nodesSelectionActive: nextNodesSelectionActive });
        }

        // a full rebuild (changedIds === undefined, e.g. a structural change, or a parented graph
        // under `auto` zIndexMode or child-before-parent ordering) may have moved culled nodes in
        // its parent cascade, so flag it and let visible edges to those nodes still re-path under
        // onlyRenderVisibleElements.
        notifyNodes(changedIds, true);
      },
      setEdges: (edges: Edge[]) => {
        const { connectionLookup, edgeLookup } = get();

        updateConnectionLookup(connectionLookup, edgeLookup, edges);
        rebuildIncidentEdges(edges);

        set({ edges });
      },
      setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
        if (nodes) {
          const { setNodes } = get();
          setNodes(nodes);
          set({ hasDefaultNodes: true });
        }
        if (edges) {
          const { setEdges } = get();
          setEdges(edges);
          set({ hasDefaultEdges: true });
        }
      },
      /*
       * Every node gets registered at a ResizeObserver. Whenever a node
       * changes its dimensions, this function is called to measure the
       * new dimensions and update the nodes.
       */
      updateNodeInternals: (updates) => {
        const {
          triggerNodeChanges,
          nodeLookup,
          parentLookup,
          domNode,
          nodeOrigin,
          nodeExtent,
          debug,
          fitViewQueued,
          zIndexMode,
        } = get();

        const { changes, updatedInternals } = updateNodeInternalsSystem(
          updates,
          nodeLookup,
          parentLookup,
          domNode,
          nodeOrigin,
          nodeExtent,
          zIndexMode
        );

        if (!updatedInternals) {
          return;
        }

        updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin, nodeExtent, zIndexMode });

        if (fitViewQueued) {
          resolveFitView();
          set({ fitViewQueued: false, fitViewOptions: undefined });
        } else {
          // we always want to trigger useStore calls whenever updateNodeInternals is called
          set({});
        }

        // measuring a parent re-clamps its extent-bound children, which may be culled, so re-path
        // their visible edges too
        notifyNodes(undefined, true);

        if (changes?.length > 0) {
          if (debug) {
            console.log('React Flow: trigger node changes', changes);
          }
          triggerNodeChanges?.(changes);
        }
      },
      updateNodePositions: (nodeDragItems, dragging = false) => {
        const parentExpandChildren: ParentExpandChild[] = [];
        let changes = [];
        const { nodeLookup, triggerNodeChanges, connection, updateConnection, onNodesChangeMiddlewareMap } = get();

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

          if (node && connection.inProgress && connection.fromNode.id === node.id) {
            const updatedFrom = getHandlePosition(node, connection.fromHandle, Position.Left, true);
            updateConnection({ ...connection, from: updatedFrom });
          }

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
          const { parentLookup, nodeOrigin } = get();
          const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
          changes.push(...parentExpandChanges);
        }

        for (const middleware of onNodesChangeMiddlewareMap.values()) {
          changes = middleware(changes);
        }

        triggerNodeChanges(changes);
      },
      triggerNodeChanges: (changes) => {
        const { onNodesChange, setNodes, nodes, hasDefaultNodes, debug } = get();

        if (changes?.length) {
          if (hasDefaultNodes) {
            const updatedNodes = applyNodeChanges(changes, nodes);
            setNodes(updatedNodes);
          }

          if (debug) {
            console.log('React Flow: trigger node changes', changes);
          }

          onNodesChange?.(changes);
        }
      },
      triggerEdgeChanges: (changes) => {
        const { onEdgesChange, setEdges, edges, hasDefaultEdges, debug } = get();

        if (changes?.length) {
          if (hasDefaultEdges) {
            const updatedEdges = applyEdgeChanges(changes, edges);
            setEdges(updatedEdges);
          }

          if (debug) {
            console.log('React Flow: trigger edge changes', changes);
          }

          onEdgesChange?.(changes);
        }
      },
      addSelectedNodes: (selectedNodeIds) => {
        const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();

        if (multiSelectionActive) {
          const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
          triggerNodeChanges(nodeChanges);
          return;
        }

        triggerNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds]), true));
        triggerEdgeChanges(getSelectionChanges(edgeLookup));
      },
      addSelectedEdges: (selectedEdgeIds) => {
        const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();

        if (multiSelectionActive) {
          const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
          triggerEdgeChanges(changedEdges);
          return;
        }

        triggerEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
        triggerNodeChanges(getSelectionChanges(nodeLookup, new Set(), true));
      },
      unselectNodesAndEdges: ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
        const { edges: storeEdges, nodes: storeNodes, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = get();
        const nodesToUnselect = nodes ? nodes : storeNodes;
        const edgesToUnselect = edges ? edges : storeEdges;

        const nodeChanges: NodeSelectionChange[] = [];

        for (const node of nodesToUnselect) {
          if (!node.selected) {
            continue; // skip changing nodes that are not selected
          }

          const internalNode = nodeLookup.get(node.id);

          if (internalNode) {
            /*
             * we need to unselect the internal node that was selected previously before we
             * send the change to the user to prevent it to be selected while dragging the new node
             */
            internalNode.selected = false;
          }

          nodeChanges.push(createSelectionChange(node.id, false));
        }

        const edgeChanges: EdgeSelectionChange[] = [];

        for (const edge of edgesToUnselect) {
          if (!edge.selected) {
            continue; // skip changing edges that are not selected
          }

          edgeChanges.push(createSelectionChange(edge.id, false));
        }

        triggerNodeChanges(nodeChanges);
        triggerEdgeChanges(edgeChanges);
      },
      setMinZoom: (minZoom) => {
        const { panZoom, maxZoom } = get();
        panZoom?.setScaleExtent([minZoom, maxZoom]);

        set({ minZoom });
      },
      setMaxZoom: (maxZoom) => {
        const { panZoom, minZoom } = get();
        panZoom?.setScaleExtent([minZoom, maxZoom]);

        set({ maxZoom });
      },
      setTranslateExtent: (translateExtent) => {
        get().panZoom?.setTranslateExtent(translateExtent);

        set({ translateExtent });
      },
      resetSelectedElements: () => {
        const { edges, nodes, triggerNodeChanges, triggerEdgeChanges, elementsSelectable } = get();

        if (!elementsSelectable) {
          return;
        }

        const nodeChanges = nodes.reduce<NodeSelectionChange[]>(
          (res, node) => (node.selected ? [...res, createSelectionChange(node.id, false)] : res),
          []
        );
        const edgeChanges = edges.reduce<EdgeSelectionChange[]>(
          (res, edge) => (edge.selected ? [...res, createSelectionChange(edge.id, false)] : res),
          []
        );

        triggerNodeChanges(nodeChanges);
        triggerEdgeChanges(edgeChanges);
      },
      setNodeExtent: (nextNodeExtent) => {
        const { nodes, nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodeExtent, zIndexMode } = get();

        if (
          nextNodeExtent[0][0] === nodeExtent[0][0] &&
          nextNodeExtent[0][1] === nodeExtent[0][1] &&
          nextNodeExtent[1][0] === nodeExtent[1][0] &&
          nextNodeExtent[1][1] === nodeExtent[1][1]
        ) {
          return;
        }

        adoptUserNodes(nodes, nodeLookup, parentLookup, {
          nodeOrigin,
          nodeExtent: nextNodeExtent,
          elevateNodesOnSelect,
          checkEquality: false,
          zIndexMode,
        });

        set({ nodeExtent: nextNodeExtent });
        // re-clamping to the new extent can move any node, including culled ones
        notifyNodes(undefined, true);
      },
      panBy: (delta): Promise<boolean> => {
        const { transform, width, height, panZoom, translateExtent } = get();

        return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
      },
      setCenter: async (x, y, options) => {
        const { width, height, maxZoom, panZoom } = get();

        if (!panZoom) {
          return false;
        }

        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;

        await panZoom.setViewport(
          {
            x: width / 2 - x * nextZoom,
            y: height / 2 - y * nextZoom,
            zoom: nextZoom,
          },
          { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
        );

        return true;
      },
      cancelConnection: () => {
        set({
          connection: { ...initialConnection },
        });
      },
      updateConnection: (connection) => {
        set({ connection });
      },

      reset: () => {
        // clear the per-node/edge prev + incident maps so the next notify re-detects against the
        // fresh graph instead of dead node references (versions stay monotonic on purpose)
        incidentEdges.clear();
        prevNodeRef.clear();
        prevIsParent.clear();
        set({ ...getInitialState() });
      },
      subscribeNode,
      getNodeVersion,
      subscribeEdge,
      getEdgeVersion,
    };
  }, Object.is);

export { createStore };

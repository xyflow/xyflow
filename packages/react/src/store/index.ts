import { createWithEqualityFn } from 'zustand/traditional';
import {
  getFitViewNodes,
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
  initialConnection,
  NodeOrigin,
  CoordinateExtent,
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
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}) =>
  createWithEqualityFn<ReactFlowState>(
    (set, get) => ({
      ...getInitialState({ nodes, edges, width, height, fitView, nodeOrigin, nodeExtent, defaultNodes, defaultEdges }),
      setNodes: (nodes: Node[]) => {
        const { nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect } = get();
        /*
         * setNodes() is called exclusively in response to user actions:
         * - either when the `<ReactFlow nodes>` prop is updated in the controlled ReactFlow setup,
         * - or when the user calls something like `reactFlowInstance.setNodes()` in an uncontrolled ReactFlow setup.
         *
         * When this happens, we take the note objects passed by the user and extend them with fields
         * relevant for internal React Flow operations.
         */
        adoptUserNodes(nodes, nodeLookup, parentLookup, {
          nodeOrigin,
          nodeExtent,
          elevateNodesOnSelect,
          checkEquality: true,
        });

        set({ nodes });
      },
      setEdges: (edges: Edge[]) => {
        const { connectionLookup, edgeLookup } = get();

        updateConnectionLookup(connectionLookup, edgeLookup, edges);

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
       * Every node gets registerd at a ResizeObserver. Whenever a node
       * changes its dimensions, this function is called to measure the
       * new dimensions and update the nodes.
       */
      updateNodeInternals: (updates, params = { triggerFitView: true }) => {
        const {
          triggerNodeChanges,
          nodeLookup,
          parentLookup,
          fitViewOnInit,
          fitViewDone,
          fitViewOnInitOptions,
          domNode,
          nodeOrigin,
          nodeExtent,
          debug,
          fitViewSync,
        } = get();

        const { changes, updatedInternals } = updateNodeInternalsSystem(
          updates,
          nodeLookup,
          parentLookup,
          domNode,
          nodeOrigin,
          nodeExtent
        );

        if (!updatedInternals) {
          return;
        }

        updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin, nodeExtent });

        if (params.triggerFitView) {
          // we call fitView once initially after all dimensions are set
          let nextFitViewDone = fitViewDone;

          if (!fitViewDone && fitViewOnInit) {
            nextFitViewDone = fitViewSync({
              ...fitViewOnInitOptions,
              nodes: fitViewOnInitOptions?.nodes,
            });
          }

          /*
           * here we are cirmumventing the onNodesChange handler
           * in order to be able to display nodes even if the user
           * has not provided an onNodesChange handler.
           * Nodes are only rendered if they have a width and height
           * attribute which they get from this handler.
           */
          set({ fitViewDone: nextFitViewDone });
        } else {
          // we always want to trigger useStore calls whenever updateNodeInternals is called
          set({});
        }

        if (changes?.length > 0) {
          if (debug) {
            console.log('React Flow: trigger node changes', changes);
          }
          triggerNodeChanges?.(changes);
        }
      },
      updateNodePositions: (nodeDragItems, dragging = false) => {
        const parentExpandChildren: ParentExpandChild[] = [];
        const changes = [];

        for (const [id, dragItem] of nodeDragItems) {
          // we are using the nodelookup to be sure to use the current expandParent and parentId value
          const node = get().nodeLookup.get(id);
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

          if (expandParent) {
            parentExpandChildren.push({
              id,
              parentId: node.parentId!,
              rect: {
                ...dragItem.internals.positionAbsolute,
                width: dragItem.measured.width!,
                height: dragItem.measured.height!,
              },
            });
          }

          changes.push(change);
        }

        if (parentExpandChildren.length > 0) {
          const { nodeLookup, parentLookup, nodeOrigin } = get();
          const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
          changes.push(...parentExpandChanges);
        }

        get().triggerNodeChanges(changes);
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
      setPaneClickDistance: (clickDistance) => {
        get().panZoom?.setClickDistance(clickDistance);
      },
      resetSelectedElements: () => {
        const { edges, nodes, triggerNodeChanges, triggerEdgeChanges } = get();

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
        const { nodes, nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodeExtent } = get();

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
        });

        set({ nodeExtent: nextNodeExtent });
      },
      panBy: (delta): Promise<boolean> => {
        const { transform, width, height, panZoom, translateExtent } = get();

        return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
      },
      fitView: (options?: FitViewOptions): Promise<boolean> => {
        const { panZoom, width, height, minZoom, maxZoom, nodeLookup } = get();

        if (!panZoom) {
          return Promise.resolve(false);
        }

        const fitViewNodes = getFitViewNodes(nodeLookup, options);

        return fitViewSystem(
          {
            nodes: fitViewNodes,
            width,
            height,
            panZoom,
            minZoom,
            maxZoom,
          },
          options
        );
      },
      /*
       * we can't call an asnychronous function in updateNodeInternals
       * for that we created this sync version of fitView
       */
      fitViewSync: (options?: FitViewOptions): boolean => {
        const { panZoom, width, height, minZoom, maxZoom, nodeLookup } = get();

        if (!panZoom) {
          return false;
        }

        const fitViewNodes = getFitViewNodes(nodeLookup, options);

        fitViewSystem(
          {
            nodes: fitViewNodes,
            width,
            height,
            panZoom,
            minZoom,
            maxZoom,
          },
          options
        );

        return fitViewNodes.size > 0;
      },
      cancelConnection: () => {
        set({
          connection: { ...initialConnection },
        });
      },
      updateConnection: (connection) => {
        set({ connection });
      },

      reset: () => set({ ...getInitialState() }),
    }),
    Object.is
  );

export { createStore };

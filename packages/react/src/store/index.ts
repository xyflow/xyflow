import { createWithEqualityFn } from 'zustand/traditional';
import {
  clampPosition,
  fitView as fitViewSystem,
  updateNodes,
  updateAbsolutePositions,
  panBy as panBySystem,
  Dimensions,
  updateNodeDimensions as updateNodeDimensionsSystem,
} from '@xyflow/system';

import { applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import { updateNodesAndEdgesSelections } from './utils';
import getInitialState from './initialState';
import type {
  ReactFlowState,
  Node,
  Edge,
  NodeDimensionChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  NodePositionChange,
  UnselectNodesAndEdgesParams,
  FitViewOptions,
} from '../types';

const createRFStore = ({
  nodes,
  edges,
  width,
  height,
  fitView,
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}) =>
  createWithEqualityFn<ReactFlowState>(
    (set, get) => ({
      ...getInitialState({ nodes, edges, width, height, fitView }),
      setNodes: (nodes: Node[]) => {
        const { nodeLookup, nodeOrigin, elevateNodesOnSelect } = get();
        // Whenver new nodes are set, we need to calculate the absolute positions of the nodes
        // and update the nodeLookup.
        const nextNodes = updateNodes(nodes, nodeLookup, { nodeOrigin, elevateNodesOnSelect });

        set({ nodes: nextNodes });
      },
      setEdges: (edges: Edge[]) => {
        const { defaultEdgeOptions = {} } = get();
        set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
      },
      // when the user works with an uncontrolled flow,
      // we set a flag `hasDefaultNodes` / `hasDefaultEdges`
      setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
        const hasDefaultNodes = typeof nodes !== 'undefined';
        const hasDefaultEdges = typeof edges !== 'undefined';

        const nextState: {
          nodes?: Node[];
          edges?: Edge[];
          hasDefaultNodes: boolean;
          hasDefaultEdges: boolean;
        } = {
          hasDefaultNodes,
          hasDefaultEdges,
        };

        if (hasDefaultNodes) {
          nextState.nodes = updateNodes(nodes, new Map(), {
            nodeOrigin: get().nodeOrigin,
            elevateNodesOnSelect: get().elevateNodesOnSelect,
          });
        }
        if (hasDefaultEdges) {
          nextState.edges = edges;
        }

        set(nextState);
      },
      // Every node gets registerd at a ResizeObserver. Whenever a node
      // changes its dimensions, this function is called to measure the
      // new dimensions and update the nodes.
      updateNodeDimensions: (updates) => {
        const {
          onNodesChange,
          fitView,
          nodes,
          nodeLookup,
          fitViewOnInit,
          fitViewDone,
          fitViewOnInitOptions,
          domNode,
          nodeOrigin,
        } = get();
        const changes: NodeDimensionChange[] = [];

        const updatedNodes = updateNodeDimensionsSystem(
          updates,
          nodes,
          nodeLookup,
          domNode,
          nodeOrigin,
          (id: string, dimensions: Dimensions) => {
            changes.push({
              id: id,
              type: 'dimensions',
              dimensions,
            });
          }
        );

        if (!updatedNodes) {
          return;
        }

        const nextNodes = updateAbsolutePositions(updatedNodes, nodeLookup, nodeOrigin);

        // we call fitView once initially after all dimensions are set
        let nextFitViewDone = fitViewDone;
        if (!fitViewDone && fitViewOnInit) {
          nextFitViewDone = fitView(nextNodes, {
            ...fitViewOnInitOptions,
            nodes: fitViewOnInitOptions?.nodes || nextNodes,
          });
        }

        // here we are cirmumventing the onNodesChange handler
        // in order to be able to display nodes even if the user
        // has not provided an onNodesChange handler.
        // Nodes are only rendered if they have a width and height
        // attribute which they get from this handler.
        set({ nodes: nextNodes, fitViewDone: nextFitViewDone });

        if (changes?.length > 0) {
          onNodesChange?.(changes);
        }
      },
      updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
        const changes = nodeDragItems.map((node) => {
          const change: NodePositionChange = {
            id: node.id,
            type: 'position',
            dragging,
          };

          if (positionChanged) {
            change.positionAbsolute = node.positionAbsolute;
            change.position = node.position;
          }

          return change;
        });

        get().triggerNodeChanges(changes);
      },

      triggerNodeChanges: (changes) => {
        const { onNodesChange, nodeLookup, nodes, hasDefaultNodes, nodeOrigin, elevateNodesOnSelect } = get();

        if (changes?.length) {
          if (hasDefaultNodes) {
            const updatedNodes = applyNodeChanges(changes, nodes);
            const nextNodes = updateNodes(updatedNodes, nodeLookup, {
              nodeOrigin,
              elevateNodesOnSelect,
            });
            set({ nodes: nextNodes });
          }

          onNodesChange?.(changes);
        }
      },

      addSelectedNodes: (selectedNodeIds) => {
        const { multiSelectionActive, edges, nodes } = get();
        let changedNodes: NodeSelectionChange[];
        let changedEdges: EdgeSelectionChange[] | null = null;

        if (multiSelectionActive) {
          changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true)) as NodeSelectionChange[];
        } else {
          changedNodes = getSelectionChanges(nodes, selectedNodeIds);
          changedEdges = getSelectionChanges(edges, []);
        }

        updateNodesAndEdgesSelections({
          changedNodes,
          changedEdges,
          get,
          set,
        });
      },
      addSelectedEdges: (selectedEdgeIds) => {
        const { multiSelectionActive, edges, nodes } = get();
        let changedEdges: EdgeSelectionChange[];
        let changedNodes: NodeSelectionChange[] | null = null;

        if (multiSelectionActive) {
          changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true)) as EdgeSelectionChange[];
        } else {
          changedEdges = getSelectionChanges(edges, selectedEdgeIds);
          changedNodes = getSelectionChanges(nodes, []);
        }

        updateNodesAndEdgesSelections({
          changedNodes,
          changedEdges,
          get,
          set,
        });
      },
      unselectNodesAndEdges: ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
        const { edges: storeEdges, nodes: storeNodes } = get();
        const nodesToUnselect = nodes ? nodes : storeNodes;
        const edgesToUnselect = edges ? edges : storeEdges;

        const changedNodes = nodesToUnselect.map((n) => {
          n.selected = false;
          return createSelectionChange(n.id, false);
        }) as NodeSelectionChange[];
        const changedEdges = edgesToUnselect.map((edge) =>
          createSelectionChange(edge.id, false)
        ) as EdgeSelectionChange[];

        updateNodesAndEdgesSelections({
          changedNodes,
          changedEdges,
          get,
          set,
        });
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
        const { edges, nodes } = get();

        const nodesToUnselect = nodes
          .filter((e) => e.selected)
          .map((n) => createSelectionChange(n.id, false)) as NodeSelectionChange[];
        const edgesToUnselect = edges
          .filter((e) => e.selected)
          .map((e) => createSelectionChange(e.id, false)) as EdgeSelectionChange[];

        updateNodesAndEdgesSelections({
          changedNodes: nodesToUnselect,
          changedEdges: edgesToUnselect,
          get,
          set,
        });
      },
      setNodeExtent: (nodeExtent) => {
        const { nodes } = get();

        set({
          nodeExtent,
          nodes: nodes.map((node) => {
            const positionAbsolute = clampPosition(node.position, nodeExtent);

            return {
              ...node,
              positionAbsolute,
            };
          }),
        });
      },
      panBy: (delta): boolean => {
        const { transform, width, height, panZoom, translateExtent } = get();
        return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
      },
      fitView: (nodes: Node[], options?: FitViewOptions): boolean => {
        const { panZoom, width, height, minZoom, maxZoom, nodeOrigin } = get();

        if (!panZoom) {
          return false;
        }

        return fitViewSystem(
          {
            nodes,
            width,
            height,
            panZoom,
            minZoom,
            maxZoom,
            nodeOrigin,
          },
          options
        );
      },
      cancelConnection: () =>
        set({
          connectionStatus: null,
          connectionStartHandle: null,
          connectionEndHandle: null,
        }),
      updateConnection: (params) => {
        const { connectionStatus, connectionStartHandle, connectionEndHandle, connectionPosition } = get();

        const currentConnection = {
          connectionPosition: params.connectionPosition ?? connectionPosition,
          connectionStatus: params.connectionStatus ?? connectionStatus,
          connectionStartHandle: params.connectionStartHandle ?? connectionStartHandle,
          connectionEndHandle: params.connectionEndHandle ?? connectionEndHandle,
        };

        set(currentConnection);
      },
      reset: () => {
        // @todo: what should we do about this? Do we still need it?
        // if you are on a SPA with multiple flows, we want to make sure that the store gets resetted
        // when you switch pages. Does this reset solves this? Currently it always gets called. This
        // leads to an emtpy nodes array at the beginning.
        // set({ ...getInitialState() });
      },
    }),
    Object.is
  );

export { createRFStore };

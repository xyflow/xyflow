import create from 'zustand';
import createContext from 'zustand/context';

import { clampPosition, getDimensions } from '../utils';
import { applyNodeChanges } from '../utils/changes';

import {
  ReactFlowState,
  Node,
  Edge,
  NodeDimensionUpdate,
  NodeDiffUpdate,
  CoordinateExtent,
  NodeDimensionChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  NodePositionChange,
} from '../types';
import { getHandleBounds } from '../components/Nodes/utils';
import { createSelectionChange, getSelectionChanges } from '../utils/changes';
import {
  createNodeInternals,
  createPositionChange,
  handleControlledEdgeSelectionChange,
  handleControlledNodeSelectionChange,
  isParentSelected,
  fitView,
} from './utils';
import initialState from './initialState';

const { Provider, useStore, useStoreApi } = createContext<ReactFlowState>();

const createStore = () =>
  create<ReactFlowState>((set, get) => ({
    ...initialState,
    setNodes: (nodes: Node[]) => {
      set({ nodeInternals: createNodeInternals(nodes, get().nodeInternals) });
    },
    setEdges: (edges: Edge[]) => {
      const { defaultEdgeOptions } = get();

      if (defaultEdgeOptions) {
        set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
      } else {
        set({ edges });
      }
    },
    setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
      const hasDefaultNodes = typeof nodes !== 'undefined';
      const hasDefaultEdges = typeof edges !== 'undefined';

      const nodeInternals = hasDefaultNodes ? createNodeInternals(nodes, new Map()) : new Map();
      const nextEdges = hasDefaultEdges ? edges : [];

      set({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const { onNodesChange, transform, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions } = get();

      const changes: NodeDimensionChange[] = updates.reduce<NodeDimensionChange[]>((res, update) => {
        const node = nodeInternals.get(update.id);

        if (node) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate = !!(
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate)
          );

          if (doUpdate) {
            const handleBounds = getHandleBounds(update.nodeElement, transform[2]);
            nodeInternals.set(node.id, {
              ...node,
              handleBounds,
              ...dimensions,
            });

            res.push({
              id: node.id,
              type: 'dimensions',
              dimensions,
            });
          }
        }

        return res;
      }, []);

      const nextFitViewOnInitDone =
        fitViewOnInitDone ||
        (fitViewOnInit && !fitViewOnInitDone && fitView(get, { initial: true, ...fitViewOnInitOptions }));
      set({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });

      if (changes?.length > 0) {
        onNodesChange?.(changes);
      }
    },
    updateNodePosition: ({ id, diff, dragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodeExtent, nodeInternals, hasDefaultNodes } = get();

      if (hasDefaultNodes || onNodesChange) {
        const changes: NodePositionChange[] = [];

        nodeInternals.forEach((node) => {
          if (node.selected) {
            if (!node.parentNode || !isParentSelected(node, nodeInternals)) {
              changes.push(createPositionChange({ node, diff, dragging, nodeExtent, nodeInternals }));
            }
          } else if (node.id === id) {
            changes.push(createPositionChange({ node, diff, dragging, nodeExtent, nodeInternals }));
          }
        });

        if (changes?.length) {
          if (hasDefaultNodes) {
            const nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
            const nextNodeInternals = createNodeInternals(nodes, nodeInternals);
            set({ nodeInternals: nextNodeInternals });
          }

          onNodesChange?.(changes);
        }
      }
    },
    // @TODO: can we unify addSelectedNodes and addSelectedEdges somehow?
    addSelectedNodes: (selectedNodeIds: string[]) => {
      const {
        multiSelectionActive,
        onNodesChange,
        nodeInternals,
        hasDefaultNodes,
        onEdgesChange,
        hasDefaultEdges,
        edges,
      } = get();
      let changedNodes: NodeSelectionChange[];
      let changedEdges: EdgeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true)) as NodeSelectionChange[];
      } else {
        changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), selectedNodeIds);
        changedEdges = getSelectionChanges(edges, []);
      }

      if (changedNodes.length) {
        if (hasDefaultNodes) {
          set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
        }

        onNodesChange?.(changedNodes);
      }

      if (changedEdges?.length) {
        if (hasDefaultEdges) {
          set({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
        }

        onEdgesChange?.(changedEdges);
      }
    },
    addSelectedEdges: (selectedEdgeIds: string[]) => {
      const {
        multiSelectionActive,
        onEdgesChange,
        edges,
        hasDefaultEdges,
        nodeInternals,
        hasDefaultNodes,
        onNodesChange,
      } = get();
      let changedEdges: EdgeSelectionChange[];
      let changedNodes: NodeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true)) as EdgeSelectionChange[];
      } else {
        changedEdges = getSelectionChanges(edges, selectedEdgeIds);
        changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), []);
      }

      if (changedEdges.length) {
        if (hasDefaultEdges) {
          set({
            edges: handleControlledEdgeSelectionChange(changedEdges, edges),
          });
        }
        onEdgesChange?.(changedEdges);
      }

      if (changedNodes?.length) {
        if (hasDefaultNodes) {
          set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
        }

        onNodesChange?.(changedNodes);
      }
    },
    unselectNodesAndEdges: () => {
      const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();
      const nodes = Array.from(nodeInternals.values());

      const nodesToUnselect = nodes.map((n) => {
        n.selected = false;
        return createSelectionChange(n.id, false);
      }) as NodeSelectionChange[];
      const edgesToUnselect = edges.map((edge) => createSelectionChange(edge.id, false)) as EdgeSelectionChange[];

      if (nodesToUnselect.length) {
        if (hasDefaultNodes) {
          set({ nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals) });
        }
        onNodesChange?.(nodesToUnselect);
      }
      if (edgesToUnselect.length) {
        if (hasDefaultEdges) {
          set({
            edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges),
          });
        }
        onEdgesChange?.(edgesToUnselect);
      }
    },

    setMinZoom: (minZoom: number) => {
      const { d3Zoom, maxZoom } = get();
      d3Zoom?.scaleExtent([minZoom, maxZoom]);

      set({ minZoom });
    },
    setMaxZoom: (maxZoom: number) => {
      const { d3Zoom, minZoom } = get();
      d3Zoom?.scaleExtent([minZoom, maxZoom]);

      set({ maxZoom });
    },
    setTranslateExtent: (translateExtent: CoordinateExtent) => {
      const { d3Zoom } = get();
      d3Zoom?.translateExtent(translateExtent);

      set({ translateExtent });
    },
    resetSelectedElements: () => {
      const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get();
      const nodes = Array.from(nodeInternals.values());

      const nodesToUnselect = nodes
        .filter((e) => e.selected)
        .map((n) => createSelectionChange(n.id, false)) as NodeSelectionChange[];
      const edgesToUnselect = edges
        .filter((e) => e.selected)
        .map((e) => createSelectionChange(e.id, false)) as EdgeSelectionChange[];

      if (nodesToUnselect.length) {
        if (hasDefaultNodes) {
          set({
            nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals),
          });
        }
        onNodesChange?.(nodesToUnselect);
      }
      if (edgesToUnselect.length) {
        if (hasDefaultEdges) {
          set({
            edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges),
          });
        }
        onEdgesChange?.(edgesToUnselect);
      }
    },
    setNodeExtent: (nodeExtent: CoordinateExtent) => {
      const { nodeInternals } = get();

      nodeInternals.forEach((node) => {
        node.positionAbsolute = clampPosition(node.position, nodeExtent);
      });

      set({
        nodeExtent,
        nodeInternals: new Map(nodeInternals),
      });
    },
    reset: () => set({ ...initialState }),
  }));

export { Provider, useStore, createStore, useStoreApi };

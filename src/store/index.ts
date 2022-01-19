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
} from '../types';
import { getHandleBounds } from '../components/Nodes/utils';
import { createSelectionChange, getSelectionChanges } from '../utils/changes';
import {
  createNodeInternals,
  createPositionChange,
  fitView,
  handleControlledEdgeSelectionChange,
  handleControlledNodeSelectionChange,
  isParentSelected,
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
    setDefaultNodesAndEdges: (nodes: Node[], edges: Edge[] = []) => {
      const nodeInternals = createNodeInternals(nodes, get().nodeInternals);
      set({ nodeInternals, edges, isControlled: true });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const { onNodesChange, transform, nodeInternals, fitViewOnInit } = get();

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

      const fitViewOnInitDone = fitViewOnInit && fitView(get);
      set({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone });

      if (changes?.length > 0) {
        onNodesChange?.(changes);
      }
    },
    updateNodePosition: ({ id, diff, dragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodeExtent, nodeInternals, isControlled } = get();

      if (isControlled || onNodesChange) {
        const changes: NodeDimensionChange[] = [];

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
          if (isControlled) {
            const nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
            const nextNodeInternals = createNodeInternals(nodes, nodeInternals);
            set({ nodeInternals: nextNodeInternals });
          } else {
            onNodesChange?.(changes);
          }
        }
      }
    },
    addSelectedNodes: (selectedNodeIds: string[]) => {
      const { multiSelectionActive, onNodesChange, nodeInternals, isControlled } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      let changedNodes: NodeSelectionChange[];

      if (multiSelectionActive) {
        changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true)) as NodeSelectionChange[];
      } else {
        changedNodes = getSelectionChanges(nodes, selectedNodeIds);
      }

      if (changedNodes.length) {
        if (isControlled) {
          set({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
        } else if (onNodesChange) {
          onNodesChange(changedNodes);
        }
      }
    },
    addSelectedEdges: (selectedEdgeIds: string[]) => {
      const { multiSelectionActive, onEdgesChange, edges, isControlled } = get();

      let changedEdges: EdgeSelectionChange[];

      if (multiSelectionActive) {
        changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true)) as EdgeSelectionChange[];
      } else {
        changedEdges = getSelectionChanges(edges, selectedEdgeIds);
      }

      if (changedEdges.length) {
        if (isControlled) {
          set({
            edges: handleControlledEdgeSelectionChange(changedEdges, edges),
          });
        } else if (onEdgesChange) {
          onEdgesChange(changedEdges);
        }
      }
    },
    unselectNodesAndEdges: () => {
      const { nodeInternals, edges, onNodesChange, onEdgesChange, isControlled } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);

      const nodesToUnselect = nodes.map((n) => {
        n.selected = false;
        return createSelectionChange(n.id, false);
      }) as NodeSelectionChange[];
      const edgesToUnselect = edges.map((edge) => createSelectionChange(edge.id, false)) as EdgeSelectionChange[];

      if (nodesToUnselect.length) {
        if (isControlled) {
          set({ nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals) });
        } else if (onNodesChange) {
          onNodesChange(nodesToUnselect);
        }
      }
      if (edgesToUnselect.length) {
        if (isControlled) {
          set({
            edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges),
          });
        } else if (onEdgesChange) {
          onEdgesChange(edgesToUnselect);
        }
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
      const { nodeInternals, edges, onNodesChange, onEdgesChange, isControlled } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals.values());

      const nodesToUnselect = nodes
        .filter((e) => e.selected)
        .map((n) => createSelectionChange(n.id, false)) as NodeSelectionChange[];
      const edgesToUnselect = edges
        .filter((e) => e.selected)
        .map((e) => createSelectionChange(e.id, false)) as EdgeSelectionChange[];

      if (nodesToUnselect.length) {
        if (isControlled) {
          set({
            nodeInternals: handleControlledNodeSelectionChange(nodesToUnselect, nodeInternals),
          });
        } else if (onNodesChange) {
          onNodesChange(nodesToUnselect);
        }
      }
      if (edgesToUnselect.length) {
        if (isControlled) {
          set({
            edges: handleControlledEdgeSelectionChange(edgesToUnselect, edges),
          });
        } else if (onEdgesChange) {
          onEdgesChange(edgesToUnselect);
        }
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

import { createMemo } from 'solid-js';
import {
  EdgeRemoveChange,
  evaluateAbsolutePosition,
  getElementsToRemove,
  getNodesBounds,
  getOverlappingArea,
  isRectObject,
  NodeRemoveChange,
  nodeToRect,
  withResolvers,
  type Rect,
} from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStore, useStoreApi } from './useStore';
import { useBatchContext } from '../components/BatchProvider';
import { elementToRemoveChange, isEdge, isNode } from '../utils';
import type {
  ReactFlowInstance,
  Node,
  Edge,
  InternalNode,
  SolidFlowState,
  GeneralHelpers,
  FitViewOptions,
} from '../types';

const selector = (s: SolidFlowState) => () => !!s.panZoom.get();

/**
 * This hook returns a ReactFlowInstance that can be used to update nodes and edges, manipulate the viewport, or query the current state of the flow.
 *
 * @public
 * @example
 * ```jsx
 *import { useCallback, useState } from 'react';
 *import { useReactFlow } from '@xyflow/solid';
 *
 *export function NodeCounter() {
 *  const reactFlow = useReactFlow();
 *  const [count, setCount] = useState(0);
 *  const countNodes = useCallback(() => {
 *    setCount(reactFlow.getNodes().length);
 *    // you need to pass it as a dependency if you are using it with useEffect or useCallback
 *    // because at the first render, it's not initialized yet and some functions might not work.
 *  }, [reactFlow]);
 *
 *  return (
 *    <div>
 *      <button onClick={countNodes}>Update count</button>
 *      <p>There are {count} nodes in the flow.</p>
 *    </div>
 *  );
 *}
 *```
 */
export function useSolidFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): ReactFlowInstance<
  NodeType,
  EdgeType
> {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();
  const batchContext = useBatchContext();
  const viewportInitialized = useStore(selector);

  const generalHelper = createMemo<GeneralHelpers<NodeType, EdgeType>>(() => {
    const getInternalNode: GeneralHelpers<NodeType, EdgeType>['getInternalNode'] = (id) =>
      store.nodeLookup.get(id) as InternalNode<NodeType>;

    const setNodes: GeneralHelpers<NodeType, EdgeType>['setNodes'] = (payload) => {
      batchContext.nodeQueue.push(payload as NodeType[]);
    };

    const setEdges: GeneralHelpers<NodeType, EdgeType>['setEdges'] = (payload) => {
      batchContext.edgeQueue.push(payload as EdgeType[]);
    };

    const getNodeRect = (node: NodeType | { id: string }): Rect | null => {
      const { nodeLookup, nodeOrigin } = store;

      const nodeToUse = isNode<NodeType>(node) ? node : nodeLookup.get(node.id)!;
      const position = nodeToUse.parentId
        ? evaluateAbsolutePosition(
            nodeToUse.position,
            nodeToUse.measured,
            nodeToUse.parentId,
            nodeLookup,
            nodeOrigin.get()
          )
        : nodeToUse.position;

      const nodeWithPosition = {
        ...nodeToUse,
        position,
        width: nodeToUse.measured?.width ?? nodeToUse.width,
        height: nodeToUse.measured?.height ?? nodeToUse.height,
      };

      return nodeToRect(nodeWithPosition);
    };

    const updateNode: GeneralHelpers<NodeType, EdgeType>['updateNode'] = (
      id,
      nodeUpdate,
      options = { replace: false }
    ) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === id) {
            const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node) : nodeUpdate;
            return options.replace && isNode(nextNode) ? (nextNode as NodeType) : { ...node, ...nextNode };
          }

          return node;
        })
      );
    };

    const updateEdge: GeneralHelpers<NodeType, EdgeType>['updateEdge'] = (
      id,
      edgeUpdate,
      options = { replace: false }
    ) => {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          if (edge.id === id) {
            const nextEdge = typeof edgeUpdate === 'function' ? edgeUpdate(edge) : edgeUpdate;
            return options.replace && isEdge(nextEdge) ? (nextEdge as EdgeType) : { ...edge, ...nextEdge };
          }

          return edge;
        })
      );
    };

    return {
      getNodes: () => store.nodes.get().map((n) => ({ ...n })) as NodeType[],
      getNode: (id) => getInternalNode(id)?.internals.userNode as NodeType,
      getInternalNode,
      getEdges: () => {
        const { edges } = store;
        return edges.get().map((e) => ({ ...e })) as EdgeType[];
      },
      getEdge: (id) => store.edgeLookup.get(id) as EdgeType,
      setNodes,
      setEdges,
      addNodes: (payload) => {
        const newNodes = Array.isArray(payload) ? payload : [payload];
        batchContext.nodeQueue.push((nodes) => [...nodes, ...newNodes]);
      },
      addEdges: (payload) => {
        const newEdges = Array.isArray(payload) ? payload : [payload];
        batchContext.edgeQueue.push((edges) => [...edges, ...newEdges]);
      },
      toObject: () => {
        const { nodes, edges, transform } = store;
        const [x, y, zoom] = transform.get();
        return {
          nodes: nodes.get().map((n) => ({ ...n })) as NodeType[],
          edges: edges.get().map((e) => ({ ...e })) as EdgeType[],
          viewport: {
            x,
            y,
            zoom,
          },
        };
      },
      deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
        const {
          nodes,
          edges,
          onNodesDelete,
          onEdgesDelete,
          triggerNodeChanges,
          triggerEdgeChanges,
          onDelete,
          onBeforeDelete,
        } = store;
        const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
          nodesToRemove,
          edgesToRemove,
          nodes: nodes.get(),
          edges: edges.get(),
          onBeforeDelete: onBeforeDelete.get(),
        });

        const hasMatchingEdges = matchingEdges.length > 0;
        const hasMatchingNodes = matchingNodes.length > 0;

        if (hasMatchingEdges) {
          const edgeChanges: EdgeRemoveChange[] = matchingEdges.map(elementToRemoveChange);

          onEdgesDelete.get()?.(matchingEdges);
          triggerEdgeChanges(edgeChanges);
        }

        if (hasMatchingNodes) {
          const nodeChanges: NodeRemoveChange[] = matchingNodes.map(elementToRemoveChange);

          onNodesDelete.get()?.(matchingNodes);
          triggerNodeChanges(nodeChanges);
        }

        if (hasMatchingNodes || hasMatchingEdges) {
          onDelete.get()?.({ nodes: matchingNodes, edges: matchingEdges });
        }

        return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
      },
      getIntersectingNodes: (nodeOrRect, partially = true, nodes) => {
        const isRect = isRectObject(nodeOrRect);
        const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
        const hasNodesOption = nodes !== undefined;

        if (!nodeRect) {
          return [];
        }

        return (nodes || store.nodes.get()).filter((n) => {
          const internalNode = store.nodeLookup.get(n.id);

          if (internalNode && !isRect && (n.id === nodeOrRect.id || !internalNode.internals.positionAbsolute)) {
            return false;
          }

          const currNodeRect = nodeToRect(hasNodesOption ? n : internalNode!);
          const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
          const partiallyVisible = partially && overlappingArea > 0;

          return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
        }) as NodeType[];
      },
      isNodeIntersecting: (nodeOrRect, area, partially = true) => {
        const isRect = isRectObject(nodeOrRect);
        const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

        if (!nodeRect) {
          return false;
        }

        const overlappingArea = getOverlappingArea(nodeRect, area);
        const partiallyVisible = partially && overlappingArea > 0;

        return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
      },
      updateNode,
      updateNodeData: (id, dataUpdate, options = { replace: false }) => {
        updateNode(
          id,
          (node) => {
            const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;
            return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
          },
          options
        );
      },
      updateEdge,
      updateEdgeData: (id, dataUpdate, options = { replace: false }) => {
        updateEdge(
          id,
          (edge) => {
            const nextData = typeof dataUpdate === 'function' ? dataUpdate(edge) : dataUpdate;
            return options.replace ? { ...edge, data: nextData } : { ...edge, data: { ...edge.data, ...nextData } };
          },
          options
        );
      },
      getNodesBounds: (nodes: (NodeType | InternalNode | string)[]): Rect => {
        const { nodeLookup, nodeOrigin } = store;
        return getNodesBounds(nodes, { nodeLookup, nodeOrigin: nodeOrigin.get() });
      },
      getHandleConnections: ({ type, id, nodeId }) =>
        Array.from(store.connectionLookup.get(`${nodeId}-${type}${id ? `-${id}` : ''}`)?.values() ?? []),
      getNodeConnections: ({ type, handleId, nodeId }) =>
        Array.from(
          store.connectionLookup
            .get(`${nodeId}${type ? (handleId ? `-${type}-${handleId}` : `-${type}`) : ''}`)
            ?.values() ?? []
        ),
      fitView: async (options: FitViewOptions<NodeType> | undefined) => {
        // We either create a new Promise or reuse the existing one
        // Even if fitView is called multiple times in a row, we only end up with a single Promise
        const fitViewResolver = store.fitViewResolver.get() ?? withResolvers<boolean>();

        // We schedule a fitView by setting fitViewQueued and triggering a setNodes
        store.fitViewQueued.set(true);
        store.fitViewOptions.set(options);
        store.fitViewResolver.set(fitViewResolver);
        batchContext.nodeQueue.push((nodes) => [...nodes]);

        return fitViewResolver.promise;
      },
    };
  });

  return createMemo(() => ({
    ...generalHelper(),
    ...viewportHelper,
    viewportInitialized,
  }))();
}

import {
  evaluateAbsolutePosition,
  getElementsToRemove,
  getOverlappingArea,
  isRectObject,
  nodeToRect,
  type Rect,
} from '@xyflow/system';

import useViewportHelper from './useViewportHelper';
import { useStoreApi } from './useStore';
import { useBatchContext } from '../components/BatchProvider';
import { isNode } from '../utils';
import type { ReactFlowInstance, Instance, Node, Edge, InternalNode } from '../types';
import { batch } from 'solid-js';

/**
 * Hook for accessing the ReactFlow instance.
 *
 * @public
 * @returns ReactFlowInstance
 */
export function useSolidFlow<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): ReactFlowInstance<
  NodeType,
  EdgeType
> {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();
  const batchContext = useBatchContext();

  const getNodes = () => store.nodes.get().map((n) => ({ ...n })) as NodeType[];

  const getInternalNode: Instance.GetInternalNode<NodeType> = (id) =>
    store.nodeLookup.get(id) as InternalNode<NodeType>;

  const getNode: Instance.GetNode<NodeType> = (id) => getInternalNode(id)?.internals.userNode as NodeType;

  const getEdges: Instance.GetEdges<EdgeType> = () => {
    const { edges } = store;
    return edges.get().map((e) => ({ ...e })) as EdgeType[];
  };

  const getEdge: Instance.GetEdge<EdgeType> = (id) => store.edgeLookup.get(id) as EdgeType;

  const setNodes: Instance.SetNodes<NodeType> = (payload) => {
    batchContext.nodeQueue.push(payload as NodeType[]);
  };

  const setEdges: Instance.SetEdges<EdgeType> = (payload) => {
    batchContext.edgeQueue.push(payload as EdgeType[]);
  };

  const addNodes: Instance.AddNodes<NodeType> = (payload) => {
    const newNodes = Array.isArray(payload) ? payload : [payload];
    batchContext.nodeQueue.push((nodes) => [...nodes, ...newNodes]);
  };

  const addEdges: Instance.AddEdges<EdgeType> = (payload) => {
    const newEdges = Array.isArray(payload) ? payload : [payload];
    batchContext.edgeQueue.push((edges) => [...edges, ...newEdges]);
  };

  const toObject: Instance.ToObject<NodeType, EdgeType> = () => {
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
  };

  const deleteElements: Instance.DeleteElements = async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
    const {
      nodes,
      edges,
      hasDefaultNodes,
      hasDefaultEdges,
      onNodesDelete,
      onEdgesDelete,
      onNodesChange,
      onEdgesChange,
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

    console.log('matchingNodes', matchingNodes);
    console.log('matchingEdges', matchingEdges);


    return batch(() => {
      const hasMatchingEdges = matchingEdges.length > 0;
      const hasMatchingNodes = matchingNodes.length > 0;

      if (hasMatchingEdges) {
        onNodesDelete.get()?.(matchingNodes);
      }

      if (hasMatchingEdges) {
        if (hasDefaultEdges.get()) {

          const nextEdges = edges.get().filter((e) => !matchingEdges.some((mE) => mE.id === e.id));
          store.setEdges(nextEdges);
        }

        onEdgesDelete.get()?.(matchingEdges);
        onEdgesChange.get()?.(
          matchingEdges.map((edge) => ({
            id: edge.id,
            type: 'remove',
          }))
        );
      }

      if (hasMatchingNodes) {
        if (hasDefaultNodes.get()) {
          const nextNodes = nodes.get().filter((n) => !matchingNodes.some((mN) => mN.id === n.id));
          store.setNodes(nextNodes);
        }

        onNodesDelete.get()?.(matchingNodes);
        onNodesChange.get()?.(matchingNodes.map((node) => ({ id: node.id, type: 'remove' })));
      }

      if (hasMatchingNodes || hasMatchingEdges) {
        onDelete.get()?.({ nodes: matchingNodes, edges: matchingEdges });
      }

      return { deletedNodes: matchingNodes, deletedEdges: matchingEdges };
    });
  };

  const getNodeRect = (node: NodeType | { id: string }): Rect | null => {
    const { nodeLookup, nodeOrigin } = store;

    const nodeToUse = isNode<NodeType>(node) ? node : nodeLookup.get(node.id)!;
    const position = nodeToUse.parentId
      ? evaluateAbsolutePosition(nodeToUse.position, nodeToUse.parentId, nodeLookup, nodeOrigin.get())
      : nodeToUse.position;

    const nodeWithPosition = {
      id: nodeToUse.id,
      position,
      width: nodeToUse.measured?.width ?? nodeToUse.width,
      height: nodeToUse.measured?.height ?? nodeToUse.height,
      data: nodeToUse.data,
    };

    return nodeToRect(nodeWithPosition);
  };

  const getIntersectingNodes: Instance.GetIntersectingNodes<NodeType> = (nodeOrRect, partially = true, nodes) => {
    const isRect = isRectObject(nodeOrRect);
    const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);
    const hasNodesOption = nodes !== undefined;

    if (!nodeRect) {
      return [];
    }

    return (nodes || store.nodes.get()).filter((n) => {
      const internalNode = store.nodeLookup.get(n.id);

      if (internalNode && !isRect && (n.id === nodeOrRect!.id || !internalNode.internals.positionAbsolute)) {
        return false;
      }

      const currNodeRect = nodeToRect(hasNodesOption ? n : internalNode!);
      const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
      const partiallyVisible = partially && overlappingArea > 0;

      return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
    }) as NodeType[];
  };

  const isNodeIntersecting: Instance.IsNodeIntersecting<NodeType> = (nodeOrRect, area, partially = true) => {
    const isRect = isRectObject(nodeOrRect);
    const nodeRect = isRect ? nodeOrRect : getNodeRect(nodeOrRect);

    if (!nodeRect) {
      return false;
    }

    const overlappingArea = getOverlappingArea(nodeRect, area);
    const partiallyVisible = partially && overlappingArea > 0;

    return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
  };

  const updateNode: Instance.UpdateNode<NodeType> = (id, nodeUpdate, options = { replace: false }) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === id) {
          const nextNode = typeof nodeUpdate === 'function' ? nodeUpdate(node as NodeType) : nodeUpdate;
          return options.replace && isNode(nextNode) ? (nextNode as NodeType) : { ...node, ...nextNode };
        }

        return node;
      })
    );
  };

  const updateNodeData: Instance.UpdateNodeData<NodeType> = (id, dataUpdate, options = { replace: false }) => {
    updateNode(
      id,
      (node) => {
        const nextData = typeof dataUpdate === 'function' ? dataUpdate(node) : dataUpdate;
        return options.replace ? { ...node, data: nextData } : { ...node, data: { ...node.data, ...nextData } };
      },
      options
    );
  };

  return {
    ...viewportHelper,
    getNodes,
    getNode,
    getInternalNode,
    getEdges,
    getEdge,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    toObject,
    deleteElements,
    getIntersectingNodes,
    isNodeIntersecting,
    updateNode,
    updateNodeData,
  };
}

import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '../types';

/**
 * Hook for managing the state of nodes - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialNodes
 * @returns an array [nodes, setNodes, onNodesChange]
 */
export function useNodesState<NodeType extends Node>(
  initialNodes: NodeType[]
): [NodeType[], Dispatch<SetStateAction<NodeType[]>>, OnNodesChange<NodeType>] {
  const [nodes, setNodes] = useState(initialNodes);
  const onNodesChange: OnNodesChange<NodeType> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return [nodes, setNodes, onNodesChange];
}

/**
 * Hook for managing the state of edges - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialEdges
 * @returns an array [edges, setEdges, onEdgesChange]
 */
export function useEdgesState<EdgeType extends Edge = Edge>(
  initialEdges: EdgeType[]
): [EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, OnEdgesChange<EdgeType>] {
  const [edges, setEdges] = useState(initialEdges);
  const onEdgesChange: OnEdgesChange<EdgeType> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return [edges, setEdges, onEdgesChange];
}

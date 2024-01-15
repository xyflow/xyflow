import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, NodeChange, Edge, EdgeChange } from '../types';

/**
 * Hook for managing the state of nodes - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialNodes
 * @returns an array [nodes, setNodes, onNodesChange]
 */
export function useNodesState<NodeType extends Node = Node>(
  initialNodes: NodeType[]
): [NodeType[], Dispatch<SetStateAction<NodeType[]>>, (changes: NodeChange<NodeType>[]) => void] {
  const [nodes, setNodes] = useState(initialNodes);
  const onNodesChange = useCallback(
    (changes: NodeChange<NodeType>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
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
): [EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, (changes: EdgeChange<EdgeType>[]) => void] {
  const [edges, setEdges] = useState(initialEdges);
  const onEdgesChange = useCallback(
    (changes: EdgeChange<EdgeType>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return [edges, setEdges, onEdgesChange];
}

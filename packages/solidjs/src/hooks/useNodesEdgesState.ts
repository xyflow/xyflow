// import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '../types';
import { Accessor, Setter, createSignal } from 'solid-js';

/**
 * Hook for managing the state of nodes - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialNodes
 * @returns an array [nodes, setNodes, onNodesChange]
 */
export function useNodesState<NodeType extends Node>(
  initialNodes: NodeType[]
): [Accessor<NodeType[]>, Setter<NodeType[]>, OnNodesChange<NodeType>] {
  const [nodes, setNodes] = createSignal(initialNodes);
  const onNodesChange: OnNodesChange<NodeType> =
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds));

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
): [Accessor<EdgeType[]>,Setter<EdgeType[]>, OnEdgesChange<EdgeType>] {
  const [edges, setEdges] = createSignal(initialEdges);
  const onEdgesChange: OnEdgesChange<EdgeType> =
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

  return [edges, setEdges, onEdgesChange];
}

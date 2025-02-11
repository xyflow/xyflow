import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '../types';

/**
 * This hook makes it easy to prototype a controlled flow where you manage the
 *state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 *like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @param initialNodes
 * @returns an array [nodes, setNodes, onNodesChange]
 * @example
 *
 *```tsx
 *import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
 *
 *const initialNodes = [];
 *const initialEdges = [];
 *
 *export default function () {
 *  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 *  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 *
 *  return (
 *    <ReactFlow
 *      nodes={nodes}
 *      edges={edges}
 *      onNodesChange={onNodesChange}
 *      onEdgesChange={onEdgesChange}
 *    />
 *  );
 *}
 *```
 *
 *@remarks This hook was created to make prototyping easier and our documentation
 *examples clearer. Although it is OK to use this hook in production, in
 *practice you may want to use a more sophisticated state management solution
 *like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
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
 * This hook makes it easy to prototype a controlled flow where you manage the
 *state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 *like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @param initialEdges
 * @returns an array [edges, setEdges, onEdgesChange]
 * @example
 *
 *```tsx
 *import { ReactFlow, useNodesState, useEdgesState } from '@xyflow/react';
 *
 *const initialNodes = [];
 *const initialEdges = [];
 *
 *export default function () {
 *  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
 *  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 *
 *  return (
 *    <ReactFlow
 *      nodes={nodes}
 *      edges={edges}
 *      onNodesChange={onNodesChange}
 *      onEdgesChange={onEdgesChange}
 *    />
 *  );
 *}
 *```
 *
 * @remarks This hook was created to make prototyping easier and our documentation
 *examples clearer. Although it is OK to use this hook in production, in
 *practice you may want to use a more sophisticated state management solution
 *like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
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

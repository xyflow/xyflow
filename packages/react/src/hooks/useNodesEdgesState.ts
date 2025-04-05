import { useState, useCallback, type Dispatch, type SetStateAction } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '../types';

/**
 * This hook makes it easy to prototype a controlled flow where you manage the
 * state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 * like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @returns
 * - `nodes`: The current array of nodes. You might pass this directly to the `nodes` prop of your
 * `<ReactFlow />` component, or you may want to manipulate it first to perform some layouting,
 * for example.
 * - `setNodes`: A function that you can use to update the nodes. You can pass it a new array of
 * nodes or a callback that receives the current array of nodes and returns a new array of nodes.
 * This is the same as the second element of the tuple returned by React's `useState` hook.
 * - `onNodesChange`: A handy callback that can take an array of `NodeChanges` and update the nodes
 * state accordingly. You'll typically pass this directly to the `onNodesChange` prop of your
 * `<ReactFlow />` component.
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
 * examples clearer. Although it is OK to use this hook in production, in
 * practice you may want to use a more sophisticated state management solution
 * like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
 */
export function useNodesState<NodeType extends Node>(
  initialNodes: NodeType[]
): [
  //
  nodes: NodeType[],
  setNodes: Dispatch<SetStateAction<NodeType[]>>,
  onNodesChange: OnNodesChange<NodeType>
] {
  const [nodes, setNodes] = useState(initialNodes);
  const onNodesChange: OnNodesChange<NodeType> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return [nodes, setNodes, onNodesChange];
}

/**
 * This hook makes it easy to prototype a controlled flow where you manage the
 * state of nodes and edges outside the `ReactFlowInstance`. You can think of it
 * like React's `useState` hook with an additional helper callback.
 *
 * @public
 * @returns
 * - `edges`: The current array of edges. You might pass this directly to the `edges` prop of your
 * `<ReactFlow />` component, or you may want to manipulate it first to perform some layouting,
 * for example.
 *
 * - `setEdges`: A function that you can use to update the edges. You can pass it a new array of
 * edges or a callback that receives the current array of edges and returns a new array of edges.
 * This is the same as the second element of the tuple returned by React's `useState` hook.
 *
 * - `onEdgesChange`: A handy callback that can take an array of `EdgeChanges` and update the edges
 * state accordingly. You'll typically pass this directly to the `onEdgesChange` prop of your
 * `<ReactFlow />` component.
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
 * examples clearer. Although it is OK to use this hook in production, in
 * practice you may want to use a more sophisticated state management solution
 * like Zustand {@link https://reactflow.dev/docs/guides/state-management/} instead.
 *
 */
export function useEdgesState<EdgeType extends Edge = Edge>(
  initialEdges: EdgeType[]
): [
  //
  edges: EdgeType[],
  setEdges: Dispatch<SetStateAction<EdgeType[]>>,
  onEdgesChange: OnEdgesChange<EdgeType>
] {
  const [edges, setEdges] = useState(initialEdges);
  const onEdgesChange: OnEdgesChange<EdgeType> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return [edges, setEdges, onEdgesChange];
}

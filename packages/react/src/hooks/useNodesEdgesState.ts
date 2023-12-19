/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, type SetStateAction, type Dispatch } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import type { Node, NodeChange, Edge, EdgeChange } from '../types';

type ApplyChanges<ItemType, ChangesType> = (changes: ChangesType[], items: ItemType[]) => ItemType[];
type OnChange<ChangesType> = (changes: ChangesType[]) => void;

function createUseItemsState(
  applyChanges: ApplyChanges<Node, NodeChange>
): <NodeType extends Node = Node>(
  initialItems: NodeType[]
) => [NodeType[], Dispatch<SetStateAction<NodeType[]>>, OnChange<NodeChange>];
function createUseItemsState(
  applyChanges: ApplyChanges<Edge, EdgeChange>
): <EdgeType extends Edge = Edge>(
  initialItems: EdgeType[]
) => [EdgeType[], Dispatch<SetStateAction<EdgeType[]>>, OnChange<EdgeChange>];
function createUseItemsState(
  applyChanges: ApplyChanges<any, any>
): (initialItems: any[]) => [any[], Dispatch<SetStateAction<any[]>>, OnChange<any>] {
  return (initialItems: any[]) => {
    const [items, setItems] = useState(initialItems);

    const onItemsChange = useCallback((changes: any[]) => setItems((items: any) => applyChanges(changes, items)), []);

    return [items, setItems, onItemsChange];
  };
}

/**
 * Hook for managing the state of nodes - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialNodes
 * @returns an array [nodes, setNodes, onNodesChange]
 */
export const useNodesState = createUseItemsState(applyNodeChanges);

/**
 * Hook for managing the state of edges - should only be used for prototyping / simple use cases.
 *
 * @public
 * @param initialEdges
 * @returns an array [edges, setEdges, onEdgesChange]
 */
export const useEdgesState = createUseItemsState(applyEdgeChanges);

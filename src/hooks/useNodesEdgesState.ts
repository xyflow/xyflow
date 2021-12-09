import { useState, useCallback, SetStateAction, Dispatch } from 'react';

import { applyNodeChanges, applyEdgeChanges } from '../utils/changes';
import { Node, NodeChange, Edge, EdgeChange } from '../types';

type ApplyChanges<ItemType, ChangesType> = (changes: ChangesType[], items: ItemType[]) => ItemType[];
type OnChange<ChangesType> = (changes: ChangesType[]) => void;

// returns a hook that can be used liked this:
// const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
function createUseItemsState<ItemType, ChangesType>(
  applyChangesFunction: ApplyChanges<ItemType, ChangesType>
): (initialItems: ItemType[]) => [ItemType[], Dispatch<SetStateAction<ItemType[]>>, OnChange<ChangesType>] {
  return (initialItems: ItemType[]) => {
    const [items, setItems] = useState<ItemType[]>(initialItems);

    const onItemsChange = useCallback(
      (changes: ChangesType[]) => setItems((items) => applyChangesFunction(changes, items)),
      []
    );

    return [items, setItems, onItemsChange];
  };
}

export const useNodesState = createUseItemsState<Node, NodeChange>(applyNodeChanges as ApplyChanges<Node, NodeChange>);
export const useEdgesState = createUseItemsState<Edge, EdgeChange>(applyEdgeChanges as ApplyChanges<Edge, EdgeChange>);

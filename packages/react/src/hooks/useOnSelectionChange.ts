import { useEffect } from 'react';

import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc, Node, Edge } from '../types';

export type UseOnSelectionChangeOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  /** The handler to register. */
  onChange: OnSelectionChangeFunc<NodeType, EdgeType>;
};

/**
 * This hook lets you listen for changes to both node and edge selection. As the
 *name implies, the callback you provide will be called whenever the selection of
 *_either_ nodes or edges changes.
 *
 * @public
 * @example
 * ```jsx
 *import { useState } from 'react';
 *import { ReactFlow, useOnSelectionChange } from '@xyflow/react';
 *
 *function SelectionDisplay() {
 *  const [selectedNodes, setSelectedNodes] = useState([]);
 *  const [selectedEdges, setSelectedEdges] = useState([]);
 *
 *  // the passed handler has to be memoized, otherwise the hook will not work correctly
 *  const onChange = useCallback(({ nodes, edges }) => {
 *    setSelectedNodes(nodes.map((node) => node.id));
 *    setSelectedEdges(edges.map((edge) => edge.id));
 *  }, []);
 *
 *  useOnSelectionChange({
 *    onChange,
 *  });
 *
 *  return (
 *    <div>
 *      <p>Selected nodes: {selectedNodes.join(', ')}</p>
 *      <p>Selected edges: {selectedEdges.join(', ')}</p>
 *    </div>
 *  );
 *}
 *```
 *
 * @remarks You need to memoize the passed `onChange` handler, otherwise the hook will not work correctly.
 */
export function useOnSelectionChange<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  onChange,
}: UseOnSelectionChangeOptions<NodeType, EdgeType>) {
  const store = useStoreApi<NodeType, EdgeType>();

  useEffect(() => {
    const nextOnSelectionChangeHandlers = [...store.getState().onSelectionChangeHandlers, onChange];
    store.setState({ onSelectionChangeHandlers: nextOnSelectionChangeHandlers });

    return () => {
      const nextHandlers = store.getState().onSelectionChangeHandlers.filter((fn) => fn !== onChange);
      store.setState({ onSelectionChangeHandlers: nextHandlers });
    };
  }, [onChange]);
}

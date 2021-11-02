import { useCallback } from 'react';

import { useStore } from '../store';
import { getNodesInside } from '../utils/graph';
import { ReactFlowState, Node, NodeRendererNode } from '../types';

function getChildNodes(nodes: Node[], parent?: Node): NodeRendererNode[] {
  const children: NodeRendererNode[] = [];
  const remaining: Node[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if ((!parent && !n.parentNode) || n.parentNode === parent?.id) {
      children.push({ node: n });
    } else {
      remaining.push(n);
    }
  }

  return children.map((child) => {
    child.childNodes = getChildNodes(remaining, child.node);
    return child;
  });
}

function useVisibleNodes(onlyRenderVisible: boolean) {
  const nodes = useStore(
    useCallback(
      (s: ReactFlowState) => {
        return onlyRenderVisible
          ? getNodesInside(s.nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true)
          : s.nodes;
      },
      [onlyRenderVisible]
    )
  );

  return getChildNodes(nodes);
}

export default useVisibleNodes;

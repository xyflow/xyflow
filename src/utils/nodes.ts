import { Node } from '../types';

function flat(arr: Node[], target: Node[]) {
  arr.forEach(function (el) {
    target.push(el);
    if (el.childNodes) {
      flat(el.childNodes, target);
    }
  });
}

const filterNodes = (condition: (node: Node) => boolean, nodes: Node[]): Node[] => {
  let res = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];

    if (condition(n)) {
      res.push(n);
    }

    if (n.childNodes) {
      const matches = filterNodes(condition, n.childNodes);

      for (let j = 0; j < matches.length; j++) {
        res.push(matches[j]);
      }
    }
  }

  return res;
};

const mapNodes = (accessor: (node: Node) => any, nodes: Node[]): Node[] => {
  let res = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    res.push(accessor(n));

    if (n.childNodes) {
      n.childNodes = mapNodes(accessor, n.childNodes);
    }
  }

  return res;
};

const forEachNode = (accessor: (node: Node) => any, nodes: Node[]): void => {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    accessor(n);

    if (n.childNodes) {
      forEachNode(accessor, n.childNodes);
    }
  }
};

function findNode(accessor: (node: Node) => boolean, nodes: Node[]): Node | undefined {
  let res = undefined;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];

    if (accessor(n)) {
      return n;
    }

    if (n.childNodes) {
      res = findNode(accessor, n.childNodes);

      if (res) {
        return res;
      }
    }
  }

  return res;
}

export interface NodeHelper {
  filter: (accessor: (node: Node) => boolean) => Node[];
  map: (accessor: (node: Node) => any) => Node[];
  find: (accessor: (node: Node) => boolean) => Node | undefined;
  forEach: (accessor: (node: Node) => void) => void;
  flatten: () => Node[];
}

export function nodeHelper(nodes: Node[]): NodeHelper {
  const flatten: NodeHelper['flatten'] = () => {
    const flattened: Node[] = [];
    flat(nodes, flattened);
    return flattened;
  };

  const filter: NodeHelper['filter'] = (accessor) => {
    return filterNodes(accessor, nodes);
  };

  const forEach: NodeHelper['forEach'] = (accessor) => {
    return forEachNode(accessor, nodes);
  };

  const find: NodeHelper['find'] = (accessor) => {
    return findNode(accessor, nodes);
  };

  const map: NodeHelper['map'] = (accessor) => {
    return mapNodes(accessor, nodes);
  };

  return {
    filter,
    forEach,
    flatten,
    find,
    map,
  };
}

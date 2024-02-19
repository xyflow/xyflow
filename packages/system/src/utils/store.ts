import { internalsSymbol } from '../constants';
import {
  NodeBase,
  CoordinateExtent,
  Dimensions,
  NodeDimensionUpdate,
  NodeOrigin,
  PanZoomInstance,
  Transform,
  XYPosition,
  XYZPosition,
  ConnectionLookup,
  EdgeBase,
  EdgeLookup,
} from '../types';
import { getDimensions, getHandleBounds } from './dom';
import { isNumeric } from './general';
import { getNodePositionWithOrigin } from './graph';

type ParentNodes = Record<string, boolean>;

export function updateAbsolutePositions<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: Map<string, NodeType>,
  nodeOrigin: NodeOrigin = [0, 0],
  parentNodes?: ParentNodes
) {
  return nodes.map((node) => {
    if (node.parentNode && !nodeLookup.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes?.[node.id]) {
      const parentNode = node.parentNode ? nodeLookup.get(node.parentNode) : null;
      const { x, y, z } = calculateXYZPosition(
        node,
        nodes,
        nodeLookup,
        {
          ...node.position,
          z: node[internalsSymbol]?.z ?? 0,
        },
        parentNode?.origin || nodeOrigin
      );

      const positionChanged = x !== node.computed?.positionAbsolute?.x || y !== node.computed?.positionAbsolute?.y;
      node.computed!.positionAbsolute = positionChanged
        ? {
            x,
            y,
          }
        : node.computed?.positionAbsolute;

      node[internalsSymbol]!.z = z;

      if (parentNodes?.[node.id]) {
        node[internalsSymbol]!.isParent = true;
      }
    }

    return node;
  });
}

type UpdateNodesOptions<NodeType extends NodeBase> = {
  nodeOrigin?: NodeOrigin;
  elevateNodesOnSelect?: boolean;
  defaults?: Partial<NodeType>;
};

export function adoptUserProvidedNodes<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodeLookup: Map<string, NodeType>,
  options: UpdateNodesOptions<NodeType> = {
    nodeOrigin: [0, 0] as NodeOrigin,
    elevateNodesOnSelect: true,
    defaults: {},
  }
): NodeType[] {
  const tmpLookup = new Map(nodeLookup);
  nodeLookup.clear();
  const parentNodes: ParentNodes = {};
  const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;

  const nextNodes = nodes.map((n) => {
    const currentStoreNode = tmpLookup.get(n.id);
    if (n === currentStoreNode?.[internalsSymbol]?.userProvidedNode) {
      nodeLookup.set(n.id, currentStoreNode);
      return currentStoreNode;
    }

    const node: NodeType = {
      ...options.defaults,
      ...n,
      computed: {
        positionAbsolute: n.position,
        width: n.computed?.width,
        height: n.computed?.height,
      },
    };
    const z = (isNumeric(n.zIndex) ? n.zIndex : 0) + (n.selected ? selectedNodeZ : 0);
    const currInternals = n?.[internalsSymbol] || currentStoreNode?.[internalsSymbol];

    if (node.parentNode) {
      parentNodes[node.parentNode] = true;
    }

    Object.defineProperty(node, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: currInternals?.handleBounds,
        z,
        userProvidedNode: n,
      },
    });

    nodeLookup.set(node.id, node);

    return node;
  });

  const nodesWithPositions = updateAbsolutePositions(nextNodes, nodeLookup, options.nodeOrigin, parentNodes);

  return nodesWithPositions;
}

function calculateXYZPosition<NodeType extends NodeBase>(
  node: NodeType,
  nodes: NodeType[],
  nodeLookup: Map<string, NodeType>,
  result: XYZPosition,
  nodeOrigin: NodeOrigin
): XYZPosition {
  if (!node.parentNode) {
    return result;
  }

  const parentNode = nodeLookup.get(node.parentNode)!;
  const { position: parentNodePosition } = getNodePositionWithOrigin(parentNode, parentNode?.origin || nodeOrigin);

  return calculateXYZPosition(
    parentNode,
    nodes,
    nodeLookup,
    {
      x: (result.x ?? 0) + parentNodePosition.x,
      y: (result.y ?? 0) + parentNodePosition.y,
      z: (parentNode[internalsSymbol]?.z ?? 0) > (result.z ?? 0) ? parentNode[internalsSymbol]?.z ?? 0 : result.z ?? 0,
    },
    parentNode.origin || nodeOrigin
  );
}

export function updateNodeDimensions<NodeType extends NodeBase>(
  updates: Map<string, NodeDimensionUpdate>,
  nodes: NodeType[],
  nodeLookup: Map<string, NodeType>,
  domNode: HTMLElement | null,
  nodeOrigin?: NodeOrigin,
  onUpdate?: (id: string, dimensions: Dimensions) => void
): NodeType[] | null {
  const viewportNode = domNode?.querySelector('.xyflow__viewport');

  if (!viewportNode) {
    return null;
  }

  const style = window.getComputedStyle(viewportNode);
  const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

  const nextNodes = nodes.map((node) => {
    const update = updates.get(node.id);

    if (update) {
      const dimensions = getDimensions(update.nodeElement);
      const doUpdate = !!(
        dimensions.width &&
        dimensions.height &&
        (node.computed?.width !== dimensions.width || node.computed?.height !== dimensions.height || update.forceUpdate)
      );

      if (doUpdate) {
        onUpdate?.(node.id, dimensions);

        const newNode = {
          ...node,
          computed: {
            ...node.computed,
            ...dimensions,
          },
          [internalsSymbol]: {
            ...node[internalsSymbol],
            handleBounds: {
              source: getHandleBounds('.source', update.nodeElement, zoom, node.origin || nodeOrigin),
              target: getHandleBounds('.target', update.nodeElement, zoom, node.origin || nodeOrigin),
            },
          },
        };

        nodeLookup.set(node.id, newNode);

        return newNode;
      }
    }

    return node;
  });

  return nextNodes;
}

export function panBy({
  delta,
  panZoom,
  transform,
  translateExtent,
  width,
  height,
}: {
  delta: XYPosition;
  panZoom: PanZoomInstance | null;
  transform: Transform;
  translateExtent: CoordinateExtent;
  width: number;
  height: number;
}) {
  if (!panZoom || (!delta.x && !delta.y)) {
    return false;
  }

  const nextViewport = panZoom.setViewportConstrained(
    {
      x: transform[0] + delta.x,
      y: transform[1] + delta.y,
      zoom: transform[2],
    },
    [
      [0, 0],
      [width, height],
    ],
    translateExtent
  );

  const transformChanged =
    !!nextViewport &&
    (nextViewport.x !== transform[0] || nextViewport.y !== transform[1] || nextViewport.k !== transform[2]);

  return transformChanged;
}

export function updateConnectionLookup(connectionLookup: ConnectionLookup, edgeLookup: EdgeLookup, edges: EdgeBase[]) {
  connectionLookup.clear();
  edgeLookup.clear();

  for (const edge of edges) {
    const { source, target, sourceHandle = null, targetHandle = null } = edge;

    const sourceKey = `${source}-source-${sourceHandle}`;
    const targetKey = `${target}-target-${targetHandle}`;

    const prevSource = connectionLookup.get(sourceKey) || new Map();
    const prevTarget = connectionLookup.get(targetKey) || new Map();
    const connection = { edgeId: edge.id, source, target, sourceHandle, targetHandle };

    edgeLookup.set(edge.id, edge);
    connectionLookup.set(sourceKey, prevSource.set(`${target}-${targetHandle}`, connection));
    connectionLookup.set(targetKey, prevTarget.set(`${source}-${sourceHandle}`, connection));
  }
}

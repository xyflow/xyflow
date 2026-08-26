import { getNodeDimensions, parsePaddings } from './general';
import type { CoordinateExtent, InternalNodeBase, NodeBase, NodeLookup, ParentLookup, ZIndexMode } from '../types';
import { calculateZ, isManualZIndexMode } from './store';

const infinitesimalExtent: CoordinateExtent = [
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
];

type ResolveGroupNodesOptions = {
  zIndexMode: ZIndexMode;
  elevateNodesOnSelect: boolean;
  rootParentIndex: { i: number };
};

const SELECTED_NODE_Z = 1000;
const ROOT_PARENT_Z_INCREMENT = 10;

function elevateNodeAboveParent<NodeType extends NodeBase>(
  node: InternalNodeBase<NodeType>,
  parentZ: number,
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  selectedNodeZ: number,
  zIndexMode: ZIndexMode
) {
  const childZ = calculateZ(node, selectedNodeZ, zIndexMode);
  const z = parentZ >= childZ ? parentZ + 1 : childZ;

  if (z !== node.internals.z) {
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        z,
      },
    });
  }
}

/**
 * Resolves z index for group nodes in a similar way as subflows.
 * It updates the correct rootParentIndex and zIndex for group nodes.
 */
function preprocessGroupZIndex<NodeType extends NodeBase>(
  groupLookup: ParentLookup<InternalNodeBase<NodeType>>,
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  options: ResolveGroupNodesOptions
) {
  const { zIndexMode, elevateNodesOnSelect, rootParentIndex } = options;
  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const resolved = new Set<string>();
  const resolving = new Set<string>();

  function resolve(groupId: string) {
    if (resolved.has(groupId)) {
      return;
    }

    if (resolving.has(groupId)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Circular group nesting detected for group node with id "${groupId}". Groups cannot contain each other.`
        );
      }
      return;
    }

    resolving.add(groupId);

    const groupNode = nodeLookup.get(groupId);
    if (!groupNode) {
      resolving.delete(groupId);
      resolved.add(groupId);
      return;
    }

    // Resolve outer groups first so nested groups see the parent's finalized z
    if (groupNode.groupId) {
      resolve(groupNode.groupId);
    }

    // Only root group parents get a rootParentIndex
    if (!groupNode.groupId && groupNode.internals.rootParentIndex === undefined && zIndexMode === 'auto') {
      groupNode.internals.rootParentIndex = ++rootParentIndex.i;
      groupNode.internals.z = groupNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
    }

    // Keep the shared counter in sync when the group already has a rootParentIndex
    // (e.g. it was also a root subflow parent, or we revisit this group).
    if (groupNode.internals.rootParentIndex !== undefined) {
      rootParentIndex.i = groupNode.internals.rootParentIndex;
    }

    // Elevate nested groups above their parent group
    if (groupNode.groupId) {
      const parentGroup = nodeLookup.get(groupNode.groupId);
      if (parentGroup) {
        elevateNodeAboveParent(groupNode, parentGroup.internals.z ?? 0, nodeLookup, selectedNodeZ, zIndexMode);
      }
    }

    resolving.delete(groupId);
    resolved.add(groupId);
  }

  for (const groupId of groupLookup.keys()) {
    resolve(groupId);
  }
}

/**
 * Recursively resolves group extents and applies `autoSize` to group nodes.
 * Nested groups are resolved first so their final dimensions contribute to parent groups.
 * Member z is elevated against the immediate parent group's already-finalized z.
 */
export function resolveGroupNodes<NodeType extends NodeBase>(
  groupLookup: ParentLookup<InternalNodeBase<NodeType>>,
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>,
  options: ResolveGroupNodesOptions
) {
  const resolved = new Set<string>();
  const selectedNodeZ = options.elevateNodesOnSelect && !isManualZIndexMode(options.zIndexMode) ? SELECTED_NODE_Z : 0;
  // We need to do a top-down pass for z-indexes before
  // resolving the extents bottom-up
  preprocessGroupZIndex(groupLookup, nodeLookup, options);

  function resolve(groupId: string) {
    if (resolved.has(groupId)) {
      return;
    }

    const members = groupLookup.get(groupId);
    if (!members) {
      resolved.add(groupId);
      return;
    }

    let isFinite = false;
    const extent: CoordinateExtent = [
      [infinitesimalExtent[0][0], infinitesimalExtent[0][1]],
      [infinitesimalExtent[1][0], infinitesimalExtent[1][1]],
    ];

    // Parent group z was finalized in preprocessGroupZIndex (top-down)
    const groupZ = nodeLookup.get(groupId)?.internals.z ?? 0;

    for (const member of members.values()) {
      // A member may itself be a group — resolve it first so autoSize is applied
      if (groupLookup.has(member.id)) {
        resolve(member.id);
      }

      // The member might have been updated in the nodeLookup if a group node
      const current = nodeLookup.get(member.id) ?? member;
      const dimensions = getNodeDimensions(current);
      const { x, y } = current.internals.positionAbsolute;

      extent[0][0] = Math.min(extent[0][0], x);
      extent[0][1] = Math.min(extent[0][1], y);
      extent[1][0] = Math.max(extent[1][0], x + dimensions.width);
      extent[1][1] = Math.max(extent[1][1], y + dimensions.height);
      isFinite = true;

      elevateNodeAboveParent(current, groupZ, nodeLookup, selectedNodeZ, options.zIndexMode);
    }

    const currentGroupNode = nodeLookup.get(groupId);
    if (currentGroupNode?.autoSize && isFinite) {
      applyGroupAutoSize(currentGroupNode, extent, nodeLookup);
    }

    resolved.add(groupId);
  }

  for (const groupId of groupLookup.keys()) {
    resolve(groupId);
  }
}

function applyGroupAutoSize<NodeType extends NodeBase>(
  groupNode: InternalNodeBase<NodeType>,
  extent: CoordinateExtent,
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>
) {
  if (!groupNode.autoSize) {
    return;
  }

  const extentWidth = extent[1][0] - extent[0][0];
  const extentHeight = extent[1][1] - extent[0][1];
  const padding =
    groupNode.autoSize === true
      ? { top: 0, right: 0, bottom: 0, left: 0 }
      : parsePaddings(groupNode.autoSize, extentWidth, extentHeight);

  const x = extent[0][0] - padding.left;
  const y = extent[0][1] - padding.top;
  const width = extentWidth + padding.left + padding.right;
  const height = extentHeight + padding.top + padding.bottom;

  const dimensions = getNodeDimensions(groupNode);
  const positionChanged = x !== groupNode.internals.positionAbsolute.x || y !== groupNode.internals.positionAbsolute.y;
  const dimensionsChanged = width !== dimensions.width || height !== dimensions.height;

  if (!positionChanged && !dimensionsChanged) {
    return;
  }

  nodeLookup.set(groupNode.id, {
    ...groupNode,
    position: { x, y },
    width,
    height,
    measured: { width, height },
    internals: {
      ...groupNode.internals,
      positionAbsolute: { x, y },
    },
  });
}

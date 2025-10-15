import type { XYPosition, Position, CoordinateExtent, Handle } from '.';
import { Optional } from '../utils/types';

/**
 * Framework independent node data structure.
 *
 * @inline
 * @typeParam NodeData - type of the node data
 * @typeParam NodeType - type of the node
 */
export type NodeBase<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string | undefined = string | undefined
> = {
  /** Unique id of a node. */
  id: string;
  /**
   * Position of a node on the pane.
   * @example { x: 0, y: 0 }
   */
  position: XYPosition;
  /** Arbitrary data passed to a node. */
  data: NodeData;
  /**
   * Only relevant for default, source, target nodeType. Controls source position.
   * @example 'right', 'left', 'top', 'bottom'
   */
  sourcePosition?: Position;
  /**
   * Only relevant for default, source, target nodeType. Controls target position.
   * @example 'right', 'left', 'top', 'bottom'
   */
  targetPosition?: Position;
  /** Whether or not the node should be visible on the canvas. */
  hidden?: boolean;
  selected?: boolean;
  /** Whether or not the node is currently being dragged. */
  dragging?: boolean;
  /** Whether or not the node is able to be dragged. */
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  /**
   * A class name that can be applied to elements inside the node that allows those elements to act
   * as drag handles, letting the user drag the node by clicking and dragging on those elements.
   */
  dragHandle?: string;
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
  /** Parent node id, used for creating sub-flows. */
  parentId?: string;
  zIndex?: number;
  /**
   * Boundary a node can be moved in.
   * @example 'parent' or [[0, 0], [100, 100]]
   */
  extent?: 'parent' | CoordinateExtent | null;
  /**
   * When `true`, the parent node will automatically expand if this node is dragged to the edge of
   * the parent node's bounds.
   */
  expandParent?: boolean;
  ariaLabel?: string;
  /**
   * Origin of the node relative to its position.
   * @example
   * [0.5, 0.5] // centers the node
   * [0, 0] // top left
   * [1, 1] // bottom right
   */
  origin?: NodeOrigin;
  handles?: NodeHandle[];
  measured?: {
    width?: number;
    height?: number;
  };
} & (undefined extends NodeType
  ? {
      /** Type of node defined in nodeTypes */
      type?: string | undefined;
    }
  : {
      /** Type of node defined in nodeTypes */
      type: NodeType;
    });

export type InternalNodeBase<NodeType extends NodeBase = NodeBase> = Omit<NodeType, 'measured'> & {
  measured: {
    width?: number;
    height?: number;
  };
  internals: {
    positionAbsolute: XYPosition;
    z: number;
    rootParentIndex?: number;
    /**
     * Holds a reference to the original node object provided by the user.
     * Used as an optimization to avoid certain operations.
     */
    userNode: NodeType;
    handleBounds?: NodeHandleBounds;
    bounds?: NodeBounds;
  };
};

/**
 * The node data structure that gets used for the custom nodes props.
 *
 * @public
 */
export type NodeProps<NodeType extends NodeBase> = Pick<
  NodeType,
  'id' | 'data' | 'width' | 'height' | 'sourcePosition' | 'targetPosition' | 'dragHandle' | 'parentId'
> &
  Required<Pick<NodeType, 'type' | 'dragging' | 'zIndex' | 'selectable' | 'deletable' | 'selected' | 'draggable'>> & {
    /** Whether a node is connectable or not. */
    isConnectable: boolean;
    /** Position absolute x value. */
    positionAbsoluteX: number;
    /** Position absolute y value. */
    positionAbsoluteY: number;
  };

export type NodeHandleBounds = {
  source: Handle[] | null;
  target: Handle[] | null;
};

export type InternalNodeUpdate = {
  id: string;
  nodeElement: HTMLDivElement;
  force?: boolean;
};

export type NodeBounds = XYPosition & {
  width: number | null;
  height: number | null;
};

export type NodeDragItem = {
  id: string;
  position: XYPosition;
  // distance from the mouse cursor to the node when start dragging
  distance: XYPosition;
  measured: {
    width: number;
    height: number;
  };
  internals: {
    positionAbsolute: XYPosition;
  };
} & Pick<InternalNodeBase, 'extent' | 'parentId' | 'origin' | 'expandParent' | 'dragging'>;

/**
 * The origin of a Node determines how it is placed relative to its own coordinates.
 * `[0, 0]` places it at the top left corner, `[0.5, 0.5]` right in the center and
 * `[1, 1]` at the bottom right of its position.
 *
 * @public
 */
export type NodeOrigin = [number, number];

export type OnSelectionDrag = (event: MouseEvent, nodes: NodeBase[]) => void;

/**
 * Type for the handles of a node
 *
 * @public
 */
export type NodeHandle = Omit<Optional<Handle, 'width' | 'height'>, 'nodeId'>;

export type Align = 'center' | 'start' | 'end';

export type NodeLookup<NodeType extends InternalNodeBase = InternalNodeBase> = Map<string, NodeType>;
export type ParentLookup<NodeType extends InternalNodeBase = InternalNodeBase> = Map<string, Map<string, NodeType>>;

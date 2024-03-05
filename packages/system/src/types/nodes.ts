import { internalsSymbol } from '../constants';
import type { XYPosition, Position, CoordinateExtent, HandleElement } from '.';
import { Optional } from '../utils/types';

/**
 * Framework independent node data structure.
 *
 * @typeParam NodeData - type of the node data
 * @typeParam NodeType - type of the node
 */
export type NodeBase<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = {
  /** Unique id of a node */
  id: string;
  /** Position of a node on the pane
   * @example { x: 0, y: 0 }
   */
  position: XYPosition;
  /** Arbitrary data passed to a node */
  data: NodeData;
  /** Type of node defined in nodeTypes */
  type?: NodeType;
  /** Only relevant for default, source, target nodeType. controls source position
   * @example 'right', 'left', 'top', 'bottom'
   */
  sourcePosition?: Position;
  /** Only relevant for default, source, target nodeType. controls target position
   * @example 'right', 'left', 'top', 'bottom'
   */
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  /** True, if node is being dragged */
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
  /** Parent node id, used for creating sub-flows */
  parentNode?: string;
  zIndex?: number;
  /** Boundary a node can be moved in
   * @example 'parent' or [[0, 0], [100, 100]]
   */
  extent?: 'parent' | CoordinateExtent;
  expandParent?: boolean;
  ariaLabel?: string;
  /** Origin of the node relative to it's position
   * @example
   * [0.5, 0.5] // centers the node
   * [0, 0] // top left
   * [1, 1] // bottom right
   */
  origin?: NodeOrigin;
  handles?: NodeHandle[];
  computed?: {
    width?: number;
    height?: number;
    positionAbsolute?: XYPosition;
  };

  // Only used internally
  [internalsSymbol]?: {
    z?: number;
    handleBounds?: NodeHandleBounds;
    isParent?: boolean;
    /** Holds a reference to the original node object provided by the user
     * (which may lack some fields, like `computed` or `[internalSymbol]`. Used
     * as an optimization to avoid certain operations. */
    userProvidedNode: NodeBase<NodeData, NodeType>;
  };
};

/**
 * The node data structure that gets used for the nodes prop.
 *
 * @public
 */
export type NodeProps<NodeType extends NodeBase> = Pick<
  NodeType,
  'id' | 'data' | 'width' | 'height' | 'sourcePosition' | 'targetPosition' | 'selected' | 'dragHandle'
> &
  Required<Pick<NodeType, 'type' | 'dragging' | 'zIndex'>> & {
    /** whether a node is connectable or not */
    isConnectable: boolean;
    /** position absolute x value */
    positionAbsoluteX: number;
    /** position absolute x value */
    positionAbsoluteY: number;
  };

export type NodeHandleBounds = {
  source: HandleElement[] | null;
  target: HandleElement[] | null;
};

export type NodeDimensionUpdate = {
  id: string;
  nodeElement: HTMLDivElement;
  forceUpdate?: boolean;
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
  computed: {
    width: number | null;
    height: number | null;
    positionAbsolute: XYPosition;
  };
  extent?: 'parent' | CoordinateExtent;
  parentNode?: string;
  dragging?: boolean;
  origin?: NodeOrigin;
  expandParent?: boolean;
};

export type NodeOrigin = [number, number];

export type OnSelectionDrag = (event: MouseEvent, nodes: NodeBase[]) => void;

export type NodeHandle = Optional<HandleElement, 'width' | 'height'>;

export type Align = 'center' | 'start' | 'end';

export type NodeLookup<NodeType extends NodeBase = NodeBase> = Map<string, NodeType>;

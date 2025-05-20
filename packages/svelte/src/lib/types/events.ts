import type { Edge } from './edges';
import type { Node } from './nodes';

export type NodeEventWithPointer<T = PointerEvent, NodeType extends Node = Node> = ({
  node,
  event
}: {
  node: NodeType;
  event: T;
}) => void;

export type NodesEventWithPointer<T = PointerEvent, NodeType extends Node = Node> = ({
  nodes,
  event
}: {
  nodes: NodeType[];
  event: T;
}) => void;

export type NodeTargetEventWithPointer<T = PointerEvent, NodeType extends Node = Node> = ({
  targetNode,
  nodes,
  event
}: {
  targetNode: NodeType | null;
  nodes: NodeType[];
  event: T;
}) => void;

export type NodeEvents<NodeType extends Node = Node> = {
  /** This event handler is called when a user clicks on a node. */
  onnodeclick?: NodeEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  /** This event handler is called when a user right-clicks on a node. */
  onnodecontextmenu?: NodeEventWithPointer<MouseEvent, NodeType>;
  /** This event handler is called when a user drags a node. */
  onnodedrag?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  /** This event handler is called when a user starts to drag a node. */
  onnodedragstart?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  /** This event handler is called when a user stops dragging a node. */
  onnodedragstop?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  /** This event handler is called when the pointer of a user enters a node. */
  onnodepointerenter?: NodeEventWithPointer<PointerEvent, NodeType>;
  /** This event handler is called when the pointer of a user leaves a node. */
  onnodepointerleave?: NodeEventWithPointer<PointerEvent, NodeType>;
  /** This event handler is called when the pointer of a user moves over a node. */
  onnodepointermove?: NodeEventWithPointer<PointerEvent, NodeType>;
};

export type NodeSelectionEvents<NodeType extends Node = Node> = {
  /** This event handler is called when a user right-clicks the selection box. */
  onselectioncontextmenu?: NodesEventWithPointer<MouseEvent, NodeType>;
  /** This event handler is called when a user clicks the selection box. */
  onselectionclick?: NodesEventWithPointer<MouseEvent, NodeType>;
};

export type PaneEvents = {
  /** This event handler is called when a user clicks the pane. */
  onpaneclick?: ({ event }: { event: MouseEvent }) => void;
  /** This event handler is called when a user right-clicks the pane. */
  onpanecontextmenu?: ({ event }: { event: MouseEvent }) => void;
};

export type EdgeEvents<EdgeType extends Edge = Edge> = {
  /** This event handler is called when a user clicks an edge. */
  onedgeclick?: ({ edge, event }: { edge: EdgeType; event: MouseEvent }) => void;
  /** This event handler is called when a user right-clicks an edge. */
  onedgecontextmenu?: ({ edge, event }: { edge: EdgeType; event: MouseEvent }) => void;
  /** This event handler is called when the pointer of a user enters an edge. */
  onedgepointerenter?: ({ edge, event }: { edge: EdgeType; event: PointerEvent }) => void;
  /** This event handler is called when the pointer of a user enters an edge. */
  onedgepointerleave?: ({ edge, event }: { edge: EdgeType; event: PointerEvent }) => void;
};

export type OnSelectionDrag<NodeType extends Node = Node> = (
  event: MouseEvent,
  nodes: NodeType[]
) => void;

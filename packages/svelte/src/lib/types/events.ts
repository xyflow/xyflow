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
  onnodeclick?: NodeEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  onnodecontextmenu?: NodeEventWithPointer<MouseEvent, NodeType>;
  onnodedrag?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  onnodedragstart?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  onnodedragstop?: NodeTargetEventWithPointer<MouseEvent | TouchEvent, NodeType>;
  onnodepointerenter?: NodeEventWithPointer<PointerEvent, NodeType>;
  onnodepointerleave?: NodeEventWithPointer<PointerEvent, NodeType>;
  onnodepointermove?: NodeEventWithPointer<PointerEvent, NodeType>;
};

export type NodeSelectionEvents<NodeType extends Node = Node> = {
  onselectioncontextmenu?: NodesEventWithPointer<MouseEvent, NodeType>;
  onselectionclick?: NodesEventWithPointer<MouseEvent, NodeType>;
};

export type PaneEvents = {
  onpaneclick?: ({ event }: { event: MouseEvent }) => void;
  onpanecontextmenu?: ({ event }: { event: MouseEvent }) => void;
};

export type EdgeEvents<EdgeType extends Edge = Edge> = {
  onedgeclick?: ({ edge, event }: { edge: EdgeType; event: MouseEvent }) => void;
  onedgecontextmenu?: ({ edge, event }: { edge: EdgeType; event: MouseEvent }) => void;
  onedgepointerenter?: ({ edge, event }: { edge: EdgeType; event: PointerEvent }) => void;
  onedgepointerleave?: ({ edge, event }: { edge: EdgeType; event: PointerEvent }) => void;
};

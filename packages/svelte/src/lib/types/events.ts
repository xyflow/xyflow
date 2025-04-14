import type { Edge } from './edges';
import type { Node } from './nodes';

export type NodeEventWithPointer<T = PointerEvent> = ({
  node,
  event
}: {
  node: Node;
  event: T;
}) => void;

export type NodesEventWithPointer<T = PointerEvent> = ({
  nodes,
  event
}: {
  nodes: Node[];
  event: T;
}) => void;

export type NodeTargetEventWithPointer<T = PointerEvent> = ({
  targetNode,
  nodes,
  event
}: {
  targetNode: Node | null;
  nodes: Node[];
  event: T;
}) => void;

export type NodeEvents = {
  onnodeclick?: NodeEventWithPointer<MouseEvent | TouchEvent>;
  onnodecontextmenu?: NodeEventWithPointer<MouseEvent>;
  onnodedrag?: NodeTargetEventWithPointer<MouseEvent | TouchEvent>;
  onnodedragstart?: NodeTargetEventWithPointer<MouseEvent | TouchEvent>;
  onnodedragstop?: NodeTargetEventWithPointer<MouseEvent | TouchEvent>;
  onnodepointerenter?: NodeEventWithPointer;
  onnodepointerleave?: NodeEventWithPointer;
  onnodepointermove?: NodeEventWithPointer;
};

export type NodeSelectionEvents = {
  onselectioncontextmenu?: NodesEventWithPointer<MouseEvent>;
  onselectionclick?: NodesEventWithPointer<MouseEvent>;
};

export type PaneEvents = {
  onpaneclick?: ({ event }: { event: MouseEvent }) => void;
  onpanecontextmenu?: ({ event }: { event: MouseEvent }) => void;
};

export type EdgeEvents = {
  onedgeclick?: ({ edge, event }: { edge: Edge; event: MouseEvent }) => void;
  onedgecontextmenu?: ({ edge, event }: { edge: Edge; event: MouseEvent }) => void;
  onedgepointerenter?: ({ edge, event }: { edge: Edge; event: PointerEvent }) => void;
  onedgepointerleave?: ({ edge, event }: { edge: Edge; event: PointerEvent }) => void;
};

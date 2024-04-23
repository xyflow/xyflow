import type { Edge } from './edges';
import type { Node } from './nodes';

export type NodeEventWithPointer = ({
  node,
  event
}: {
  node: Node;
  event: MouseEvent | TouchEvent;
}) => void;

export type NodesEventWithPointer = ({
  nodes,
  event
}: {
  nodes: Node[];
  event: MouseEvent | TouchEvent;
}) => void;

type NodeTargetEventWithPointer = ({
  targetNode,
  nodes,
  event
}: {
  targetNode: Node | null;
  nodes: Node[];
  event: MouseEvent | TouchEvent;
}) => void;

export type NodeEvents = {
  onnodeclick?: NodeEventWithPointer;
  onnodecontextmenu?: NodeEventWithPointer;
  onnodedrag?: NodeTargetEventWithPointer;
  onnodedragstart?: NodeTargetEventWithPointer;
  onnodedragstop?: NodeTargetEventWithPointer;
  onnodemouseenter?: NodeEventWithPointer;
  onnodemouseleave?: NodeEventWithPointer;
  onnodemousemove?: NodeEventWithPointer;
};

export type NodeSelectionEvents = {
  onselectioncontextmenu?: NodesEventWithPointer;
  onselectionclick?: NodesEventWithPointer;
};

export type PaneEvents = {
  onpaneclick?: ({ event }: { event: MouseEvent | TouchEvent }) => void;
  onpanecontextmenu?: ({ event }: { event: MouseEvent }) => void;
};

export type EdgeEvents = {
  onedgeclick?: ({ edge, event }: { edge: Edge; event: MouseEvent | TouchEvent }) => void;
  onedgecontextmenu?: ({ edge, event }: { edge: Edge; event: MouseEvent }) => void;
};

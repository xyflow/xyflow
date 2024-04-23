import type { NodeEvents, NodeSelectionEvents } from '$lib/types';

export type NodeSelectionProps = NodeSelectionEvents &
  Pick<NodeEvents, 'onnodedrag' | 'onnodedragstart' | 'onnodedragstop'>;

import type { Position, Align } from '@xyflow/system';

export type NodeToolbarProps = {
  nodeId?: string | string[];
  position?: Position;
  align?: Align;
  offset?: number;
  isVisible?: boolean;
};

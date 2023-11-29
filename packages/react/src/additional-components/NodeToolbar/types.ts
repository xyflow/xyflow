import type { HTMLAttributes } from 'react';
import type { Position, Align } from '@xyflow/system';

export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string | string[];
  isVisible?: boolean;
  position?: Position;
  offset?: number;
  align?: Align;
};

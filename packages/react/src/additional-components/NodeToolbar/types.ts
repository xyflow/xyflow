import type { HTMLAttributes } from 'react';
import type { Position } from '@xyflow/system';

export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string | string[];
  isVisible?: boolean;
  position?: Position;
  offset?: number;
  align?: Align;
};

export type Align = 'center' | 'start' | 'end';

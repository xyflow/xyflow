import { Position } from '@reactflow/core';
import type { HTMLAttributes } from 'react';

export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  nodeId?: string | string[];
  isVisible?: boolean;
  position?: Position;
  offset?: number;
  align?: Align;
};

export type Align = 'center' | 'start' | 'end';

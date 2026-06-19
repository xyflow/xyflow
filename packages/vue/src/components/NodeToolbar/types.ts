import type { Position } from '@xyflow/system';

export interface NodeToolbarProps {
  nodeId?: string | string[];
  isVisible?: boolean;
  position?: Position;
  offset?: number;
  align?: 'center' | 'start' | 'end';
}

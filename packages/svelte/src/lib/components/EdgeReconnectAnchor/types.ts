import type { HandleType, XYPosition } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type EdgeReconnectAnchorProps = {
  type: HandleType;
  reconnecting?: boolean;
  style?: string;
  class?: ClassValue;
  position?: XYPosition;
  size?: number;
  children?: Snippet;
  dragThreshold?: number;
} & HTMLAttributes<HTMLDivElement>;

import type { HandleProps as HandlePropsSystem, NodeConnection } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type HandleProps = HandlePropsSystem & {
  class?: ClassValue;
  onconnect?: (connections: NodeConnection[]) => void;
  ondisconnect?: (connections: NodeConnection[]) => void;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

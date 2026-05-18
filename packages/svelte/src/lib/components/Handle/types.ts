import type { HandleConnection, HandleProps as HandlePropsSystem } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type HandleProps = HandlePropsSystem & {
  class?: ClassValue;
  onconnect?: (connections: HandleConnection[]) => void;
  ondisconnect?: (connections: HandleConnection[]) => void;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

import type { Connection, HandleProps as HandlePropsSystem } from '@xyflow/system';
import type { Snippet } from 'svelte';
import type { ClassValue, HTMLAttributes } from 'svelte/elements';

export type HandleProps = HandlePropsSystem & {
  class?: ClassValue;
  onconnect?: (connections: Connection[]) => void;
  ondisconnect?: (connections: Connection[]) => void;
  children?: Snippet;
} & HTMLAttributes<HTMLDivElement>;

import type { ConnectableContext } from '$lib/components/NodeWrapper/types';
import { setContext, getContext, hasContext } from 'svelte';

/**
 * Creates a type-safe context getter and setter pair.
 * Extended from Svelte's official createContext pattern.
 * - When called with an error message string, it throws if the context is not set
 * - When called without arguments, it returns the context value or undefined
 */
function createContext<T>(): [
  {
    (errorMessage: string): T;
    (): T | undefined;
  },
  (context: T) => T
] {
  const key = {};

  return [
    (errorMessage?: string) => {
      if (errorMessage && !hasContext(key)) {
        throw new Error(errorMessage);
      }

      return getContext(key);
    },
    (context) => setContext(key, context)
  ];
}

export const [getNodeIdContext, setNodeIdContext] = createContext<string>();
export const [getNodeConnectableContext, setNodeConnectableContext] =
  createContext<ConnectableContext>();

export const [getEdgeIdContext, setEdgeIdContext] = createContext<string>();

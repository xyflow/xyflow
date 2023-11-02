import type { KeyDefinition } from '$lib/types';

export type KeyHandlerProps = {
  selectionKey?: KeyDefinition;
  multiSelectionKey?: KeyDefinition;
  deleteKey?: KeyDefinition;
  panActivationKey?: KeyDefinition;
};

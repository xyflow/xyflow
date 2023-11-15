import type { KeyDefinition } from '$lib/types';

export type KeyHandlerProps = {
  selectionKey?: KeyDefinition | null;
  multiSelectionKey?: KeyDefinition | null;
  deleteKey?: KeyDefinition | null;
  panActivationKey?: KeyDefinition | null;
  zoomActivationKey?: KeyDefinition | null;
};

import type { KeyDefinition } from '$lib/types';

export type KeyHandlerProps = {
  selectionKey?: KeyDefinition | KeyDefinition[] | null;
  multiSelectionKey?: KeyDefinition | KeyDefinition[] | null;
  deleteKey?: KeyDefinition | KeyDefinition[] | null;
  panActivationKey?: KeyDefinition | KeyDefinition[] | null;
  zoomActivationKey?: KeyDefinition | KeyDefinition[] | null;
};

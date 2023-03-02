import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type { HandleProps, HandleType, XYPosition } from '@reactflow/system';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type ConnectionData = {
  position: XYPosition | null;
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
  status: string | null;
};

export type HandleComponentProps = HandleProps & {
  class?: string;
  style?: string;
};

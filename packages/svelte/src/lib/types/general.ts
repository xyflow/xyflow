import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type {
  Connection,
  FitViewOptionsBase,
  HandleType,
  Position,
  XYPosition
} from '@reactflow/system';

import type { Node } from './nodes';

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

export type HandleComponentProps = {
  type: HandleType;
  position?: Position;
  id?: string;
  class?: string;
  style?: string;
};

export type FitViewOptions = FitViewOptionsBase<Node>;

export type IsValidConnection = (
  connection: Connection,
  { fromNode, toNode }: { fromNode: Node; toNode: Node }
) => boolean;

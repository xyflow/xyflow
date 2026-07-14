import type { Align, Position } from '@xyflow/react';

export const API_DOCS_URL = 'https://reactflow.dev/api-reference/components/node-toolbar';

export const TOOLBAR_POSITIONS = ['top', 'right', 'bottom', 'left'] as const satisfies readonly Position[];
export const TOOLBAR_ALIGNS = ['start', 'center', 'end'] as const satisfies readonly Align[];

export type NodeToolbarStoryArgs = {
  isVisible?: boolean;
  position?: Position;
  offset?: number;
  align?: Align;
  nodeId?: string;
  renderMode?: 'inside-node' | 'external';
};

export const defaultNodeToolbarArgs: NodeToolbarStoryArgs = {
  position: 'top',
  offset: 10,
  align: 'center',
  renderMode: 'inside-node',
};

type ArgTypeConfig = {
  control?: 'boolean' | 'text' | 'select' | 'number';
  description: string;
  options?: unknown[];
  table?: { defaultValue?: { summary?: string } };
};

export const nodeToolbarArgTypes: Record<string, ArgTypeConfig> = {
  isVisible: {
    control: 'boolean',
    description: 'If true, toolbar is visible even when the node is not selected.',
    table: { defaultValue: { summary: 'false (shows on select)' } },
  },
  position: {
    control: 'select',
    options: TOOLBAR_POSITIONS,
    description: 'Position of the toolbar relative to the node.',
    table: { defaultValue: { summary: 'top' } },
  },
  offset: {
    control: 'number',
    description: 'Space between the node and the toolbar in pixels.',
    table: { defaultValue: { summary: '10' } },
  },
  align: {
    control: 'select',
    options: TOOLBAR_ALIGNS,
    description: 'Align the toolbar relative to the node.',
    table: { defaultValue: { summary: 'center' } },
  },
  nodeId: {
    control: 'text',
    description: 'Render a single toolbar for one or more nodes by id (external mode).',
  },
  renderMode: {
    control: 'select',
    options: ['inside-node', 'external'],
    description: 'Render toolbar inside the custom node or externally via nodeId.',
    table: { defaultValue: { summary: 'inside-node' } },
  },
};

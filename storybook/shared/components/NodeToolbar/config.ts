import type { FlowFramework, SharedNode } from '../../types';

export const TOOLBAR_POSITIONS = ['top', 'right', 'bottom', 'left'] as const;
export const TOOLBAR_ALIGNS = ['start', 'center', 'end'] as const;

export const DEMO_NODE_ID = 'demo-node';

export type NodeToolbarStoryArgs = {
  isVisible?: boolean;
  position?: (typeof TOOLBAR_POSITIONS)[number];
  offset?: number;
  align?: (typeof TOOLBAR_ALIGNS)[number];
  nodeId?: string;
  renderMode?: 'inside-node' | 'external';
};

export type ToolbarNodeData = Record<string, unknown> & {
  label: string;
  isVisible?: boolean;
  position?: NodeToolbarStoryArgs['position'];
  offset?: number;
  align?: NodeToolbarStoryArgs['align'];
  renderMode?: NodeToolbarStoryArgs['renderMode'];
};

export const defaultNodeToolbarArgs: NodeToolbarStoryArgs = {
  position: 'top',
  offset: 10,
  align: 'center',
  renderMode: 'inside-node',
};

export function demoNode(args: NodeToolbarStoryArgs): SharedNode {
  return {
    id: DEMO_NODE_ID,
    type: 'ToolbarNode',
    position: { x: 250, y: 200 },
    data: {
      label: 'Select or interact with this node',
      isVisible: args.isVisible,
      position: args.position,
      offset: args.offset,
      align: args.align,
      renderMode: args.renderMode,
    } satisfies ToolbarNodeData,
  };
}

export function apiDocsUrl(framework: FlowFramework) {
  return framework === 'react'
    ? 'https://reactflow.dev/api-reference/components/node-toolbar'
    : 'https://svelteflow.dev/api-reference/components/node-toolbar';
}

type ArgTypeConfig = {
  control?: 'boolean' | 'text' | 'select' | 'number';
  description?: string;
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

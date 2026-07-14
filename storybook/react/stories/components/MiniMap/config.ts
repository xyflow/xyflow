import type { PanelPosition } from '@xyflow/react';

export const API_DOCS_URL = 'https://reactflow.dev/api-reference/components/minimap';

export const PANEL_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'center-left',
  'center-right',
] as const satisfies readonly PanelPosition[];

export type MiniMapStoryArgs = {
  position?: PanelPosition;
  nodeColor?: string;
  nodeStrokeColor?: string;
  nodeClassName?: string;
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  bgColor?: string;
  maskColor?: string;
  maskStrokeColor?: string;
  maskStrokeWidth?: number;
  pannable?: boolean;
  zoomable?: boolean;
  ariaLabel?: string | null;
  inversePan?: boolean;
  zoomStep?: number;
  offsetScale?: number;
  className?: string;
  style?: Record<string, string | number>;
};

export const defaultMiniMapArgs: MiniMapStoryArgs = {
  position: 'bottom-right',
  nodeColor: '#e2e2e2',
  nodeStrokeColor: 'transparent',
  nodeBorderRadius: 5,
  nodeStrokeWidth: 2,
  maskColor: 'rgba(240, 240, 240, 0.6)',
  maskStrokeColor: 'transparent',
  maskStrokeWidth: 1,
  pannable: false,
  zoomable: false,
  ariaLabel: 'Mini Map',
  zoomStep: 10,
  offsetScale: 5,
};

type ArgTypeConfig = {
  control?:
    | 'boolean'
    | 'text'
    | 'color'
    | 'select'
    | 'object'
    | 'number'
    | { type: string; min?: number; max?: number; step?: number };
  description: string;
  options?: unknown[];
  table?: { defaultValue?: { summary?: string } };
};

export const miniMapArgTypes: Record<string, ArgTypeConfig> = {
  position: {
    control: 'select',
    options: PANEL_POSITIONS,
    description: 'Position of minimap on pane.',
    table: { defaultValue: { summary: 'bottom-right' } },
  },
  nodeColor: {
    control: 'color',
    description: 'Color of nodes on minimap.',
    table: { defaultValue: { summary: '#e2e2e2' } },
  },
  nodeStrokeColor: {
    control: 'color',
    description: 'Stroke color of nodes on minimap.',
    table: { defaultValue: { summary: 'transparent' } },
  },
  nodeClassName: { control: 'text', description: 'Class name applied to nodes on minimap.' },
  nodeBorderRadius: {
    control: 'number',
    description: 'Border radius of nodes on minimap.',
    table: { defaultValue: { summary: '5' } },
  },
  nodeStrokeWidth: {
    control: 'number',
    description: 'Stroke width of nodes on minimap.',
    table: { defaultValue: { summary: '2' } },
  },
  bgColor: { control: 'color', description: 'Background color of minimap.' },
  maskColor: {
    control: 'color',
    description: 'Color of the mask covering the non-visible viewport area.',
    table: { defaultValue: { summary: 'rgba(240, 240, 240, 0.6)' } },
  },
  maskStrokeColor: {
    control: 'color',
    description: 'Stroke color of mask representing viewport.',
    table: { defaultValue: { summary: 'transparent' } },
  },
  maskStrokeWidth: {
    control: 'number',
    description: 'Stroke width of mask representing viewport.',
    table: { defaultValue: { summary: '1' } },
  },
  pannable: {
    control: 'boolean',
    description: 'Pan the viewport by dragging inside the minimap.',
    table: { defaultValue: { summary: 'false' } },
  },
  zoomable: {
    control: 'boolean',
    description: 'Zoom the viewport by scrolling inside the minimap.',
    table: { defaultValue: { summary: 'false' } },
  },
  ariaLabel: {
    control: 'text',
    description: 'Accessible name for the minimap.',
    table: { defaultValue: { summary: 'Mini Map' } },
  },
  inversePan: { control: 'boolean', description: 'Invert direction when panning the minimap viewport.' },
  zoomStep: {
    control: 'number',
    description: 'Step size for zooming in/out on minimap.',
    table: { defaultValue: { summary: '10' } },
  },
  offsetScale: {
    control: 'number',
    description: 'Offset the viewport on the minimap, acts like padding.',
    table: { defaultValue: { summary: '5' } },
  },
  className: { control: 'text', description: 'Class applied to the minimap container.' },
  style: { control: 'object', description: 'Style applied to the minimap container.' },
  onClick: { control: false, description: 'Called when minimap is clicked.' },
  onNodeClick: { control: false, description: 'Called when a node on the minimap is clicked.' },
};

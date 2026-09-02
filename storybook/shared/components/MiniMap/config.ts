import type { FlowFramework, StoryArgTypes } from '../../types';
import { PANEL_POSITIONS } from '../panelPositions';

export type SharedMiniMapArgs = {
  position?: (typeof PANEL_POSITIONS)[number];
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

export const defaultMiniMapArgs: SharedMiniMapArgs = {
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
};

export function miniMapArgTypes(framework: FlowFramework): StoryArgTypes {
  const base: StoryArgTypes = {
    position: {
      control: 'select',
      options: PANEL_POSITIONS,
      description: 'Position of minimap on pane.',
    },
    nodeColor: {
      control: 'color',
      description: 'Color of nodes on minimap.',
    },
    nodeStrokeColor: {
      control: 'color',
      description: 'Stroke color of nodes on minimap.',
    },
    nodeBorderRadius: {
      control: 'number',
      description: 'Border radius of nodes on minimap.',
    },
    nodeStrokeWidth: {
      control: 'number',
      description: 'Stroke width of nodes on minimap.',
    },
    bgColor: { control: 'color', description: 'Background color of minimap.' },
    maskColor: {
      control: 'color',
      description: 'Color of the mask covering the non-visible viewport area.',
    },
    maskStrokeColor: {
      control: 'color',
      description: 'Stroke color of mask representing viewport.',
    },
    maskStrokeWidth: {
      control: 'number',
      description: 'Stroke width of mask representing viewport.',
    },
    pannable: {
      control: 'boolean',
      description: 'Pan the viewport by dragging inside the minimap.',
    },
    zoomable: {
      control: 'boolean',
      description: 'Zoom the viewport by scrolling inside the minimap.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the minimap.',
    },
    inversePan: { control: 'boolean', description: 'Invert direction when panning the minimap viewport.' },
    zoomStep: {
      control: 'number',
      description: 'Step size for zooming in/out on minimap.',
    },
  };

  if (framework === 'react') {
    return {
      ...base,
      nodeClassName: { control: 'text', description: 'Class name applied to nodes on minimap.' },
      offsetScale: {
        control: 'number',
        description: 'Offset the viewport on the minimap, acts like padding.',
      },
      className: { control: 'text', description: 'Class applied to the minimap container.' },
      style: { control: 'object', description: 'Style applied to the minimap container.' },
      onClick: { control: false, description: 'Called when minimap is clicked.' },
      onNodeClick: { control: false, description: 'Called when a node on the minimap is clicked.' },
    };
  }

  return {
    ...base,
    nodeClass: { control: 'text', description: 'Class applied to nodes on the minimap.' },
    class: { control: 'text', description: 'Class applied to the minimap container.' },
  };
}

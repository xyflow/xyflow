import type { SharedEdge, SharedNode, StoryArgTypes } from '../../types';

export type SharedA11yArgs = {
  autoPanOnNodeFocus?: boolean;
  ariaNodeDefault?: string;
  ariaNodeKeyboardDisabled?: string;
  ariaNodeLiveMessagePrefix?: string;
  ariaEdgeDefault?: string;
  ariaControlsLabel?: string;
  ariaControlsZoomIn?: string;
  ariaControlsZoomOut?: string;
  ariaControlsFitView?: string;
  ariaControlsInteractive?: string;
  ariaMinimap?: string;
};

export const initialNodes: SharedNode[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'A11y Node 1' },
    position: { x: 250, y: 5 },
    domAttributes: {
      tabIndex: 10,
      'aria-roledescription': 'A11y Node',
    },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 1000, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 100, y: 100 },
    ariaRole: 'button',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 300, y: 100 },
  },
  {
    id: '5',
    data: { label: 'Node 5' },
    position: { x: 400, y: 200 },
  },
  {
    id: '6',
    data: { label: 'Node 6' },
    position: { x: -1000, y: 200 },
  },
];

export const initialEdges: SharedEdge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e1-5', source: '4', target: '5' },
  { id: 'e1-6', source: '3', target: '6' },
];

export const defaultA11yArgs: Required<SharedA11yArgs> = {
  autoPanOnNodeFocus: true,
  ariaNodeDefault: 'Custom Node Desc.',
  ariaNodeKeyboardDisabled: 'Custom Keyboard Desc.',
  ariaNodeLiveMessagePrefix: 'Custom Moved selected node',
  ariaEdgeDefault: 'Custom Edge Desc.',
  ariaControlsLabel: 'Custom Controls Aria Label',
  ariaControlsZoomIn: 'Custom Zoom in',
  ariaControlsZoomOut: 'Custom Zoom Out',
  ariaControlsFitView: 'Custom Fit View',
  ariaControlsInteractive: 'Custom Toggle Interactivity',
  ariaMinimap: 'Custom Aria Label',
};

export const a11yArgTypes: StoryArgTypes = {
  autoPanOnNodeFocus: {
    control: 'boolean',
    description: 'Pan the viewport when a node receives focus.',
  },
  ariaNodeDefault: { control: 'text', description: 'Aria description for nodes.' },
  ariaNodeKeyboardDisabled: {
    control: 'text',
    description: 'Aria description for nodes when keyboard controls are disabled.',
  },
  ariaNodeLiveMessagePrefix: {
    control: 'text',
    description: 'Prefix for the live region message after moving a node with the keyboard.',
  },
  ariaEdgeDefault: { control: 'text', description: 'Aria description for edges.' },
  ariaControlsLabel: { control: 'text', description: 'Aria label for the controls panel.' },
  ariaControlsZoomIn: { control: 'text', description: 'Aria label for zoom in.' },
  ariaControlsZoomOut: { control: 'text', description: 'Aria label for zoom out.' },
  ariaControlsFitView: { control: 'text', description: 'Aria label for fit view.' },
  ariaControlsInteractive: { control: 'text', description: 'Aria label for toggling interactivity.' },
  ariaMinimap: { control: 'text', description: 'Aria label for the minimap.' },
};

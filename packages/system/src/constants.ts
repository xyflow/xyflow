import { CoordinateExtent } from './types';

export const infiniteExtent: CoordinateExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

export const elementSelectionKeys = ['Enter', ' ', 'Escape'];

export const defaultAriaLabelConfig = {
  'node.a11yDescription.default':
    'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.keyboardDisabled':
    'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }: { direction: string; x: number; y: number }) =>
    `Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
  'edge.a11yDescription.default':
    'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',

  // Control elements
  'controls.ariaLabel': 'Control Panel',
  'controls.zoomIn.ariaLabel': 'Zoom In',
  'controls.zoomOut.ariaLabel': 'Zoom Out',
  'controls.fitView.ariaLabel': 'Fit View',
  'controls.interactive.ariaLabel': 'Toggle Interactivity',

  // Mini map
  'minimap.ariaLabel': 'Mini Map',

  // Handle
  'handle.ariaLabel': 'Handle',
};

export type AriaLabelConfig = typeof defaultAriaLabelConfig;

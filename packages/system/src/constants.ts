import { CoordinateExtent, HandleType } from './types';

export const errorMessages = {
  error001: () =>
    '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001',
  error002: () =>
    "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (nodeType: string) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => 'The React Flow parent container needs a width and a height to render the graph.',
  error005: () => 'Only child nodes can use a parent extent.',
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id: string) => `The old edge with id=${id} does not exist.`,
  error009: (type: string) => `Marker type "${type}" doesn't exist.`,
  error008: (
    handleType: HandleType,
    { id, sourceHandle, targetHandle }: { id: string; sourceHandle: string | null; targetHandle: string | null }
  ) =>
    `Couldn't create edge for ${handleType} handle id: "${
      handleType === 'source' ? sourceHandle : targetHandle
    }", edge id: ${id}.`,
  error010: () => 'Handle: No node id found. Make sure to only use a Handle inside a custom Node.',
  error011: (edgeType: string) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id: string) =>
    `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (lib: string = 'react') =>
    `It seems that you haven't loaded the styles. Please import '@xyflow/${lib}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () =>
    'useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.',
  error015: () =>
    'It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs.',
};

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

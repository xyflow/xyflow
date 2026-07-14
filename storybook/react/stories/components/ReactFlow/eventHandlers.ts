import { fn } from 'storybook/test';

export const EVENT_HANDLER_ARG_NAMES = [
  'onError',
  'onInit',
  'onDelete',
  'onBeforeDelete',
  'onNodeClick',
  'onNodeDoubleClick',
  'onNodeDragStart',
  'onNodeDrag',
  'onNodeDragStop',
  'onNodeMouseEnter',
  'onNodeMouseMove',
  'onNodeMouseLeave',
  'onNodeContextMenu',
  'onNodesDelete',
  'onNodesChange',
  'onEdgeClick',
  'onEdgeDoubleClick',
  'onEdgeMouseEnter',
  'onEdgeMouseMove',
  'onEdgeMouseLeave',
  'onEdgeContextMenu',
  'onReconnect',
  'onReconnectStart',
  'onReconnectEnd',
  'onEdgesDelete',
  'onEdgesChange',
  'onConnect',
  'onConnectStart',
  'onConnectEnd',
  'onClickConnectStart',
  'onClickConnectEnd',
  'isValidConnection',
  'onMove',
  'onMoveStart',
  'onMoveEnd',
  'onViewportChange',
  'onPaneClick',
  'onPaneContextMenu',
  'onPaneScroll',
  'onPaneMouseMove',
  'onPaneMouseEnter',
  'onPaneMouseLeave',
  'onSelectionChange',
  'onSelectionDragStart',
  'onSelectionDrag',
  'onSelectionDragStop',
  'onSelectionStart',
  'onSelectionEnd',
  'onSelectionContextMenu',
] as const;

export type EventHandlerArgName = (typeof EVENT_HANDLER_ARG_NAMES)[number];

export function createEventHandlerArgs() {
  return Object.fromEntries(EVENT_HANDLER_ARG_NAMES.map((name) => [name, fn()])) as Record<
    EventHandlerArgName,
    ReturnType<typeof fn>
  >;
}

export const eventHandlerArgTypes = Object.fromEntries(
  EVENT_HANDLER_ARG_NAMES.map((name) => [
    name,
    {
      control: false,
      description: `React Flow event handler — logged in the Storybook Actions panel.`,
      table: { category: 'Event handlers' },
    },
  ])
);

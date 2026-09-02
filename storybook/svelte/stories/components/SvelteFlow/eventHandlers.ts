import { fn } from 'storybook/test';

export const EVENT_HANDLER_ARG_NAMES = [
  'onflowerror',
  'oninit',
  'ondelete',
  'onbeforedelete',
  'onnodeclick',
  'onnodedragstart',
  'onnodedrag',
  'onnodedragstop',
  'onnodepointerenter',
  'onnodepointermove',
  'onnodepointerleave',
  'onnodecontextmenu',
  'onedgeclick',
  'onedgecontextmenu',
  'onedgepointerenter',
  'onedgepointerleave',
  'onreconnect',
  'onreconnectstart',
  'onreconnectend',
  'onbeforereconnect',
  'onconnect',
  'onconnectstart',
  'onconnectend',
  'onbeforeconnect',
  'onclickconnectstart',
  'onclickconnectend',
  'isValidConnection',
  'onmove',
  'onmovestart',
  'onmoveend',
  'onpaneclick',
  'onpanecontextmenu',
  'onselectionchange',
  'onselectiondragstart',
  'onselectiondrag',
  'onselectiondragstop',
  'onselectionstart',
  'onselectionend',
  'onselectionclick',
  'onselectioncontextmenu',
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
      description: `Svelte Flow event handler — logged in the Storybook Actions panel.`,
      table: { category: 'Event handlers' },
    },
  ])
);

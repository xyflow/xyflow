import type { FlowFramework } from '../../types';

export const PANEL_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'center-left',
  'center-right',
] as const;

export type ControlsStoryArgs = {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  fitViewOptions?: Record<string, unknown>;
  position?: (typeof PANEL_POSITIONS)[number];
  className?: string;
  style?: Record<string, string | number>;
  'aria-label'?: string;
  orientation?: 'horizontal' | 'vertical';
};

export function defaultControlsArgs(framework: FlowFramework): ControlsStoryArgs {
  return {
    showZoom: true,
    showFitView: true,
    showInteractive: true,
    position: 'bottom-left',
    'aria-label': framework === 'react' ? 'React Flow controls' : 'Svelte Flow controls',
    orientation: 'vertical',
  };
}

export function apiDocsUrl(framework: FlowFramework) {
  return framework === 'react'
    ? 'https://reactflow.dev/api-reference/components/controls'
    : 'https://svelteflow.dev/api-reference/components/controls';
}

type ArgTypeConfig = {
  control?:
    | 'boolean'
    | 'text'
    | 'select'
    | 'object'
    | { type: string; min?: number; max?: number; step?: number };
  description: string;
  options?: unknown[];
  table?: { defaultValue?: { summary?: string } };
};

export function controlsArgTypes(framework: FlowFramework): Record<string, ArgTypeConfig> {
  const base: Record<string, ArgTypeConfig> = {
    showZoom: {
      control: 'boolean',
      description: 'Show zoom in and zoom out buttons.',
      table: { defaultValue: { summary: 'true' } },
    },
    showFitView: {
      control: 'boolean',
      description: 'Show the fit view button.',
      table: { defaultValue: { summary: 'true' } },
    },
    fitViewOptions: { control: 'object', description: 'Options passed to fitView when the button is clicked.' },
    position: {
      control: 'select',
      options: PANEL_POSITIONS,
      description: 'Position of the controls on the pane.',
      table: { defaultValue: { summary: 'bottom-left' } },
    },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the controls.',
      table: { defaultValue: { summary: 'React Flow controls' } },
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation of the control buttons.',
      table: { defaultValue: { summary: 'vertical' } },
    },
  };

  if (framework === 'react') {
    return {
      ...base,
      showInteractive: {
        control: 'boolean',
        description: 'Show button for toggling interactivity.',
        table: { defaultValue: { summary: 'true' } },
      },
      className: { control: 'text', description: 'Class name applied to the container.' },
      style: { control: 'object', description: 'Style applied to the container.' },
      onZoomIn: { control: false, description: 'Called in addition to default zoom-in behavior.' },
      onZoomOut: { control: false, description: 'Called in addition to default zoom-out behavior.' },
      onFitView: { control: false, description: 'Called when the fit view button is clicked.' },
      onInteractiveChange: { control: false, description: 'Called when the interactive lock button is clicked.' },
    };
  }

  return {
    ...base,
    showInteractive: {
      control: 'boolean',
      description: 'Show button for toggling interactivity (maps to showLock in Svelte).',
      table: { defaultValue: { summary: 'true' } },
    },
    class: { control: 'text', description: 'Class applied to the container.' },
  };
}

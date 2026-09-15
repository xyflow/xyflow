export type FlowFramework = 'react' | 'svelte';

export type StoryArgTypes = Record<
  string,
  {
    control?:
      | false
      | 'boolean'
      | 'text'
      | 'color'
      | 'select'
      | 'object'
      | 'number'
      | { type: string; min?: number; max?: number; step?: number };
    description?: string;
    options?: readonly unknown[];
  }
>;

export type SharedNode = Record<string, unknown> & {
  id: string;
  data?: Record<string, unknown>;
  position: { x: number; y: number };
};

export type SharedEdge = Record<string, unknown> & {
  id: string;
  source: string;
  target: string;
};

export type SharedFlowProps = Record<string, unknown> & {
  nodes?: SharedNode[];
  edges?: SharedEdge[];
};

export type SharedFlowConfig = {
  flowProps?: SharedFlowProps;
};

export type StoryPlayContext = {
  canvasElement: HTMLElement;
};

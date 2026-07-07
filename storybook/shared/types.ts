export type FlowFramework = 'react' | 'svelte';

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

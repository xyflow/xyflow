export type SharedNode = {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  type?: string;
};

export type SharedEdge = {
  id: string;
  source: string;
  target: string;
};

export type SharedFlowConfig = {
  flowProps?: {
    minZoom?: number;
    maxZoom?: number;
    fitView?: boolean;
    nodes: SharedNode[];
    edges: SharedEdge[];
  };
};

export type FlowFramework = 'react' | 'svelte';

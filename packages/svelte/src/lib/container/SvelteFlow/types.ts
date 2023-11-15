import type { DOMAttributes } from 'svelte/elements';
import type {
  ConnectionLineType,
  NodeOrigin,
  Viewport,
  SelectionMode,
  SnapGrid,
  OnMoveStart,
  OnMove,
  OnMoveEnd,
  CoordinateExtent,
  PanOnScrollMode,
  IsValidConnection,
  OnError,
  ConnectionMode,
  PanelPosition,
  ProOptions
} from '@xyflow/system';

import type {
  Edge,
  Node,
  NodeTypes,
  KeyDefinition,
  EdgeTypes,
  DefaultEdgeOptions,
  FitViewOptions
} from '$lib/types';
import type { Writable } from 'svelte/store';

export type SvelteFlowProps = DOMAttributes<HTMLDivElement> & {
  id?: string;
  nodes: Writable<Node[]>;
  edges: Writable<Edge[]>;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  selectionKey?: KeyDefinition | null;
  panActivationKey?: KeyDefinition | null;
  deleteKey?: KeyDefinition | null;
  multiSelectionKey?: KeyDefinition | null;
  zoomActivationKey?: KeyDefinition | null;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  nodeOrigin?: NodeOrigin;
  nodeDragThreshold?: number;
  minZoom?: number;
  maxZoom?: number;
  initialViewport?: Viewport;
  viewport?: Writable<Viewport>;
  connectionRadius?: number;
  connectionMode?: ConnectionMode;
  connectionLineStyle?: string;
  connectionLineContainerStyle?: string;
  selectionMode?: SelectionMode;
  snapGrid?: SnapGrid;
  defaultMarkerColor?: string;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  translateExtent?: CoordinateExtent;
  panOnScrollMode?: PanOnScrollMode;
  preventScrolling?: boolean;
  zoomOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  onlyRenderVisibleElements?: boolean;
  autoPanOnConnect?: boolean;
  autoPanOnNodeDrag?: boolean;
  attributionPosition?: PanelPosition;
  proOptions?: ProOptions;
  defaultEdgeOptions?: DefaultEdgeOptions;
  width?: number;
  height?: number;

  class?: string;
  style?: string;

  connectionLineType?: ConnectionLineType;
  isValidConnection?: IsValidConnection;

  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;
  onError?: OnError;
};

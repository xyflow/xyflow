import type { DOMAttributes } from 'svelte/elements';
import type {
  Connection,
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
  HandleType,
  NodeBase,
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
  selectionKey?: KeyDefinition;
  panActivationKey?: KeyDefinition;
  deleteKey?: KeyDefinition;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  nodeOrigin?: NodeOrigin;
  minZoom?: number;
  maxZoom?: number;
  initialViewport?: Viewport;
  connectionRadius?: number;
  connectionMode?: ConnectionMode;
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
  onlyRenderVisibleElements?: boolean;
  autoPanOnConnect?: boolean;
  autoPanOnNodeDrag?: boolean;
  attributionPosition?: PanelPosition;
  proOptions?: ProOptions;
  defaultEdgeOptions?: DefaultEdgeOptions;

  class?: string;
  style?: string;

  connectionLineType?: ConnectionLineType;
  isValidConnection?: IsValidConnection;

  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;
  onError?: OnError;

  'on:nodeclick'?: CustomEvent<{ event: MouseEvent | TouchEvent; node: Node }>;
  'on:nodemouseenter'?: CustomEvent<{ event: MouseEvent; node: Node }>;
  'on:nodemousemove'?: CustomEvent<{ event: MouseEvent; node: Node }>;
  'on:nodemouseleave'?: CustomEvent<{ event: MouseEvent; node: Node }>;
  'on:edgeclick'?: CustomEvent<{ event: MouseEvent; edge: Edge }>;
  'on:edgecontextmenu'?: CustomEvent<{ event: MouseEvent; edge: Edge }>;
  'on:connectstart'?: CustomEvent<{
    event: MouseEvent | TouchEvent;
    nodeId?: string;
    handleId?: string;
    handleType?: HandleType;
  }>;
  'on:connect'?: CustomEvent<{ connection: Connection }>;
  'on:connectend'?: CustomEvent<{ event: MouseEvent | TouchEvent }>;
  'on:paneclick'?: CustomEvent<{ event: MouseEvent | TouchEvent }>;
  'on:panecontextmenu'?: CustomEvent<{ event: MouseEvent }>;
  'on:nodedragstart'?: CustomEvent<{ event: MouseEvent; node: NodeBase; nodes: NodeBase[] }>;
  'on:nodedrag'?: CustomEvent<{ event: MouseEvent; node: NodeBase; nodes: NodeBase[] }>;
  'on:nodedragstop'?: CustomEvent<{ event: MouseEvent; node: NodeBase; nodes: NodeBase[] }>;
  'on:nodecontextmenu'?: CustomEvent<{ event: MouseEvent; node: NodeBase }>;
};

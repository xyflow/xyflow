import type { DOMAttributes } from 'svelte/elements';
import type {
  Connection,
  ConnectionLineType,
  NodeOrigin,
  OnConnectStartParams,
  Viewport,
  SelectionMode,
  SnapGrid,
  OnMoveStart,
  OnMove,
  OnMoveEnd,
  CoordinateExtent,
  PanOnScrollMode,
  IsValidConnection
} from '@xyflow/system';

import type { Edge, Node, NodeTypes, KeyDefinition, EdgeTypes } from '$lib/types';
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
  nodeOrigin?: NodeOrigin;
  minZoom?: number;
  maxZoom?: number;
  initialViewport?: Viewport;
  connectionRadius?: number;
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

  class?: string;
  style?: string;

  connectionLineType?: ConnectionLineType;
  isValidConnection?: IsValidConnection;

  onMoveStart?: OnMoveStart;
  onMove?: OnMove;
  onMoveEnd?: OnMoveEnd;

  'on:nodeclick'?: CustomEvent<Node>;
  'on:nodemouseenter'?: CustomEvent<Node>;
  'on:nodemousemove'?: CustomEvent<Node>;
  'on:nodemouseleave'?: CustomEvent<Node>;
  'on:edgeclick'?: CustomEvent<Edge>;
  'on:connectstart'?: CustomEvent<{ event: MouseEvent | TouchEvent }>;
  'on:connect'?: CustomEvent<Connection>;
  'on:connectend'?: CustomEvent<MouseEvent | TouchEvent>;
  'on:paneclick'?: CustomEvent;
  'on:panecontextmenu'?: CustomEvent;
};

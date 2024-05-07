import { Map as SvelteMap } from 'svelte/reactivity';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  devWarn,
  type Viewport,
  type NodeLookup,
  type ConnectionLookup,
  type ParentLookup,
  type EdgeLookup
} from '@xyflow/system';

import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import GroupNode from '$lib/components/nodes/GroupNode.svelte';

import {
  BezierEdgeInternal,
  SmoothStepEdgeInternal,
  StraightEdgeInternal,
  StepEdgeInternal
} from '$lib/components/edges';

import { ReactiveMap, derivedSignal, signal } from './signals.svelte';
import type { SvelteFlowStoreProperties, SvelteFlowStoreState } from './types';
import { getDerivedConnection, initConnectionUpdateData } from './derived-connection';
import type { Edge } from '$lib/types';

export const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  group: GroupNode
};

export const initialEdgeTypes = {
  straight: StraightEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  default: BezierEdgeInternal,
  step: StepEdgeInternal
};

export const getInitialStore = () => {
  // TODO: what kind of maps are we talking
  const nodeLookup: NodeLookup = new ReactiveMap();
  const edgeLookup: EdgeLookup = new SvelteMap<string, Edge>();
  const parentLookup: ParentLookup = new SvelteMap();
  const connectionLookup: ConnectionLookup = new Map();

  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  const store = Object.defineProperties<SvelteFlowStoreState>(
    // @ts-expect-error {} does not match Store, which is fine
    {},
    {
      nodes: signal<SvelteFlowStoreState['nodes']>([]),
      edges: signal<SvelteFlowStoreState['edges']>([]),
      autoPanOnConnect: signal<SvelteFlowStoreState['autoPanOnConnect']>(true),
      autoPanOnNodeDrag: signal<SvelteFlowStoreState['autoPanOnNodeDrag']>(true),
      connectionData: signal<SvelteFlowStoreState['connectionData']>(initConnectionUpdateData),
      connectionLineType: signal<SvelteFlowStoreState['connectionLineType']>(
        ConnectionLineType.Bezier
      ),
      connectionLookup: signal<SvelteFlowStoreState['connectionLookup']>(connectionLookup),
      connectionMode: signal<SvelteFlowStoreState['connectionMode']>(ConnectionMode.Strict),
      connectionRadius: signal<SvelteFlowStoreState['connectionRadius']>(20),
      defaultMarkerColor: signal<SvelteFlowStoreState['defaultMarkerColor']>('#b1b1b7'),
      deleteKeyPressed: signal<SvelteFlowStoreState['deleteKeyPressed']>(false),
      domNode: signal<SvelteFlowStoreState['domNode']>(null),
      dragging: signal<SvelteFlowStoreState['dragging']>(false),
      edgeLookup: signal<SvelteFlowStoreState['edgeLookup']>(edgeLookup),
      edgesInitialized: signal<SvelteFlowStoreState['edgesInitialized']>(true),
      edgeTypes: signal<SvelteFlowStoreState['edgeTypes']>(initialEdgeTypes),
      elementsSelectable: signal<SvelteFlowStoreState['elementsSelectable']>(true),
      fitViewOnInit: signal<SvelteFlowStoreState['fitViewOnInit']>(false),
      fitViewOnInitDone: signal<SvelteFlowStoreState['fitViewOnInitDone']>(false),
      fitViewOptions: signal<SvelteFlowStoreState['fitViewOptions']>({}),
      flowId: signal<SvelteFlowStoreState['flowId']>(null),
      height: signal<SvelteFlowStoreState['height']>(500),
      initialized: signal<SvelteFlowStoreState['initialized']>(true),
      isValidConnection: signal<SvelteFlowStoreState['isValidConnection']>(() => true),
      markers: signal<SvelteFlowStoreState['markers']>([]),
      maxZoom: signal<SvelteFlowStoreState['maxZoom']>(2),
      minZoom: signal<SvelteFlowStoreState['minZoom']>(0.5),
      multiselectionKeyPressed: signal<SvelteFlowStoreState['multiselectionKeyPressed']>(false),
      nodeDragThreshold: signal<SvelteFlowStoreState['nodeDragThreshold']>(1),
      nodeExtent: signal<SvelteFlowStoreState['nodeExtent']>(infiniteExtent),
      nodeLookup: signal<SvelteFlowStoreState['nodeLookup']>(nodeLookup),
      nodeOrigin: signal<SvelteFlowStoreState['nodeOrigin']>([0, 0]),
      nodesConnectable: signal<SvelteFlowStoreState['nodesConnectable']>(true),
      nodesDraggable: signal<SvelteFlowStoreState['nodesDraggable']>(true),
      nodesInitialized: signal<SvelteFlowStoreState['nodesInitialized']>(true),
      nodeTypes: signal<SvelteFlowStoreState['nodeTypes']>(initialNodeTypes),
      onbeforedelete: signal<SvelteFlowStoreState['onbeforedelete']>(undefined),
      onconnect: signal<SvelteFlowStoreState['onconnect']>(undefined),
      onconnectend: signal<SvelteFlowStoreState['onconnectend']>(undefined),
      onconnectstart: signal<SvelteFlowStoreState['onconnectstart']>(undefined),
      ondelete: signal<SvelteFlowStoreState['ondelete']>(undefined),
      onedgecreate: signal<SvelteFlowStoreState['onedgecreate']>(undefined),
      onerror: signal<SvelteFlowStoreState['onerror']>(devWarn),
      onlyRenderVisibleElements: signal<SvelteFlowStoreState['onlyRenderVisibleElements']>(false),
      panActivationKeyPressed: signal<SvelteFlowStoreState['panActivationKeyPressed']>(false),
      panZoom: signal<SvelteFlowStoreState['panZoom']>(null),
      parentLookup: signal<SvelteFlowStoreState['parentLookup']>(parentLookup),
      selectionKeyPressed: signal<SvelteFlowStoreState['selectionKeyPressed']>(false),
      selectionMode: signal<SvelteFlowStoreState['selectionMode']>(SelectionMode.Partial),
      selectionRect: signal<SvelteFlowStoreState['selectionRect']>(null),
      selectionRectMode: signal<SvelteFlowStoreState['selectionRectMode']>(null),
      selectNodesOnDrag: signal<SvelteFlowStoreState['selectNodesOnDrag']>(true),
      snapGrid: signal<SvelteFlowStoreState['snapGrid']>(null),
      translateExtent: signal<SvelteFlowStoreState['translateExtent']>(infiniteExtent),
      viewport: signal<SvelteFlowStoreState['viewport']>(viewport),
      viewportInitialized: signal<SvelteFlowStoreState['viewportInitialized']>(false),
      // visibleEdges: signal<SvelteFlowStoreState['visibleEdges']>([]),
      visibleNodes: signal<SvelteFlowStoreState['visibleNodes']>([]),
      width: signal<SvelteFlowStoreState['width']>(500),
      zoomActivationKeyPressed: signal<SvelteFlowStoreState['zoomActivationKeyPressed']>(false)
    } satisfies SvelteFlowStoreProperties
  );

  Object.defineProperties(store, {
    connection: derivedSignal(() =>
      getDerivedConnection(
        store.connectionData,
        store.connectionMode,
        store.nodeLookup,
        store.viewport
      )
    )
  });

  return store;
};

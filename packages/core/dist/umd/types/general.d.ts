import type { MouseEvent as ReactMouseEvent, ComponentType, MemoExoticComponent } from 'react';
import type { D3DragEvent, Selection as D3Selection, SubjectPosition, ZoomBehavior } from 'd3';
import type { XYPosition, Rect, Transform, CoordinateExtent } from './utils';
import type { NodeChange, EdgeChange } from './changes';
import type { Node, NodeInternals, NodeDimensionUpdate, NodeProps, WrapNodeProps, NodeDragItem, NodeDragHandler, SelectionDragHandler, NodeOrigin } from './nodes';
import type { Edge, EdgeProps, WrapEdgeProps } from './edges';
import type { HandleType, StartHandle } from './handles';
import type { DefaultEdgeOptions } from '.';
import type { ReactFlowInstance } from './instance';
export declare type NodeTypes = {
    [key: string]: ComponentType<NodeProps>;
};
export declare type NodeTypesWrapped = {
    [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>>;
};
export declare type EdgeTypes = {
    [key: string]: ComponentType<EdgeProps>;
};
export declare type EdgeTypesWrapped = {
    [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>>;
};
export declare type FitView = (fitViewOptions?: FitViewOptions) => void;
export declare type Project = (position: XYPosition) => XYPosition;
export declare type OnNodesChange = (changes: NodeChange[]) => void;
export declare type OnEdgesChange = (changes: EdgeChange[]) => void;
export declare type OnNodesDelete = (nodes: Node[]) => void;
export declare type OnEdgesDelete = (edges: Edge[]) => void;
export declare type OnMove = (event: MouseEvent | TouchEvent, viewport: Viewport) => void;
export declare type OnMoveStart = OnMove;
export declare type OnMoveEnd = OnMove;
export declare type ZoomInOut = (options?: ViewportHelperFunctionOptions) => void;
export declare type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => void;
export declare type GetZoom = () => number;
export declare type GetViewport = () => Viewport;
export declare type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => void;
export declare type SetCenter = (x: number, y: number, options?: SetCenterOptions) => void;
export declare type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => void;
export declare type OnInit<NodeData = any, EdgeData = any> = (reactFlowInstance: ReactFlowInstance<NodeData, EdgeData>) => void;
export interface Connection {
    source: string | null;
    target: string | null;
    sourceHandle: string | null;
    targetHandle: string | null;
}
export declare enum ConnectionMode {
    Strict = "strict",
    Loose = "loose"
}
export declare type OnConnect = (connection: Connection) => void;
export declare type FitViewOptions = {
    padding?: number;
    includeHiddenNodes?: boolean;
    minZoom?: number;
    maxZoom?: number;
    duration?: number;
};
export declare type OnConnectStartParams = {
    nodeId: string | null;
    handleId: string | null;
    handleType: HandleType | null;
};
export declare type OnConnectStart = (event: ReactMouseEvent, params: OnConnectStartParams) => void;
export declare type OnConnectEnd = (event: MouseEvent) => void;
export declare type Viewport = {
    x: number;
    y: number;
    zoom: number;
};
export declare type KeyCode = string | Array<string>;
export declare type SnapGrid = [number, number];
export declare enum PanOnScrollMode {
    Free = "free",
    Vertical = "vertical",
    Horizontal = "horizontal"
}
export declare type ViewportHelperFunctionOptions = {
    duration?: number;
};
export declare type SetCenterOptions = ViewportHelperFunctionOptions & {
    zoom?: number;
};
export declare type FitBoundsOptions = ViewportHelperFunctionOptions & {
    padding?: number;
};
export declare type UnselectNodesAndEdgesParams = {
    nodes?: Node[];
    edges?: Edge[];
};
export declare type OnViewportChange = (viewport: Viewport) => void;
export declare type ViewportHelperFunctions = {
    zoomIn: ZoomInOut;
    zoomOut: ZoomInOut;
    zoomTo: ZoomTo;
    getZoom: GetZoom;
    setViewport: SetViewport;
    getViewport: GetViewport;
    fitView: FitView;
    setCenter: SetCenter;
    fitBounds: FitBounds;
    project: Project;
    viewportInitialized: boolean;
};
export declare type ReactFlowStore = {
    rfId: string;
    width: number;
    height: number;
    transform: Transform;
    nodeInternals: NodeInternals;
    edges: Edge[];
    onNodesChange: OnNodesChange | null;
    onEdgesChange: OnEdgesChange | null;
    hasDefaultNodes: boolean;
    hasDefaultEdges: boolean;
    domNode: HTMLDivElement | null;
    paneDragging: boolean;
    noPanClassName: string;
    d3Zoom: ZoomBehavior<Element, unknown> | null;
    d3Selection: D3Selection<Element, unknown, null, undefined> | null;
    d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
    minZoom: number;
    maxZoom: number;
    translateExtent: CoordinateExtent;
    nodeExtent: CoordinateExtent;
    nodeOrigin: NodeOrigin;
    nodesSelectionActive: boolean;
    userSelectionActive: boolean;
    userSelectionRect: SelectionRect | null;
    connectionNodeId: string | null;
    connectionHandleId: string | null;
    connectionHandleType: HandleType | null;
    connectionPosition: XYPosition;
    connectionMode: ConnectionMode;
    snapToGrid: boolean;
    snapGrid: SnapGrid;
    nodesDraggable: boolean;
    nodesConnectable: boolean;
    nodesFocusable: boolean;
    edgesFocusable: boolean;
    elementsSelectable: boolean;
    elevateNodesOnSelect: boolean;
    multiSelectionActive: boolean;
    connectionStartHandle: StartHandle | null;
    onNodeDragStart?: NodeDragHandler;
    onNodeDrag?: NodeDragHandler;
    onNodeDragStop?: NodeDragHandler;
    onSelectionDragStart?: SelectionDragHandler;
    onSelectionDrag?: SelectionDragHandler;
    onSelectionDragStop?: SelectionDragHandler;
    onConnect?: OnConnect;
    onConnectStart?: OnConnectStart;
    onConnectEnd?: OnConnectEnd;
    onClickConnectStart?: OnConnectStart;
    onClickConnectEnd?: OnConnectEnd;
    connectOnClick: boolean;
    defaultEdgeOptions?: DefaultEdgeOptions;
    fitViewOnInit: boolean;
    fitViewOnInitDone: boolean;
    fitViewOnInitOptions: FitViewOptions | undefined;
    onNodesDelete?: OnNodesDelete;
    onEdgesDelete?: OnEdgesDelete;
    onViewportChangeStart?: OnViewportChange;
    onViewportChange?: OnViewportChange;
    onViewportChangeEnd?: OnViewportChange;
    onSelectionChange?: OnSelectionChangeFunc;
    ariaLiveMessage: string;
};
export declare type ReactFlowActions = {
    setNodes: (nodes: Node[]) => void;
    getNodes: () => Node[];
    setEdges: (edges: Edge[]) => void;
    setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => void;
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => void;
    updateNodePositions: (nodeDragItems: NodeDragItem[] | Node[], positionChanged: boolean, dragging: boolean) => void;
    resetSelectedElements: () => void;
    unselectNodesAndEdges: (params?: UnselectNodesAndEdgesParams) => void;
    addSelectedNodes: (nodeIds: string[]) => void;
    addSelectedEdges: (edgeIds: string[]) => void;
    setMinZoom: (minZoom: number) => void;
    setMaxZoom: (maxZoom: number) => void;
    setTranslateExtent: (translateExtent: CoordinateExtent) => void;
    setNodeExtent: (nodeExtent: CoordinateExtent) => void;
    cancelConnection: () => void;
    reset: () => void;
    triggerNodeChanges: (changes: NodeChange[]) => void;
};
export declare type ReactFlowState = ReactFlowStore & ReactFlowActions;
export declare type UpdateNodeInternals = (nodeId: string) => void;
export declare type OnSelectionChangeParams = {
    nodes: Node[];
    edges: Edge[];
};
export declare type OnSelectionChangeFunc = (params: OnSelectionChangeParams) => void;
export declare type PanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export declare type ProOptions = {
    account?: string;
    hideAttribution: boolean;
};
export declare type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export declare enum SelectionMode {
    Partial = "partial",
    Full = "full"
}
export declare type SelectionRect = Rect & {
    startX: number;
    startY: number;
};
//# sourceMappingURL=general.d.ts.map
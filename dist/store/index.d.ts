import { Action } from 'easy-peasy';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { ElementId, Elements, Transform, Node, Edge, Rect, Dimensions, XYPosition, OnConnectFunc, SelectionRect, HandleElement } from '../types';
declare type TransformXYK = {
    x: number;
    y: number;
    k: number;
};
declare type NodePosUpdate = {
    id: ElementId;
    pos: XYPosition;
};
declare type NodeUpdate = {
    id: ElementId;
    width: number;
    height: number;
    handleBounds: {
        source: HandleElement[] | null;
        target: HandleElement[] | null;
    };
};
declare type SelectionUpdate = {
    isActive: boolean;
    selection?: SelectionRect;
};
declare type D3Init = {
    zoom: ZoomBehavior<Element, unknown>;
    selection: D3Selection<Element, unknown, null, undefined>;
};
export interface StoreModel {
    width: number;
    height: number;
    transform: Transform;
    nodes: Node[];
    edges: Edge[];
    selectedElements: Elements;
    selectedNodesBbox: Rect;
    d3Zoom: ZoomBehavior<Element, unknown> | null;
    d3Selection: D3Selection<Element, unknown, null, undefined> | null;
    d3Initialised: boolean;
    nodesSelectionActive: boolean;
    selectionActive: boolean;
    selection: SelectionRect | null;
    connectionSourceId: ElementId | null;
    connectionPosition: XYPosition;
    onConnect: OnConnectFunc;
    setOnConnect: Action<StoreModel, OnConnectFunc>;
    setNodes: Action<StoreModel, Node[]>;
    setEdges: Action<StoreModel, Edge[]>;
    updateNodeData: Action<StoreModel, NodeUpdate>;
    updateNodePos: Action<StoreModel, NodePosUpdate>;
    setSelection: Action<StoreModel, boolean>;
    setNodesSelection: Action<StoreModel, SelectionUpdate>;
    setSelectedElements: Action<StoreModel, Elements | Node | Edge>;
    updateSelection: Action<StoreModel, SelectionRect>;
    updateTransform: Action<StoreModel, TransformXYK>;
    updateSize: Action<StoreModel, Dimensions>;
    initD3: Action<StoreModel, D3Init>;
    setConnectionPosition: Action<StoreModel, XYPosition>;
    setConnectionSourceId: Action<StoreModel, ElementId | null>;
}
declare const store: {
    getState: () => import("easy-peasy").IntermediateStateMapper<{
        width: number;
        height: number;
        transform: [number, number, number];
        nodes: Node[];
        edges: Edge[];
        selectedElements: (Node | Edge)[];
        selectedNodesBbox: Rect;
        d3Zoom: ZoomBehavior<Element, unknown> | null;
        d3Selection: D3Selection<Element, unknown, null, undefined> | null;
        d3Initialised: boolean;
        nodesSelectionActive: boolean;
        selectionActive: boolean;
        selection: SelectionRect | null;
        connectionSourceId: string | null;
        connectionPosition: XYPosition;
        onConnect: OnConnectFunc;
    }, "1">;
    subscribe: (listener: () => void) => import("redux").Unsubscribe;
    replaceReducer: (nextReducer: import("redux").Reducer<import("easy-peasy").IntermediateStateMapper<{
        width: number;
        height: number;
        transform: [number, number, number];
        nodes: Node[];
        edges: Edge[];
        selectedElements: (Node | Edge)[];
        selectedNodesBbox: Rect;
        d3Zoom: ZoomBehavior<Element, unknown> | null;
        d3Selection: D3Selection<Element, unknown, null, undefined> | null;
        d3Initialised: boolean;
        nodesSelectionActive: boolean;
        selectionActive: boolean;
        selection: SelectionRect | null;
        connectionSourceId: string | null;
        connectionPosition: XYPosition;
        onConnect: OnConnectFunc;
    }, "1">, import("redux").AnyAction>) => void;
    dispatch: import("easy-peasy").Dispatch<StoreModel, import("redux").Action<any>>;
    addModel: <ModelSlice extends object>(key: string, modelSlice: ModelSlice) => void;
    clearMockedActions: () => void;
    getActions: () => import("easy-peasy").ActionMapper<{
        selectedNodesBbox: Rect;
        d3Zoom: ZoomBehavior<Element, unknown> | null;
        d3Selection: D3Selection<Element, unknown, null, undefined> | null;
        selection: SelectionRect | null;
        connectionPosition: XYPosition;
        onConnect: OnConnectFunc;
        setOnConnect: Action<StoreModel, OnConnectFunc>;
        setNodes: Action<StoreModel, Node[]>;
        setEdges: Action<StoreModel, Edge[]>;
        updateNodeData: Action<StoreModel, NodeUpdate>;
        updateNodePos: Action<StoreModel, NodePosUpdate>;
        setSelection: Action<StoreModel, boolean>;
        setNodesSelection: Action<StoreModel, SelectionUpdate>;
        setSelectedElements: Action<StoreModel, Node | Edge | (Node | Edge)[]>;
        updateSelection: Action<StoreModel, SelectionRect>;
        updateTransform: Action<StoreModel, TransformXYK>;
        updateSize: Action<StoreModel, Dimensions>;
        initD3: Action<StoreModel, D3Init>;
        setConnectionPosition: Action<StoreModel, XYPosition>;
        setConnectionSourceId: Action<StoreModel, string | null>;
    }, "1">;
    getListeners: () => import("easy-peasy").ListenerMapper<{
        selectedNodesBbox: Rect;
        d3Zoom: ZoomBehavior<Element, unknown> | null;
        d3Selection: D3Selection<Element, unknown, null, undefined> | null;
        selection: SelectionRect | null;
        connectionPosition: XYPosition;
        onConnect: OnConnectFunc;
    }, "1">;
    getMockedActions: () => import("easy-peasy").MockedAction[];
    reconfigure: <NewStoreModel extends object>(model: NewStoreModel) => void;
    removeModel: (key: string) => void;
};
export default store;

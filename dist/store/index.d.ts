import { Action } from 'easy-peasy';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { ElementId, Elements, Transform, Node, Edge, Rect, Dimensions, XYPosition, OnConnectFunc, SelectionRect } from '../types';
declare type TransformXYK = {
    x: number;
    y: number;
    k: number;
};
declare type NodePosUpdate = {
    id: ElementId;
    pos: XYPosition;
};
declare type NodeDimensionUpdate = {
    id: ElementId;
    nodeElement: HTMLDivElement;
};
declare type SelectionUpdate = {
    isActive: boolean;
    selection?: SelectionRect;
};
declare type D3Init = {
    zoom: ZoomBehavior<Element, unknown>;
    selection: D3Selection<Element, unknown, null, undefined>;
};
declare type SetSnapGrid = {
    snapToGrid: boolean;
    snapGrid: [number, number];
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
    userSelectionRect: SelectionRect;
    connectionSourceId: ElementId | null;
    connectionPosition: XYPosition;
    snapToGrid: boolean;
    snapGrid: [number, number];
    isInteractive: boolean;
    onConnect: OnConnectFunc;
    setOnConnect: Action<StoreModel, OnConnectFunc>;
    setNodes: Action<StoreModel, Node[]>;
    setEdges: Action<StoreModel, Edge[]>;
    updateNodeDimensions: Action<StoreModel, NodeDimensionUpdate>;
    updateNodePos: Action<StoreModel, NodePosUpdate>;
    setSelection: Action<StoreModel, boolean>;
    setNodesSelection: Action<StoreModel, SelectionUpdate>;
    setSelectedElements: Action<StoreModel, Elements | Node | Edge>;
    updateSelection: Action<StoreModel, SelectionRect>;
    updateTransform: Action<StoreModel, TransformXYK>;
    updateSize: Action<StoreModel, Dimensions>;
    initD3: Action<StoreModel, D3Init>;
    setSnapGrid: Action<StoreModel, SetSnapGrid>;
    setConnectionPosition: Action<StoreModel, XYPosition>;
    setConnectionSourceId: Action<StoreModel, ElementId | null>;
    setInteractive: Action<StoreModel, boolean>;
    setUserSelection: Action<StoreModel, XYPosition>;
    updateUserSelection: Action<StoreModel, XYPosition>;
    unsetUserSelection: Action<StoreModel>;
}
declare const store: import("easy-peasy").Store<StoreModel, import("easy-peasy").EasyPeasyConfig<{}, any>>;
export default store;

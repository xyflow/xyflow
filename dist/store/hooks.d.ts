import { StoreModel } from './index';
export declare const useStoreActions: <Result>(mapActions: (actions: import("easy-peasy").ActionMapper<{
    selectedNodesBbox: import("../types").Rect;
    d3Zoom: import("d3-zoom").ZoomBehavior<Element, unknown> | null;
    d3Selection: import("d3-selection").Selection<Element, unknown, null, undefined> | null;
    selection: import("../types").SelectionRect | null;
    connectionPosition: import("../types").XYPosition;
    onConnect: import("../types").OnConnectFunc;
    setOnConnect: import("easy-peasy").Action<StoreModel, import("../types").OnConnectFunc>;
    setNodes: import("easy-peasy").Action<StoreModel, import("../types").Node[]>;
    setEdges: import("easy-peasy").Action<StoreModel, import("../types").Edge[]>;
    updateNodeData: import("easy-peasy").Action<StoreModel, {
        id: string;
        width: number;
        height: number;
        handleBounds: {
            source: import("../types").HandleElement[] | null;
            target: import("../types").HandleElement[] | null;
        };
    }>;
    updateNodePos: import("easy-peasy").Action<StoreModel, {
        id: string;
        pos: import("../types").XYPosition;
    }>;
    setSelection: import("easy-peasy").Action<StoreModel, boolean>;
    setNodesSelection: import("easy-peasy").Action<StoreModel, {
        isActive: boolean;
        selection?: import("../types").SelectionRect | undefined;
    }>;
    setSelectedElements: import("easy-peasy").Action<StoreModel, import("../types").Node | import("../types").Edge | (import("../types").Node | import("../types").Edge)[]>;
    updateSelection: import("easy-peasy").Action<StoreModel, import("../types").SelectionRect>;
    updateTransform: import("easy-peasy").Action<StoreModel, {
        x: number;
        y: number;
        k: number;
    }>;
    updateSize: import("easy-peasy").Action<StoreModel, import("../types").Dimensions>;
    initD3: import("easy-peasy").Action<StoreModel, {
        zoom: import("d3-zoom").ZoomBehavior<Element, unknown>;
        selection: import("d3-selection").Selection<Element, unknown, null, undefined>;
    }>;
    setSnapGrid: import("easy-peasy").Action<StoreModel, {
        snapToGrid: boolean;
        snapGrid: [number, number];
    }>;
    setConnectionPosition: import("easy-peasy").Action<StoreModel, import("../types").XYPosition>;
    setConnectionSourceId: import("easy-peasy").Action<StoreModel, string | null>;
}, "1">) => Result) => Result;
export declare const useStoreDispatch: () => import("easy-peasy").Dispatch<StoreModel, import("redux").Action<any>>;
export declare const useStoreState: <Result>(mapState: (state: import("easy-peasy").IntermediateStateMapper<{
    width: number;
    height: number;
    transform: [number, number, number];
    nodes: import("../types").Node[];
    edges: import("../types").Edge[];
    selectedElements: (import("../types").Node | import("../types").Edge)[];
    selectedNodesBbox: import("../types").Rect;
    d3Zoom: import("d3-zoom").ZoomBehavior<Element, unknown> | null;
    d3Selection: import("d3-selection").Selection<Element, unknown, null, undefined> | null;
    d3Initialised: boolean;
    nodesSelectionActive: boolean;
    selectionActive: boolean;
    selection: import("../types").SelectionRect | null;
    connectionSourceId: string | null;
    connectionPosition: import("../types").XYPosition;
    snapToGrid: boolean;
    snapGrid: [number, number];
    onConnect: import("../types").OnConnectFunc;
}, "1">) => Result, dependencies?: any[] | undefined) => Result;

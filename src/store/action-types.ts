import {
  OnConnectFunc,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  Dimensions,
  Elements,
  NodePosUpdate,
  NodeDiffUpdate,
  Transform,
  TranslateExtent,
  XYPosition,
  SnapGrid,
  ConnectionMode,
  SetConnectionId,
  NodeDimensionUpdate,
  InitD3ZoomPayload,
} from '../types';

export const SET_ON_CONNECT = 'SET_ON_CONNECT';
export const SET_ON_CONNECT_START = 'SET_ON_CONNECT_START';
export const SET_ON_CONNECT_STOP = 'SET_ON_CONNECT_STOP';
export const SET_ON_CONNECT_END = 'SET_ON_CONNECT_END';
export const SET_ELEMENTS = 'SET_ELEMENTS';
export const BATCH_UPDATE_NODE_DIMENSIONS = 'BATCH_UPDATE_NODE_DIMENSIONS';
export const UPDATE_NODE_DIMENSIONS = 'UPDATE_NODE_DIMENSIONS';
export const UPDATE_NODE_POS = 'UPDATE_NODE_POS';
export const UPDATE_NODE_POS_DIFF = 'UPDATE_NODE_POS_DIFF';
export const SET_USER_SELECTION = 'SET_USER_SELECTION';
export const UPDATE_USER_SELECTION = 'UPDATE_USER_SELECTION';
export const UNSET_USER_SELECTION = 'UNSET_USER_SELECTION';
export const SET_SELECTION = 'SET_SELECTION';
export const UNSET_NODES_SELECTION = 'UNSET_NODES_SELECTION';
export const SET_SELECTED_ELEMENTS = 'SET_SELECTED_ELEMENTS';
export const RESET_SELECTED_ELEMENTS = 'RESET_SELECTED_ELEMENTS';
export const ADD_SELECTED_ELEMENTS = 'ADD_SELECTED_ELEMENTS';
export const UPDATE_TRANSFORM = 'UPDATE_TRANSFORM';
export const UPDATE_SIZE = 'UPDATE_SIZE';
export const INIT_D3ZOOM = 'INIT_D3ZOOM';
export const SET_MINZOOM = 'SET_MINZOOM';
export const SET_MAXZOOM = 'SET_MAXZOOM';
export const SET_TRANSLATEEXTENT = 'SET_TRANSLATEEXTENT';
export const SET_CONNECTION_POSITION = 'SET_CONNECTION_POSITION';
export const SET_CONNECTION_NODEID = 'SET_CONNECTION_NODEID';
export const SET_SNAPTOGRID = 'SET_SNAPTOGRID';
export const SET_SNAPGRID = 'SET_SNAPGRID';
export const SET_INTERACTIVE = 'SET_INTERACTIVE';
export const SET_NODES_DRAGGABLE = 'SET_NODES_DRAGGABLE';
export const SET_NODES_CONNECTABLE = 'SET_NODES_CONNECTABLE';
export const SET_ELEMENTS_SELECTABLE = 'SET_ELEMENTS_SELECTABLE';
export const SET_MULTI_SELECTION_ACTIVE = 'SET_MULTI_SELECTION_ACTIVE';
export const SET_CONNECTION_MODE = 'SET_CONNECTION_MODE';

interface OnConnectAction {
  type: typeof SET_ON_CONNECT;
  payload: {
    onConnect: OnConnectFunc;
  };
}

interface OnConnectStartAction {
  type: typeof SET_ON_CONNECT_START;
  payload: {
    onConnectStart: OnConnectStartFunc;
  };
}

interface OnConnectStopAction {
  type: typeof SET_ON_CONNECT_STOP;
  payload: {
    onConnectStop: OnConnectStopFunc;
  };
}

interface OnConnectEndAction {
  type: typeof SET_ON_CONNECT_END;
  payload: {
    onConnectEnd: OnConnectEndFunc;
  };
}

interface SetElementsAction {
  type: typeof SET_ELEMENTS;
  elements: Elements;
}

interface BatchUpdateNodeDimensions {
  type: typeof BATCH_UPDATE_NODE_DIMENSIONS;
  updates: NodeDimensionUpdate[];
}

interface UpdateNodeDimensions {
  type: typeof UPDATE_NODE_DIMENSIONS;
  payload: NodeDimensionUpdate;
}

interface UpdateNodePos {
  type: typeof UPDATE_NODE_POS;
  payload: NodePosUpdate;
}

interface UpdateNodePosDiff {
  type: typeof UPDATE_NODE_POS_DIFF;
  payload: NodeDiffUpdate;
}

interface SetUserSelection {
  type: typeof SET_USER_SELECTION;
  mousePos: XYPosition;
}

interface UpdateUserSelection {
  type: typeof UPDATE_USER_SELECTION;
  mousePos: XYPosition;
}

interface UnsetUserSelection {
  type: typeof UNSET_USER_SELECTION;
}

interface SetSelection {
  type: typeof SET_SELECTION;
  payload: {
    selectionActive: boolean;
  };
}

interface UnsetNodesSelection {
  type: typeof UNSET_NODES_SELECTION;
  payload: {
    nodesSelectionActive: boolean;
  };
}

interface ResetSelectedElements {
  type: typeof RESET_SELECTED_ELEMENTS;
  payload: {
    selectedElements: Elements | null;
  };
}

interface SetSelectedElements {
  type: typeof SET_SELECTED_ELEMENTS;
  elements: Elements;
}

interface AddSelectedElements {
  type: typeof ADD_SELECTED_ELEMENTS;
  elements: Elements;
}

interface UpdateTransform {
  type: typeof UPDATE_TRANSFORM;
  payload: {
    transform: Transform;
  };
}

interface UpdateSize {
  type: typeof UPDATE_SIZE;
  payload: Dimensions;
}

interface InitD3Zoom {
  type: typeof INIT_D3ZOOM;
  payload: InitD3ZoomPayload;
}

interface SetMinZoom {
  type: typeof SET_MINZOOM;
  payload: {
    minZoom: number;
  };
}

interface SetMaxZoom {
  type: typeof SET_MAXZOOM;
  payload: {
    maxZoom: number;
  };
}

interface SetTranslateExtent {
  type: typeof SET_TRANSLATEEXTENT;
  payload: {
    translateExtent: TranslateExtent;
  };
}

interface SetConnectionPosition {
  type: typeof SET_CONNECTION_POSITION;
  payload: {
    connectionPosition: XYPosition;
  };
}

interface SetConnectionNodeId {
  type: typeof SET_CONNECTION_NODEID;
  payload: SetConnectionId;
}

interface SetSnapToGrid {
  type: typeof SET_SNAPTOGRID;
  payload: {
    snapToGrid: boolean;
  };
}

interface SetSnapGrid {
  type: typeof SET_SNAPGRID;
  payload: {
    snapGrid: SnapGrid;
  };
}

interface SetInteractive {
  type: typeof SET_INTERACTIVE;
  payload: {
    nodesDraggable: boolean;
    nodesConnectable: boolean;
    elementsSelectable: boolean;
  };
}

interface SetNodesDraggable {
  type: typeof SET_NODES_DRAGGABLE;
  payload: {
    nodesDraggable: boolean;
  };
}

interface SetNodesConnectable {
  type: typeof SET_NODES_CONNECTABLE;
  payload: {
    nodesConnectable: boolean;
  };
}

interface SetElementsSelectable {
  type: typeof SET_ELEMENTS_SELECTABLE;
  payload: {
    elementsSelectable: boolean;
  };
}

interface SetMultiSelectionActive {
  type: typeof SET_MULTI_SELECTION_ACTIVE;
  payload: {
    multiSelectionActive: boolean;
  };
}

interface SetConnectionMode {
  type: typeof SET_CONNECTION_MODE;
  payload: {
    connectionMode: ConnectionMode;
  };
}

export type ReactFlowActionTypes =
  | OnConnectAction
  | OnConnectStartAction
  | OnConnectStopAction
  | OnConnectEndAction
  | SetElementsAction
  | BatchUpdateNodeDimensions
  | UpdateNodeDimensions
  | UpdateNodePos
  | UpdateNodePosDiff
  | SetUserSelection
  | UpdateUserSelection
  | UnsetUserSelection
  | SetSelection
  | UnsetNodesSelection
  | ResetSelectedElements
  | SetSelectedElements
  | AddSelectedElements
  | UpdateTransform
  | UpdateSize
  | InitD3Zoom
  | SetMinZoom
  | SetMaxZoom
  | SetTranslateExtent
  | SetConnectionPosition
  | SetConnectionNodeId
  | SetSnapToGrid
  | SetSnapGrid
  | SetInteractive
  | SetNodesDraggable
  | SetNodesConnectable
  | SetElementsSelectable
  | SetMultiSelectionActive
  | SetConnectionMode;

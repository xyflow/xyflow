import {
  Elements,
  OnConnectEndFunc,
  OnConnectFunc,
  OnConnectStartFunc,
  OnConnectStopFunc,
  NodeDimensionUpdate,
  NodePosUpdate,
  NodeDiffUpdate,
  XYPosition,
  Transform,
  Dimensions,
  InitD3ZoomPayload,
  TranslateExtent,
  SetConnectionId,
  SnapGrid,
  ConnectionMode,
} from '../types';

import {
  ReactFlowActionTypes,
  SET_ON_CONNECT,
  SET_ON_CONNECT_START,
  SET_ON_CONNECT_STOP,
  SET_ON_CONNECT_END,
  SET_ELEMENTS,
  BATCH_UPDATE_NODE_DIMENSIONS,
  UPDATE_NODE_DIMENSIONS,
  UPDATE_NODE_POS,
  UPDATE_NODE_POS_DIFF,
  SET_USER_SELECTION,
  UNSET_USER_SELECTION,
  SET_SELECTION,
  UNSET_NODES_SELECTION,
  RESET_SELECTED_ELEMENTS,
  SET_SELECTED_ELEMENTS,
  ADD_SELECTED_ELEMENTS,
  UPDATE_TRANSFORM,
  UPDATE_SIZE,
  INIT_D3ZOOM,
  SET_MINZOOM,
  SET_MAXZOOM,
  SET_TRANSLATEEXTENT,
  SET_CONNECTION_POSITION,
  SET_CONNECTION_NODEID,
  SET_SNAPTOGRID,
  SET_SNAPGRID,
  SET_INTERACTIVE,
  SET_NODES_DRAGGABLE,
  SET_NODES_CONNECTABLE,
  SET_ELEMENTS_SELECTABLE,
  SET_MULTI_SELECTION_ACTIVE,
  SET_CONNECTION_MODE,
} from './action-types';

export const setOnConnect = (onConnect: OnConnectFunc): ReactFlowActionTypes => ({
  type: SET_ON_CONNECT,
  payload: {
    onConnect,
  },
});

export const setOnConnectStart = (onConnectStart: OnConnectStartFunc): ReactFlowActionTypes => ({
  type: SET_ON_CONNECT_START,
  payload: {
    onConnectStart,
  },
});

export const setOnConnectStop = (onConnectStop: OnConnectStopFunc): ReactFlowActionTypes => ({
  type: SET_ON_CONNECT_STOP,
  payload: {
    onConnectStop,
  },
});

export const setOnConnectEnd = (onConnectEnd: OnConnectEndFunc): ReactFlowActionTypes => ({
  type: SET_ON_CONNECT_END,
  payload: {
    onConnectEnd,
  },
});

export const setElements = (elements: Elements): ReactFlowActionTypes => ({
  type: SET_ELEMENTS,
  elements,
});

export const batchUpdateNodeDimensions = (updates: NodeDimensionUpdate[]): ReactFlowActionTypes => ({
  type: BATCH_UPDATE_NODE_DIMENSIONS,
  updates,
});

export const updateNodeDimensions = (payload: NodeDimensionUpdate): ReactFlowActionTypes => ({
  type: UPDATE_NODE_DIMENSIONS,
  payload,
});

export const updateNodePos = (payload: NodePosUpdate): ReactFlowActionTypes => ({
  type: UPDATE_NODE_POS,
  payload,
});

export const updateNodePosDiff = (payload: NodeDiffUpdate): ReactFlowActionTypes => ({
  type: UPDATE_NODE_POS_DIFF,
  payload,
});

export const setUserSelection = (mousePos: XYPosition): ReactFlowActionTypes => ({
  type: SET_USER_SELECTION,
  mousePos,
});

export const updateUserSelection = (mousePos: XYPosition): ReactFlowActionTypes => ({
  type: SET_USER_SELECTION,
  mousePos,
});

export const unsetUserSelection = (): ReactFlowActionTypes => ({
  type: UNSET_USER_SELECTION,
});

export const setSelection = (selectionActive: boolean): ReactFlowActionTypes => ({
  type: SET_SELECTION,
  payload: {
    selectionActive,
  },
});

export const unsetNodesSelection = (): ReactFlowActionTypes => ({
  type: UNSET_NODES_SELECTION,
  payload: {
    nodesSelectionActive: false,
  },
});

export const resetSelectedElements = (): ReactFlowActionTypes => ({
  type: RESET_SELECTED_ELEMENTS,
  payload: {
    selectedElements: null,
  },
});

export const setSelectedElements = (elements: Elements): ReactFlowActionTypes => ({
  type: SET_SELECTED_ELEMENTS,
  elements,
});

export const addSelectedElements = (elements: Elements): ReactFlowActionTypes => ({
  type: ADD_SELECTED_ELEMENTS,
  elements,
});

export const updateTransform = (transform: Transform): ReactFlowActionTypes => ({
  type: UPDATE_TRANSFORM,
  payload: {
    transform,
  },
});

export const updateSize = (size: Dimensions): ReactFlowActionTypes => ({
  type: UPDATE_SIZE,
  payload: {
    width: size.width || 500,
    height: size.height || 500,
  },
});

export const initD3Zoom = (payload: InitD3ZoomPayload): ReactFlowActionTypes => ({
  type: INIT_D3ZOOM,
  payload,
});

export const setMinZoom = (minZoom: number): ReactFlowActionTypes => ({
  type: SET_MINZOOM,
  payload: { minZoom },
});

export const setMaxZoom = (maxZoom: number): ReactFlowActionTypes => ({
  type: SET_MAXZOOM,
  payload: { maxZoom },
});

export const setTranslateExtent = (translateExtent: TranslateExtent): ReactFlowActionTypes => ({
  type: SET_TRANSLATEEXTENT,
  payload: { translateExtent },
});

export const setConnectionPosition = (connectionPosition: XYPosition): ReactFlowActionTypes => ({
  type: SET_CONNECTION_POSITION,
  payload: { connectionPosition },
});

export const setConnectionNodeId = (payload: SetConnectionId): ReactFlowActionTypes => ({
  type: SET_CONNECTION_NODEID,
  payload,
});

export const setSnapToGrid = (snapToGrid: boolean): ReactFlowActionTypes => ({
  type: SET_SNAPTOGRID,
  payload: { snapToGrid },
});

export const setSnapGrid = (snapGrid: SnapGrid): ReactFlowActionTypes => ({
  type: SET_SNAPGRID,
  payload: { snapGrid },
});

export const setInteractive = (isInteractive: boolean): ReactFlowActionTypes => ({
  type: SET_INTERACTIVE,
  payload: {
    nodesDraggable: isInteractive,
    nodesConnectable: isInteractive,
    elementsSelectable: isInteractive,
  },
});

export const setNodesDraggable = (nodesDraggable: boolean): ReactFlowActionTypes => ({
  type: SET_NODES_DRAGGABLE,
  payload: { nodesDraggable },
});

export const setNodesConnectable = (nodesConnectable: boolean): ReactFlowActionTypes => ({
  type: SET_NODES_CONNECTABLE,
  payload: { nodesConnectable },
});

export const setElementsSelectable = (elementsSelectable: boolean): ReactFlowActionTypes => ({
  type: SET_ELEMENTS_SELECTABLE,
  payload: { elementsSelectable },
});

export const setMultiSelectionActive = (multiSelectionActive: boolean): ReactFlowActionTypes => ({
  type: SET_MULTI_SELECTION_ACTIVE,
  payload: { multiSelectionActive },
});

export const setConnectionMode = (connectionMode: ConnectionMode): ReactFlowActionTypes => ({
  type: SET_CONNECTION_MODE,
  payload: { connectionMode },
});

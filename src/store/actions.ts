import { createAction } from './utils';

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
  UPDATE_USER_SELECTION,
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
} from './contants';

export const setOnConnect = (onConnect: OnConnectFunc) =>
  createAction(SET_ON_CONNECT, {
    onConnect,
  });

export const setOnConnectStart = (onConnectStart: OnConnectStartFunc) =>
  createAction(SET_ON_CONNECT_START, {
    onConnectStart,
  });

export const setOnConnectStop = (onConnectStop: OnConnectStopFunc) =>
  createAction(SET_ON_CONNECT_STOP, {
    onConnectStop,
  });

export const setOnConnectEnd = (onConnectEnd: OnConnectEndFunc) =>
  createAction(SET_ON_CONNECT_END, {
    onConnectEnd,
  });

export const setElements = (elements: Elements) => createAction(SET_ELEMENTS, elements);

export const batchUpdateNodeDimensions = (updates: NodeDimensionUpdate[]) =>
  createAction(BATCH_UPDATE_NODE_DIMENSIONS, updates);

export const updateNodeDimensions = (payload: NodeDimensionUpdate) => createAction(UPDATE_NODE_DIMENSIONS, payload);

export const updateNodePos = (payload: NodePosUpdate) => createAction(UPDATE_NODE_POS, payload);

export const updateNodePosDiff = (payload: NodeDiffUpdate) => createAction(UPDATE_NODE_POS_DIFF, payload);

export const setUserSelection = (mousePos: XYPosition) => createAction(SET_USER_SELECTION, mousePos);

export const updateUserSelection = (mousePos: XYPosition) => createAction(UPDATE_USER_SELECTION, mousePos);

export const unsetUserSelection = () => createAction(UNSET_USER_SELECTION);

export const setSelection = (selectionActive: boolean) =>
  createAction(SET_SELECTION, {
    selectionActive,
  });

export const unsetNodesSelection = () =>
  createAction(UNSET_NODES_SELECTION, {
    nodesSelectionActive: false,
  });

export const resetSelectedElements = () =>
  createAction(RESET_SELECTED_ELEMENTS, {
    selectedElements: null,
  });

export const setSelectedElements = (elements: Elements) => createAction(SET_SELECTED_ELEMENTS, elements);

export const addSelectedElements = (elements: Elements) => createAction(ADD_SELECTED_ELEMENTS, elements);

export const updateTransform = (transform: Transform) => createAction(UPDATE_TRANSFORM, { transform });

export const updateSize = (size: Dimensions) =>
  createAction(UPDATE_SIZE, {
    width: size.width || 500,
    height: size.height || 500,
  });

export const initD3Zoom = (payload: InitD3ZoomPayload) => createAction(INIT_D3ZOOM, payload);

export const setMinZoom = (minZoom: number) => createAction(SET_MINZOOM, minZoom);

export const setMaxZoom = (maxZoom: number) => createAction(SET_MAXZOOM, maxZoom);

export const setTranslateExtent = (translateExtent: TranslateExtent) =>
  createAction(SET_TRANSLATEEXTENT, translateExtent);

export const setConnectionPosition = (connectionPosition: XYPosition) =>
  createAction(SET_CONNECTION_POSITION, { connectionPosition });

export const setConnectionNodeId = (payload: SetConnectionId) => createAction(SET_CONNECTION_NODEID, payload);

export const setSnapToGrid = (snapToGrid: boolean) => createAction(SET_SNAPTOGRID, { snapToGrid });

export const setSnapGrid = (snapGrid: SnapGrid) => createAction(SET_SNAPGRID, { snapGrid });

export const setInteractive = (isInteractive: boolean) =>
  createAction(SET_INTERACTIVE, {
    nodesDraggable: isInteractive,
    nodesConnectable: isInteractive,
    elementsSelectable: isInteractive,
  });

export const setNodesDraggable = (nodesDraggable: boolean) => createAction(SET_NODES_DRAGGABLE, { nodesDraggable });

export const setNodesConnectable = (nodesConnectable: boolean) =>
  createAction(SET_NODES_CONNECTABLE, { nodesConnectable });

export const setElementsSelectable = (elementsSelectable: boolean) =>
  createAction(SET_ELEMENTS_SELECTABLE, { elementsSelectable });

export const setMultiSelectionActive = (multiSelectionActive: boolean) =>
  createAction(SET_MULTI_SELECTION_ACTIVE, { multiSelectionActive });

export const setConnectionMode = (connectionMode: ConnectionMode) =>
  createAction(SET_CONNECTION_MODE, { connectionMode });

export type ReactFlowAction = ReturnType<
  | typeof setOnConnect
  | typeof setOnConnectStart
  | typeof setOnConnectStop
  | typeof setOnConnectEnd
  | typeof setElements
  | typeof batchUpdateNodeDimensions
  | typeof updateNodeDimensions
  | typeof updateNodePos
  | typeof updateNodePosDiff
  | typeof setUserSelection
  | typeof updateUserSelection
  | typeof unsetUserSelection
  | typeof setSelection
  | typeof unsetNodesSelection
  | typeof resetSelectedElements
  | typeof setSelectedElements
  | typeof addSelectedElements
  | typeof updateTransform
  | typeof updateSize
  | typeof initD3Zoom
  | typeof setMinZoom
  | typeof setMaxZoom
  | typeof setTranslateExtent
  | typeof setConnectionPosition
  | typeof setConnectionNodeId
  | typeof setSnapToGrid
  | typeof setSnapGrid
  | typeof setInteractive
  | typeof setNodesDraggable
  | typeof setNodesConnectable
  | typeof setElementsSelectable
  | typeof setMultiSelectionActive
  | typeof setConnectionMode
>;

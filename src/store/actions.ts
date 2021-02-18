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
  NodeExtent,
} from '../types';

import * as constants from './contants';

export const setOnConnect = (onConnect: OnConnectFunc) =>
  createAction(constants.SET_ON_CONNECT, {
    onConnect,
  });

export const setOnConnectStart = (onConnectStart: OnConnectStartFunc) =>
  createAction(constants.SET_ON_CONNECT_START, {
    onConnectStart,
  });

export const setOnConnectStop = (onConnectStop: OnConnectStopFunc) =>
  createAction(constants.SET_ON_CONNECT_STOP, {
    onConnectStop,
  });

export const setOnConnectEnd = (onConnectEnd: OnConnectEndFunc) =>
  createAction(constants.SET_ON_CONNECT_END, {
    onConnectEnd,
  });

export const setElements = (elements: Elements) => createAction(constants.SET_ELEMENTS, elements);

export const updateNodeDimensions = (updates: NodeDimensionUpdate[]) =>
  createAction(constants.UPDATE_NODE_DIMENSIONS, updates);

export const updateNodePos = (payload: NodePosUpdate) => createAction(constants.UPDATE_NODE_POS, payload);

export const updateNodePosDiff = (payload: NodeDiffUpdate) => createAction(constants.UPDATE_NODE_POS_DIFF, payload);

export const setUserSelection = (mousePos: XYPosition) => createAction(constants.SET_USER_SELECTION, mousePos);

export const updateUserSelection = (mousePos: XYPosition) => createAction(constants.UPDATE_USER_SELECTION, mousePos);

export const unsetUserSelection = () => createAction(constants.UNSET_USER_SELECTION);

export const setSelection = (selectionActive: boolean) =>
  createAction(constants.SET_SELECTION, {
    selectionActive,
  });

export const unsetNodesSelection = () =>
  createAction(constants.UNSET_NODES_SELECTION, {
    nodesSelectionActive: false,
  });

export const resetSelectedElements = () =>
  createAction(constants.RESET_SELECTED_ELEMENTS, {
    selectedElements: null,
  });

export const setSelectedElements = (elements: Elements) => createAction(constants.SET_SELECTED_ELEMENTS, elements);

export const addSelectedElements = (elements: Elements) => createAction(constants.ADD_SELECTED_ELEMENTS, elements);

export const updateTransform = (transform: Transform) => createAction(constants.UPDATE_TRANSFORM, { transform });

export const updateSize = (size: Dimensions) =>
  createAction(constants.UPDATE_SIZE, {
    width: size.width || 500,
    height: size.height || 500,
  });

export const initD3Zoom = (payload: InitD3ZoomPayload) => createAction(constants.INIT_D3ZOOM, payload);

export const setMinZoom = (minZoom: number) => createAction(constants.SET_MINZOOM, minZoom);

export const setMaxZoom = (maxZoom: number) => createAction(constants.SET_MAXZOOM, maxZoom);

export const setTranslateExtent = (translateExtent: TranslateExtent) =>
  createAction(constants.SET_TRANSLATEEXTENT, translateExtent);

export const setConnectionPosition = (connectionPosition: XYPosition) =>
  createAction(constants.SET_CONNECTION_POSITION, { connectionPosition });

export const setConnectionNodeId = (payload: SetConnectionId) => createAction(constants.SET_CONNECTION_NODEID, payload);

export const setSnapToGrid = (snapToGrid: boolean) => createAction(constants.SET_SNAPTOGRID, { snapToGrid });

export const setSnapGrid = (snapGrid: SnapGrid) => createAction(constants.SET_SNAPGRID, { snapGrid });

export const setInteractive = (isInteractive: boolean) =>
  createAction(constants.SET_INTERACTIVE, {
    nodesDraggable: isInteractive,
    nodesConnectable: isInteractive,
    elementsSelectable: isInteractive,
  });

export const setNodesDraggable = (nodesDraggable: boolean) =>
  createAction(constants.SET_NODES_DRAGGABLE, { nodesDraggable });

export const setNodesConnectable = (nodesConnectable: boolean) =>
  createAction(constants.SET_NODES_CONNECTABLE, { nodesConnectable });

export const setElementsSelectable = (elementsSelectable: boolean) =>
  createAction(constants.SET_ELEMENTS_SELECTABLE, { elementsSelectable });

export const setMultiSelectionActive = (multiSelectionActive: boolean) =>
  createAction(constants.SET_MULTI_SELECTION_ACTIVE, { multiSelectionActive });

export const setConnectionMode = (connectionMode: ConnectionMode) =>
  createAction(constants.SET_CONNECTION_MODE, { connectionMode });

export const setNodeExtent = (nodeExtent: NodeExtent) => createAction(constants.SET_NODE_EXTENT, nodeExtent);

export type ReactFlowAction = ReturnType<
  | typeof setOnConnect
  | typeof setOnConnectStart
  | typeof setOnConnectStop
  | typeof setOnConnectEnd
  | typeof setElements
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
  | typeof setNodeExtent
>;

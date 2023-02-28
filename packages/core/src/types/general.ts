/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  ComponentType,
  MemoExoticComponent,
} from 'react';
import {
  FitViewParamsBase,
  FitViewOptionsBase,
  NodeProps,
  OnConnectStartParams,
  ZoomInOut,
  ZoomTo,
  SetViewport,
  GetZoom,
  GetViewport,
  SetCenter,
  FitBounds,
  Project,
} from '@reactflow/system';

import type { NodeChange, EdgeChange, Node, WrapNodeProps, Edge, EdgeProps, WrapEdgeProps, ReactFlowInstance } from '.';

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;

export type OnNodesDelete = (nodes: Node[]) => void;
export type OnEdgesDelete = (edges: Edge[]) => void;

export type NodeTypes = { [key: string]: ComponentType<NodeProps> };
export type NodeTypesWrapped = { [key: string]: MemoExoticComponent<ComponentType<WrapNodeProps>> };
export type EdgeTypes = { [key: string]: ComponentType<EdgeProps> };
export type EdgeTypesWrapped = { [key: string]: MemoExoticComponent<ComponentType<WrapEdgeProps>> };

export type UnselectNodesAndEdgesParams = {
  nodes?: Node[];
  edges?: Edge[];
};

export type OnSelectionChangeParams = {
  nodes: Node[];
  edges: Edge[];
};

export type OnSelectionChangeFunc = (params: OnSelectionChangeParams) => void;

export type OnConnectStart = (event: ReactMouseEvent | ReactTouchEvent, params: OnConnectStartParams) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent) => void;

export type FitViewParams = FitViewParamsBase<Node>;
export type FitViewOptions = FitViewOptionsBase<Node>;
export type FitView = (fitViewOptions?: FitViewOptions) => boolean;
export type OnInit<NodeData = any, EdgeData = any> = (reactFlowInstance: ReactFlowInstance<NodeData, EdgeData>) => void;

export type ViewportHelperFunctions = {
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

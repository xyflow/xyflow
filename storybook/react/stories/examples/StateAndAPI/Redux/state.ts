import { createSlice, configureStore, type PayloadAction } from '@reduxjs/toolkit';
import type { Node, Edge } from '@xyflow/react';
import { defaultFlowProps } from '@shared/defaultFlow';
const slice = createSlice({
  name: 'flow',
  initialState: {
    nodes: structuredClone(defaultFlowProps.nodes) as Node[],
    edges: structuredClone(defaultFlowProps.edges) as Edge[],
  },
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
  },
});
export const { setNodes, setEdges } = slice.actions;
export const createFlowStore = () => configureStore({ reducer: slice.reducer });
export type FlowState = ReturnType<ReturnType<typeof createFlowStore>['getState']>;

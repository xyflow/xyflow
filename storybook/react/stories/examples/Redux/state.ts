import { createSlice, configureStore } from '@reduxjs/toolkit';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { nodes, edges } from './initial-elements';

const initialState = {
  nodes,
  edges,
  selectedNodes: [],
  selectedEdges: [],
};

const setNodesReducer = (state, action) => {
  state.nodes = action.payload;
};

const setEdgesReducer = (state, action) => {
  state.edges = action.payload;
};

const onNodesChangeReducer = (state, action) => {
  const a = applyNodeChanges(action.payload, state.nodes);
  state.nodes = a;
};

const onEdgesChangeReducer = (state, action) => {
  const a = applyEdgeChanges(action.payload, state.edges);
  state.edges = a;
};

const setSelectedNodesAndEdgesReducer = (state, action) => {
  state.selectedNodes = action.payload.nodes;
  state.selectedEdges = action.payload.edges;
};

const setSelectedNodesReducer = (state, action) => {
  state.selectedNodes = action.payload;
};

const MyApplicationSlice = createSlice({
  name: 'MyApplication',
  initialState,
  reducers: {
    setNodes: setNodesReducer,
    setEdges: setEdgesReducer,
    onNodesChange: onNodesChangeReducer,
    onEdgesChange: onEdgesChangeReducer,
    setSelectedNodesAndEdges: setSelectedNodesAndEdgesReducer,
    setSelectedNodes: setSelectedNodesReducer,
  },
});

export const { setNodes, setEdges, onNodesChange, onEdgesChange, setSelectedNodesAndEdges, setSelectedNodes } =
  MyApplicationSlice.actions;

export const store = configureStore({
  reducer: {
    myApplication: MyApplicationSlice.reducer,
  },
});

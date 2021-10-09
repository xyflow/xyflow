import { createStore, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';

import { ReactFlowState } from '../types';
import { ReactFlowAction } from './actions';
import reactFlowReducer from './reducer';

export default function configureStore(preloadedState: ReactFlowState): Store<ReactFlowState, ReactFlowAction> {
  const store = createStore(reactFlowReducer, preloadedState, applyMiddleware(thunk));
  return store;
}

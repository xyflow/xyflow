import { createStore, Store } from 'redux';

import { ReactFlowState } from '../types';
import { ReactFlowAction } from './actions';
import reactFlowReducer from './reducer';

export default function configureStore(preloadedState: ReactFlowState): Store<ReactFlowState, ReactFlowAction> {
  const store = createStore(reactFlowReducer, preloadedState);
  return store;
}
